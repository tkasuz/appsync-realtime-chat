import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnDataSource, CfnFunctionConfiguration, CfnGraphQLApi, CfnResolver} from 'aws-cdk-lib/aws-appsync';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import path = require('path');
import { StackProps } from 'aws-cdk-lib';

interface SendMessageResolverProps extends StackProps {
  graphqlApi: CfnGraphQLApi,
  datasource: CfnDataSource
} 

export class SendMessageResolver extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SendMessageResolverProps) {
    super(scope, id, props);

    const chatFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Mutation.sendMessage.chat", {
      name: "Mutation_sendMessage_chat",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Mutation.sendMessage.chat", {
        path: path.join(__dirname, "../../functions/build/Mutation/sendMessage", "chat.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    new CfnResolver(this, "PipelineResolver-Mutation.sendMessage", {
      apiId: props.graphqlApi.attrApiId ,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      },
      typeName: "Mutation",
      fieldName: "sendMessage",
      kind: "PIPELINE",
      codeS3Location: new Asset(this, "PipelineResolverAsset-Mutation.sendMessage", {
        path: path.join(__dirname, "../../functions/build", "resolver.js")
      }).s3ObjectUrl,
      pipelineConfig: {
        functions: [
          chatFn.attrFunctionId
        ]
      } 
    })
  }
}
