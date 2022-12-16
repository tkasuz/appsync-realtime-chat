import {AppSync} from 'aws-sdk'
import {readFile} from 'fs/promises';
import {SendMessageMutationVariables} from '../../../../../frontend/src/API';
const appsync = new AppSync({region: 'us-east-1'});
import path = require('path');
const file = '../../../../lib/resolvers/functions/build/Mutation/sendMessage/chat.js';

test('validate an invite member request', async () => {
  const context = JSON.stringify({
    arguments: {
      input: {
        body: 'test',
        toChatId: 'chatId'
      }
    } as SendMessageMutationVariables,
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
  expect(result.attributeValues).toHaveProperty('body')
  expect(result.attributeValues).toHaveProperty('from')
  expect(result.attributeValues).toHaveProperty('id')
  expect(result.attributeValues).toHaveProperty('createdAt')
})