/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getChat = /* GraphQL */ `
  query GetChat($chatId: ID!) {
    getChat(chatId: $chatId) {
      id
      name
      members {
        items {
          id
          name
          profilePicture
          createdAt
        }
        nextToken
      }
      messages {
        items {
          id
          body
          createdAt
        }
        nextToken
      }
      createdAt
    }
  }
`;
export const listMembers = /* GraphQL */ `
  query ListMembers($chatId: ID!, $nextToken: String) {
    listMembers(chatId: $chatId, nextToken: $nextToken) {
      items {
        id
        name
        profilePicture
        createdAt
      }
      nextToken
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages($chatId: ID!, $nextToken: String) {
    listMessages(chatId: $chatId, nextToken: $nextToken) {
      items {
        id
        body
        from {
          id
          name
          profilePicture
          createdAt
        }
        createdAt
      }
      nextToken
    }
  }
`;
