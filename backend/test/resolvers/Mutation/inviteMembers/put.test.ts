import {AppSync} from 'aws-sdk'
import {readFile} from 'fs/promises';
import {InviteMembersMutationVariables} from '../../../../../frontend/src/API';
const appsync = new AppSync({region: 'us-east-1'});
import path = require('path');
const file = '../../../../lib/resolvers/Mutation/inviteMembers/put.js';

test('validate an invite member request', async () => {
  const context = JSON.stringify({
    arguments: {
      input: {
        chatId: 'test',
        members: ['user1', 'user2']
      }
    } as InviteMembersMutationVariables,
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
})