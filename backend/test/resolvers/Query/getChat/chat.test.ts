import {AppSync} from 'aws-sdk'
import {readFile} from 'fs/promises';
import {GetChatQueryVariables} from '../../../../../frontend/src/API';
const appsync = new AppSync({region: 'us-east-1'});
import path = require('path');
const file = '../../../../lib/resolvers/functions/build/Query/getChat/chat.js';

test('validate an update user request', async () => {
  const context = JSON.stringify({
    arguments: {
      chatId: 'chatId'
    } as GetChatQueryVariables,
    identity: {
      sub: 'user1',
      claims: {
      },
      issuer: 'https://xxxxxxxxxx.auth0.com'
    }
  })
  const code = await readFile(path.join(__dirname, file), {encoding: 'utf8'})
  const runtime = { name: 'APPSYNC_JS', runtimeVersion: '1.0.0' }
  const params = {context, code, runtime, function: 'request'}
  const response = await appsync.evaluateCode(params).promise();
  expect(response.error).toBeUndefined()
  expect(response.evaluationResult).toBeDefined();
  const result = JSON.parse(response.evaluationResult as string)
  expect(result.key.PK.S).toEqual('CHAT#chatId')
  expect(result.key.SK.S).toEqual('CHAT#chatId')
})