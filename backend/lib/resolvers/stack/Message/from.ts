import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnDataSource, CfnFunctionConfiguration, CfnGraphQLApi, CfnResolver} from 'aws-cdk-lib/aws-appsync';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import path = require('path');
import { StackProps } from 'aws-cdk-lib';

interface MessageFromResolverProps extends StackProps {
  graphqlApi: CfnGraphQLApi,
  datasource: CfnDataSource
} 

export class MessageFromResolver extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MessageFromResolverProps) {
    super(scope, id, props);

    const userFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Message.from.user", {
      name: "Message_from_user",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Message.from.user", {
        path: path.join(__dirname, "../../functions/build/Message/from", "user.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    new CfnResolver(this, "PipelineResolver-Message.from", {
      apiId: props.graphqlApi.attrApiId ,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      },
      typeName: "Message",
      fieldName: "from",
      kind: "PIPELINE",
      codeS3Location: new Asset(this, "PipelineResolverAsset-Message.from", {
        path: path.join(__dirname, "../../functions/build", "resolver.js")
      }).s3ObjectUrl,
      pipelineConfig: {
        functions: [
          userFn.attrFunctionId,
        ]
      }
    })
  }
}
