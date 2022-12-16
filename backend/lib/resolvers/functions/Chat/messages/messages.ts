import {Context, DynamoDBQueryRequest, util} from '@aws-appsync/utils';

export function request(ctx: Context): DynamoDBQueryRequest{
  const { id } = ctx.source;
  return {
    operation: 'Query',
    query: {
      expression: 'PK = :chatId and begins_with(SK, :SK)',
      expressionValues: util.dynamodb.toMapValues({':chatId': `CHAT#${id}`, ':SK': 'MESSAGE'})
    }
  }
}

export function response(ctx: Context){
  if (ctx.error){
    util.error(ctx.error.message, ctx.error.type, ctx.result)
  }
  return {
    __typename: "Messages",
    ...ctx.result
  }
}
