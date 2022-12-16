import {AppSync} from 'aws-sdk'
import {readFile} from 'fs/promises';
const appsync = new AppSync({region: 'us-east-1'});
import path = require('path');
const file = '../../../../lib/resolvers/functions/build/Message/from/user.js';

test('validate an create chat request', async () => {
  const context = JSON.stringify({
    source: {
      from: 'user1'
    }
  })
  const code = await readFile(path.join(__dirname, file), {encoding: 'utf8'})
  const runtime = { name: 'APPSYNC_JS', runtimeVersion: '1.0.0' }
  const params = {context, code, runtime, function: 'request'}
  const response = await appsync.evaluateCode(params).promise();
  expect(response.error).toBeUndefined()
  expect(response.evaluationResult).toBeDefined();
  const result = JSON.parse(response.evaluationResult as string)
  expect(result.key.SK.S).toEqual(`USER#user1`)
  expect(result.key.PK.S).toEqual(`USER#user1`)
})