/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const sendMessage = /* GraphQL */ `
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
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
export const createChat = /* GraphQL */ `
  mutation CreateChat($input: CreateChatInput!) {
    createChat(input: $input) {
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
export const inviteMembers = /* GraphQL */ `
  mutation InviteMembers($input: InviteMembersInput!) {
    inviteMembers(input: $input) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      profilePicture
      createdAt
    }
  }
`;
