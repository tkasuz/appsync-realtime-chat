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
