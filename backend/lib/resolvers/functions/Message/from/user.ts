import {Context, DynamoDBGetItem, util} from '@aws-appsync/utils';

export function request(ctx: Context): DynamoDBGetItem{
  const { from } = ctx.source;
  return {
    operation: 'GetItem',
    key: util.dynamodb.toMapValues({PK: `USER#${from}`, SK: `USER#${from}`})
  }
}

export function response(ctx: Context){
  const { result } = ctx;
  if (ctx.error){
    util.error(ctx.error.message, ctx.error.type, ctx.result)
  }
  return {
    __typename: "User",
    ...result
  }
}
