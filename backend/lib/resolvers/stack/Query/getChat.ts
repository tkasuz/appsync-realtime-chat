import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnDataSource, CfnFunctionConfiguration, CfnGraphQLApi, CfnResolver} from 'aws-cdk-lib/aws-appsync';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import path = require('path');
import { StackProps } from 'aws-cdk-lib';

interface GetChatResolverProps extends StackProps {
  graphqlApi: CfnGraphQLApi,
  datasource: CfnDataSource
} 

export class GetChatResolver extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GetChatResolverProps) {
    super(scope, id, props);

    const chatFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Query.getChat.chat", {
      name: "chat",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Query.getChat.chat", {
        path: path.join(__dirname, "../../functions/build/Query/getChat", "chat.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    new CfnResolver(this, "PipelineResolver-Query.getChat", {
      apiId: props.graphqlApi.attrApiId ,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      },
      typeName: "Query",
      fieldName: "getChat",
      kind: "PIPELINE",
      codeS3Location: new Asset(this, "PipelineResolverAsset-Query.getChat", {
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
