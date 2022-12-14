/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type SendMessageInput = {
  body: string,
  toChatId: string,
};

export type Message = {
  __typename: "Message",
  id: string,
  body: string,
  from: User,
  createdAt?: string | null,
};

export type User = {
  __typename: "User",
  id: string,
  name: string,
  profilePicture?: string | null,
  createdAt?: string | null,
};

export type CreateChatInput = {
  name?: string | null,
};

export type Chat = {
  __typename: "Chat",
  id: string,
  name: string,
  members?: Members | null,
  messages?: Messages | null,
  createdAt?: string | null,
};

export type Members = {
  __typename: "Members",
  items?:  Array<User | null > | null,
  nextToken?: string | null,
};

export type Messages = {
  __typename: "Messages",
  items?:  Array<Message | null > | null,
  nextToken?: string | null,
};

export type InviteMembersInput = {
  chatId: string,
  members: Array< string >,
};

export type UpdateUserInput = {
  name?: string | null,
  profilePicture?: string | null,
};

export type OnSendMessageFilter = {
  chatId: string,
};

export type SendMessageMutationVariables = {
  input: SendMessageInput,
};

export type SendMessageMutation = {
  sendMessage?:  {
    __typename: "Message",
    id: string,
    body: string,
    from:  {
      __typename: "User",
      id: string,
      name: string,
      profilePicture?: string | null,
      createdAt?: string | null,
    },
    createdAt?: string | null,
  } | null,
};

export type CreateChatMutationVariables = {
  input: CreateChatInput,
};

export type CreateChatMutation = {
  createChat?:  {
    __typename: "Chat",
    id: string,
    name: string,
    members?:  {
      __typename: "Members",
      items?:  Array< {
        __typename: "User",
        id: string,
        name: string,
        profilePicture?: string | null,
        createdAt?: string | null,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    messages?:  {
      __typename: "Messages",
      items?:  Array< {
        __typename: "Message",
        id: string,
        body: string,
        createdAt?: string | null,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
  } | null,
};

export type InviteMembersMutationVariables = {
  input: InviteMembersInput,
};

export type InviteMembersMutation = {
  inviteMembers?:  {
    __typename: "Members",
    items?:  Array< {
      __typename: "User",
      id: string,
      name: string,
      profilePicture?: string | null,
      createdAt?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    profilePicture?: string | null,
    createdAt?: string | null,
  } | null,
};

export type GetChatQueryVariables = {
  chatId: string,
};

export type GetChatQuery = {
  getChat?:  {
    __typename: "Chat",
    id: string,
    name: string,
    members?:  {
      __typename: "Members",
      items?:  Array< {
        __typename: "User",
        id: string,
        name: string,
        profilePicture?: string | null,
        createdAt?: string | null,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    messages?:  {
      __typename: "Messages",
      items?:  Array< {
        __typename: "Message",
        id: string,
        body: string,
        createdAt?: string | null,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
  } | null,
};

export type ListMembersQueryVariables = {
  chatId: string,
  nextToken?: string | null,
};

export type ListMembersQuery = {
  listMembers?:  {
    __typename: "Members",
    items?:  Array< {
      __typename: "User",
      id: string,
      name: string,
      profilePicture?: string | null,
      createdAt?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListMessagesQueryVariables = {
  chatId: string,
  nextToken?: string | null,
};

export type ListMessagesQuery = {
  listMessages?:  {
    __typename: "Messages",
    items?:  Array< {
      __typename: "Message",
      id: string,
      body: string,
      from:  {
        __typename: "User",
        id: string,
        name: string,
        profilePicture?: string | null,
        createdAt?: string | null,
      },
      createdAt?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnSendMessageSubscriptionVariables = {
  input: OnSendMessageFilter,
};

export type OnSendMessageSubscription = {
  onSendMessage?:  {
    __typename: "Message",
    id: string,
    body: string,
    from:  {
      __typename: "User",
      id: string,
      name: string,
      profilePicture?: string | null,
      createdAt?: string | null,
    },
    createdAt?: string | null,
  } | null,
};
