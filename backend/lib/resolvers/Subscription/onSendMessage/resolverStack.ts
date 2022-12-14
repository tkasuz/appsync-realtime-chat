import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnDataSource, CfnFunctionConfiguration, CfnGraphQLApi, CfnResolver} from 'aws-cdk-lib/aws-appsync';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import path = require('path');
import { StackProps } from 'aws-cdk-lib';

interface OnSendMessageResolverProps extends StackProps {
  graphqlApi: CfnGraphQLApi,
  datasource: CfnDataSource
} 

export class OnSendMessageResolver extends cdk.Stack {
  constructor(scope: Construct, id: string, props: OnSendMessageResolverProps) {
    super(scope, id, props);

    const filterFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Subscription.onSendMessage.filter", {
      name: "filter",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Subscription.onSendMessage.filter", {
        path: path.join(__dirname, "filter.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    new CfnResolver(this, "PipelineResolver-Subscription.onSendMessage", {
      apiId: props.graphqlApi.attrApiId ,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      },
      typeName: "Subscription",
      fieldName: "onSendMessage",
      kind: "PIPELINE",
      codeS3Location: new Asset(this, "PipelineResolverAsset-Subscription.onSendMessage", {
        path: path.join(__dirname, "resolver.js")
      }).s3ObjectUrl,
      pipelineConfig: {
        functions: [
          filterFn.attrFunctionId
        ]
      }
    })
  }
}
