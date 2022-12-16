import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnDataSource, CfnFunctionConfiguration, CfnGraphQLApi, CfnResolver} from 'aws-cdk-lib/aws-appsync';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import path = require('path');
import { StackProps } from 'aws-cdk-lib';

interface UpdateUserResolverProps extends StackProps {
  graphqlApi: CfnGraphQLApi,
  datasource: CfnDataSource
} 

export class UpdateUserResolver extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UpdateUserResolverProps) {
    super(scope, id, props);

    const getFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Mutation.updateUser.get", {
      name: "get",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Mutation.updateUser.chat", {
        path: path.join(__dirname, "../../functions/build/Mutation/updateUser", "get.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    const upsertFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Mutation.updateUser.upsert", {
      name: "upsert",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Mutation.updateUser.upsert", {
        path: path.join(__dirname, "../../functions/build/Mutation/updateUser", "upsert.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    new CfnResolver(this, "PipelineResolver-Mutation.updateUser", {
      apiId: props.graphqlApi.attrApiId ,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      },
      typeName: "Mutation",
      fieldName: "updateUser",
      kind: "PIPELINE",
      codeS3Location: new Asset(this, "PipelineResolverAsset-Mutation.updateUser", {
        path: path.join(__dirname, "../../functions/build", "resolver.js")
      }).s3ObjectUrl,
      pipelineConfig: {
        functions: [
          getFn.attrFunctionId,
          upsertFn.attrFunctionId
        ]
      }
    })
  }
}
