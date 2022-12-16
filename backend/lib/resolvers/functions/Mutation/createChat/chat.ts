import {Context, DynamoDBPutItemRequest, util} from '@aws-appsync/utils';
import { CreateChatMutationVariables } from '../../API';

export function request(ctx: Context): DynamoDBPutItemRequest{
  const {input} = ctx.args as CreateChatMutationVariables;
  const chatId = util.autoUlid();

  if (ctx.identity == undefined) {
    util.unauthorized()
  } 
  const userId = (ctx.identity as {sub: string}).sub;
  const now = util.time.nowISO8601()
  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
      PK: `CHAT#${chatId}`,
      SK: `MEMBER#${userId}`
    }),
    attributeValues: util.dynamodb.toMapValues({
      createdAt: now,
      owner: userId,
      name: input.name,
      id: chatId
    }),
  };
}

export function response(ctx: Context){
  const { result } = ctx;
  if (ctx.error){
    util.error(ctx.error.message, ctx.error.type, ctx.result)
  }
  return {
    ...result,
    __typename: "Chat"
  }
}
