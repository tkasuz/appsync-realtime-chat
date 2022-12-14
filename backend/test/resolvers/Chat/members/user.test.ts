import {AppSync} from 'aws-sdk'
import {readFile} from 'fs/promises';
const appsync = new AppSync({region: 'us-east-1'});
import path = require('path');
const file = '../../../../lib/resolvers/Chat/members/user.js';

test('validate Chat members user resolver', async () => {
  const context = JSON.stringify({
    prev: {
      result: {
        items: [
          {
            PK: 'CHAT#test',
            SK: 'MEMBER#user1'
          },
          {
            PK: 'CHAT#test',
            SK: 'MEMBER#user2'
          }
        ]
      }
    }
  })
  const code = await readFile(path.join(__dirname, file), {encoding: 'utf8'})
  const runtime = { name: 'APPSYNC_JS', runtimeVersion: '1.0.0' }
  const params = {context, code, runtime, function: 'request'}
  const response = await appsync.evaluateCode(params).promise();
  expect(response.error).toBeUndefined()
  expect(response.evaluationResult).toBeDefined();
  const result = JSON.parse(response.evaluationResult as string)
  expect(result.tables.chat.keys[0].SK.S).toEqual(`USER#user1`)
  expect(result.tables.chat.keys[0].PK.S).toEqual(`USER#user1`)
  expect(result.tables.chat.keys[1].SK.S).toEqual(`USER#user2`)
  expect(result.tables.chat.keys[1].PK.S).toEqual(`USER#user2`)
})