import {Context, DynamoDBGetItem, util} from '@aws-appsync/utils';

export function request(ctx: Context): DynamoDBGetItem{
  const userId = (ctx.identity as {sub: string}).sub;
  return {
    operation: 'GetItem',
    key: util.dynamodb.toMapValues({
      PK: `USER#${userId}`,
      SK: `USER#${userId}`
    })
  };
}

export function response(ctx: Context){
  if (ctx.error){
    util.error(ctx.error.message, ctx.error.type, ctx.result)
  }
  return ctx.result;
}
