import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnDataSource, CfnFunctionConfiguration, CfnGraphQLApi, CfnResolver} from 'aws-cdk-lib/aws-appsync';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import path = require('path');
import { StackProps } from 'aws-cdk-lib';

interface CreateChatResolverProps extends StackProps {
  graphqlApi: CfnGraphQLApi,
  datasource: CfnDataSource
} 

export class CreateChatResolver extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CreateChatResolverProps) {
    super(scope, id, props);

    const chatFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Mutation.createChat.chat", {
      name: "chat",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Mutation.createChat.chat", {
        path: path.join(__dirname, "chat.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    new CfnResolver(this, "PipelineResolver-Mutation.createChat", {
      apiId: props.graphqlApi.attrApiId ,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      },
      typeName: "Mutation",
      fieldName: "createChat",
      kind: "PIPELINE",
      codeS3Location: new Asset(this, "PipelineResolverAsset-Mutation.createChat", {
        path: path.join(__dirname, "resolver.js")
      }).s3ObjectUrl,
      pipelineConfig: {
        functions: [
          chatFn.attrFunctionId
        ]
      }
    })
  }
}
