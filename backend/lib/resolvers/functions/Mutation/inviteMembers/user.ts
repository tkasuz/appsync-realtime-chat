import {Context, DynamoDBBatchGetItemRequest, util} from '@aws-appsync/utils';

export function request(ctx: Context): DynamoDBBatchGetItemRequest{
  const {result} = ctx.prev;
  if (result.items.length == 0) util.error('No items found');
  const keys = []
  for (const item of result.items) {
    const userId = item.SK.split('#')[1];
    keys.push(util.dynamodb.toMapValues({
      PK: `USER#${userId}`,
      SK: `USER#${userId}`
    })) 
  }
  return {
    operation: 'BatchGetItem',
    tables: {
      chat: {
        keys: keys
      }
    }
  };
}

export function response(ctx: Context){
  const { result } = ctx
  if (ctx.error){
    util.error(ctx.error.message, ctx.error.type, ctx.result)
  }
  return {
    __typename: "Members",
    items: result.data.chat,
    nextToken: ctx.prev.result.nextToken
  }
}
