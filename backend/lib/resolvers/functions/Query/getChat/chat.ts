import {Context, DynamoDBGetItem, util} from '@aws-appsync/utils';

export function request(ctx: Context): DynamoDBGetItem{
  const { chatId } = ctx.args;
  return {
    operation: 'GetItem',
    key: util.dynamodb.toMapValues({PK: `CHAT#${chatId}`, SK: `CHAT#${chatId}`})
  }
}

export function response(ctx: Context){
  const { result } = ctx;
  if (ctx.error){
    util.error(ctx.error.message, ctx.error.type, ctx.result)
  }
  return {
    __typename: "Chat",
    ...result
  }
}
