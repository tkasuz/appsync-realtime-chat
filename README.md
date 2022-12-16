# AppSync realtime chat app

Super sclable GraphQL chat app with AppSync JavaScript resolver and DynamoDB designed with a single table.

## Tech Stack

| Module                 | Tech                      |
|------------------------|---------------------------|
| AppSync Resolver       | JavaScript                |
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
AWS Amplify generates DynamoDB tables with multi-table design based on `@model` directive, but deeply nested model tend to cause peformance issue since each resolver only focuses on retrieving one object at a time in sequaential. For example, Query to Global Secondary Index of Message table will be needed, if messages field is requested from Chat type, meaning GetItem to Chat table and Query to Message table are required. On the other hand, only the single query to Chat table is enought to get all messages belong to the chat for single-table desing. Farthermore, single-table is cost effective since it doesn't need any secondary-index.

