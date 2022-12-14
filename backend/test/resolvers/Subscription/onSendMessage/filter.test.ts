import {AppSync} from 'aws-sdk'
import {readFile} from 'fs/promises';
import {OnSendMessageSubscriptionVariables} from '../../../../../frontend/src/API';
const appsync = new AppSync({region: 'us-east-1'});
import path = require('path');
const file = '../../../../lib/resolvers/Subscription/onSendMessage/filter.js';

test('validate an onSendMessage subscription filter', async () => {
  const context = JSON.stringify({
    arguments: {
      input: {
        chatId: 'chatId'
      }
    } as OnSendMessageSubscriptionVariables,
    identity: {
      sub: 'user1',
      claims: {
      },
      issuer: 'https://xxxxxxxxxx.auth0.com'
    }
  })
  const code = await readFile(path.join(__dirname, file), {encoding: 'utf8'})
  const runtime = { name: 'APPSYNC_JS', runtimeVersion: '1.0.0' }
  const params = {context, code, runtime, function: 'response'}
  const response = await appsync.evaluateCode(params).promise();
  expect(response.error).toBeUndefined()
  expect(response.evaluationResult).toBeDefined();
  const result = JSON.parse(response.evaluationResult as string)
  expect(result).toBeNull()
})