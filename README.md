# AppSync realtime chat app

Super scalable GraphQL chat app with AppSync JavaScript resolver and DynamoDB designed with a single table.

## Tech Stack

| Module                 | Tech                      |
|------------------------|---------------------------|
| GraphQL Resolver       | JavaScript Resolver                |
| IaC                    | CDK                       |
| GraphQL Code Generation| Amplify CLI               |
| Datasource             | Amazon DynamoDB           |
| Unit test              | Jest                      |

## GraphQL Schema

```graphql
type Message {
    id: ID!
    body: String!
    from: User!
    createdAt: AWSDateTime
}

type User {
    id: ID!
    name: String!
    profilePicture: String
    createdAt: AWSDateTime
}

type Chat {
    id: ID!
    name: String!
    members: Members
    messages: Messages
    createdAt: AWSDateTime
}

type Members {
  items: [User]
  nextToken: String
}

type Messages {
  items: [Message]
  nextToken: String
}

input SendMessageInput {
  body: String!
  toChatId: ID!
}

input CreateChatInput {
  name: String
}

input InviteMembersInput {
  chatId: ID!
  members: [ID!]!
}

input UpdateUserInput {
  name: String
  profilePicture: String 
}

type Mutation {
  sendMessage(input: SendMessageInput!): Message
  createChat(input: CreateChatInput!): Chat
  inviteMembers(input: InviteMembersInput!): Members
  updateUser(input: UpdateUserInput!): User
}

input OnSendMessageFilter {
  chatId: ID!
}

type Subscription {
  onSendMessage(input: OnSendMessageFilter!): Message @aws_subscribe(mutations: ["sendMessage"])
}

type Query {
  getChat(chatId: ID!): Chat
}
```

## DynamoDB Design
AWS Amplify generates DynamoDB tables with multi-table design based on `@model` directive, but deeply nested model tend to cause peformance issue since each resolver only focuses on retrieving one object at a time in sequaential. For example, Query to Global Secondary Index of Message table will be needed, if messages field is requested from Chat type, meaning GetItem to Chat table and Query to Message table are required. On the other hand, only the single query to Chat table is enought to get all messages belong to the chat for single-table desing. Farthermore, single-table is cost effective since it doesn't need any secondary-index by combining multiple object types in a single table.

## Code Generation

Amplify CLI enables to generate TypeScript Models and Statements from AppSync Schema. You can add only Amplify Codegen project without `amplify init`

```bash
amplify codegen add
```

Edit auto-generated `.graphqlconfig.yml` to generate GraphQL statement for both front-end and backend

```yml
projects:
  Codegen Project:
    schemaPath: ./schema.graphql
    includes:
      - src/graphql/**/*.ts
    excludes:
      - ./amplify/**
    extensions:
      amplify:
        codeGenTarget: typescript
        generatedFileName: ./src/API.ts
        docsFilePath: src/graphql
        region: us-east-1
        apiId: null
        frontend: javascript
        framework: react
  backend:
    schemaPath: ./schema.graphql
    includes:
      - src/graphql/**/*.ts
    excludes:
      - ./amplify/**
    extensions:
      amplify:
        codeGenTarget: typescript
        generatedFileName: ./../backend/lib/resolvers/functions/API.ts
extensions:
  amplify:
    version: 3
```

You can generate TypeScript statements to implement AppSync Resolver.

```bash
amplify codegen
```

### Test
You can evaluate AppSync resolver template by using `Evaluate Code API`, and easily check if the given args are properly mapped to the request template. 

```bash
cd backend
yarn test
```

But the test will be evaluated via network connection, hence some test might timeout with default configuration for Jest. You can change maximum timeout value by setting `testTimeout` at `jest.config.js`

```javascript
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testTimeout: 15000
};
```

### TypeScript for AppSync Resolver
`tsconfig.json` should be separated from CDK code since `APPSYNC_JS` runtime provides functionality similer to the `ECMAScript (ES) version 6.0`

```bash
yarn add -D @aws-appsync/eslint-plugin
npm init @eslint/config # chose yarn as package manager
```

update `extends` property of `.eslintrc.yml`

```json
{
  "extends": ["plugin:@aws-appsync/base"]
}
```