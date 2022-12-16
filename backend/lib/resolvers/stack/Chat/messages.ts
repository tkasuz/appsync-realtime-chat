import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnDataSource, CfnFunctionConfiguration, CfnGraphQLApi, CfnResolver} from 'aws-cdk-lib/aws-appsync';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import path = require('path');
import { StackProps } from 'aws-cdk-lib';

interface ChatMessageResolverProps extends StackProps {
  graphqlApi: CfnGraphQLApi,
  datasource: CfnDataSource
} 

export class ChatMessageResolver extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ChatMessageResolverProps) {
    super(scope, id, props);

    const msgsFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Chat.messages.messages", {
      name: "messages",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Chat.messages.messages", {
        path: path.join(__dirname, "../../functions/build/Chat/messages", "messages.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    new CfnResolver(this, "PipelineResolver-Chat.messages", {
      apiId: props.graphqlApi.attrApiId ,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      },
      typeName: "Chat",
      fieldName: "messages",
      kind: "PIPELINE",
      codeS3Location: new Asset(this, "PipelineResolverAsset-Chat.messages", {
        path: path.join(__dirname, "../../functions/build", "resolver.js")
      }).s3ObjectUrl,
      pipelineConfig: {
        functions: [
          msgsFn.attrFunctionId,
        ]
      } 
    })
  }
}
