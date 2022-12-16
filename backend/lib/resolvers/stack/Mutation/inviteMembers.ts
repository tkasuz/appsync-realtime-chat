import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnDataSource, CfnFunctionConfiguration, CfnGraphQLApi, CfnResolver} from 'aws-cdk-lib/aws-appsync';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import path = require('path');
import { StackProps } from 'aws-cdk-lib';

interface InviteMembersResolverProps extends StackProps {
  graphqlApi: CfnGraphQLApi,
  datasource: CfnDataSource
} 

export class InviteMembersResolver extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InviteMembersResolverProps) {
    super(scope, id, props);

    const putFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Mutation.inviteMembers.put", {
      name: "put",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Mutation.inviteMembers.put", {
        path: path.join(__dirname, "../../functions/build/Mutation/inviteMembers", "put.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    const usersFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Mutation.inviteMembers.users", {
      name: "users",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Mutation.inviteMembers.users", {
        path: path.join(__dirname, "../../functions/build/Mutation/inviteMembers","users.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    const userFn = new CfnFunctionConfiguration(this, "PipelineResolverFunction-Mutation.inviteMembers.user", {
      name: "user",
      apiId: props.graphqlApi.attrApiId,
      codeS3Location: new Asset(this, "PipelineResolverFunctionAsset-Mutation.inviteMembers.user", {
        path: path.join(__dirname, "../../functions/build/Mutation/inviteMembers", "user.js")
      }).s3ObjectUrl,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      } ,
      dataSourceName: props.datasource.attrName
    })

    new CfnResolver(this, "PipelineResolver-Mutation.inviteMembers", {
      apiId: props.graphqlApi.attrApiId ,
      runtime: {
        name: "APPSYNC_JS",
        runtimeVersion: "1.0.0"
      },
      typeName: "Mutation",
      fieldName: "inviteMembers",
      kind: "PIPELINE",
      codeS3Location: new Asset(this, "PipelineResolverAsset-Mutation.inviteMembers", {
        path: path.join(__dirname, "../../functions/build", "resolver.js")
      }).s3ObjectUrl,
      pipelineConfig: {
        functions: [
          putFn.attrFunctionId,
          usersFn.attrFunctionId,
          userFn.attrFunctionId
        ]
      }
    })
  }
}
