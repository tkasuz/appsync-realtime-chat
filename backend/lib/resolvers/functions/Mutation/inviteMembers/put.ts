import {Context, DynamoDBBatchPutItemRequest, util} from '@aws-appsync/utils';
import { InviteMembersMutationVariables } from '../../API';

export function request(ctx: Context): DynamoDBBatchPutItemRequest{
  const {input} = ctx.args as InviteMembersMutationVariables;
  ctx.stash.chatId = input.chatId;
  const now = util.time.nowISO8601()
  const keys = []
  for (const memberId of input.members) {
    keys.push(util.dynamodb.toMapValues({
      PK: `CHAT#${input.chatId}`,
      SK: `MEMBER#${memberId}`,
      userId: memberId,
      joinedAt: now
    })) 
  }
  return {
    operation: 'BatchPutItem',
    tables: {
      chat: keys 
    } 
  };
}

export function response(ctx: Context){
  if (ctx.error){
    util.error(ctx.error.message, ctx.error.type, ctx.result)
  }
  return ctx.result;
}
