import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnDataSource, CfnFunctionConfiguration, CfnGraphQLApi, CfnResolver} from 'aws-cdk-lib/aws-appsync';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import path = require('path');
import { StackProps } from 'aws-cdk-lib';

interface ChatMembersResolverProps extends StackProps {
  graphqlApi: CfnGraphQLApi,
  datasource: CfnDataSource
} 

export class ChatMembersResolver extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ChatMembersResolverProps) {
    super(scope, id, props);

    const membersFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Chat.members.members", {
      name: "members",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Chat.members.members", {
        path: path.join(__dirname, "../../functions/build/Chat/members", "members.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    const userFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Chat.members.user", {
      name: "user",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Chat.members.user", {
        path: path.join(__dirname, "../../functions/build/Chat/members", "user.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    new CfnResolver(this, "PipelineResolver-Chat.members", {
      apiId: props.graphqlApi.attrApiId ,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      },
      typeName: "Chat",
      fieldName: "members",
      kind: "PIPELINE",
      codeS3Location: new Asset(this, "PipelineResolverAsset-Chat.members", {
        path: path.join(__dirname, "../../functions/build", "resolver.js")
      }).s3ObjectUrl,
      pipelineConfig: {
        functions: [
          membersFn.attrFunctionId,
          userFn.attrFunctionId
        ]
      }
    })
  }
}
