import {util, extensions, Context} from '@aws-appsync/utils';
import {OnSendMessageSubscriptionVariables} from '../../API';

export function request(ctx: Context){
  return {} 
}

export function response(ctx: Context){
  const { input } = ctx.args as OnSendMessageSubscriptionVariables
  extensions.setSubscriptionFilter({
    filterGroup: [
      {
        filters: [
          {
            fieldName: "to",
            operator: "eq",
            value: input.chatId
          }
        ]
      }
    ]
  }) 
  if (ctx.error){
    util.error(ctx.error.message, ctx.error.type, ctx.result)
  } else {
    return ctx.result;
  }
}
