/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onSendMessage = /* GraphQL */ `
  subscription OnSendMessage($input: OnSendMessageFilter!) {
    onSendMessage(input: $input) {
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
  }
`;
