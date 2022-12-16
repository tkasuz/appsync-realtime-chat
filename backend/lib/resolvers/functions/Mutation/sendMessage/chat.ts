import {Context, DynamoDBPutItemRequest, util} from '@aws-appsync/utils';
import { SendMessageMutationVariables } from '../../API';

export function request(ctx: Context): DynamoDBPutItemRequest{
  const {input} = ctx.args as SendMessageMutationVariables;
  const messageId = util.autoUlid();
  const fromUserId = (ctx.identity as {sub: string}).sub;
  const now = util.time.nowISO8601()
  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
      PK: `CHAT#${input.toChatId}`,
      SK: `MESSAGE#${messageId}`
    }),
    attributeValues: util.dynamodb.toMapValues({
      body: input.body,
      from: fromUserId,
      id: messageId,
      createdAt: now
    }),
  };
}

export function response(ctx: Context){
  if (ctx.error){
    util.error(ctx.error.message, ctx.error.type, ctx.result)
  }
  return {
    __typename: "Message",
    ...ctx.result
  }
}
