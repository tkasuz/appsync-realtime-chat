import {Context, DynamoDBPutItemRequest, DynamoDBUpdateItemRequest, util} from '@aws-appsync/utils';
import { UpdateUserMutationVariables } from '../../API';

export function request(ctx: Context): DynamoDBPutItemRequest | DynamoDBUpdateItemRequest{
  const {result} = ctx.prev;
  const userId = (ctx.identity as {sub: string}).sub;
  const {input} = ctx.args as UpdateUserMutationVariables;
  const now = util.time.nowISO8601()
  if (result == null){
    return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({
        PK: `USER#${userId}`,
        SK: `USER#${userId}`
      }),
      attributeValues: util.dynamodb.toMapValues({
        name: input.name,
        profilePicture: input.profilePicture,
        id: userId,
        createdAt: now 
      })
    }
  } else {
    return {
      operation: 'UpdateItem',
      key: util.dynamodb.toMapValues({
        PK: `USER#${userId}`,
        SK: `USER#${userId}`
      }),
      update: {
        expression: "SET #name = :name, #profilePicture = :profilePicture",
        expressionValues: {
          ':name' : util.dynamodb.toDynamoDB(input.name),
          ':profilePicture': util.dynamodb.toDynamoDB(input.profilePicture)
        },
        expressionNames: {
          '#name': 'name',
          '#profilePicture': 'profilePicture'
        }
      }
    }
  }
}

export function response(ctx: Context){
  const { result } = ctx;
  if (ctx.error){
    util.error(ctx.error.message, ctx.error.type, ctx.result)
  }
  return {
    ...result,
    __typename: "User"
  }
}
