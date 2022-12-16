import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnDataSource, CfnGraphQLApi, CfnGraphQLSchema} from 'aws-cdk-lib/aws-appsync';
import {AttributeType, BillingMode, Table} from 'aws-cdk-lib/aws-dynamodb';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import path = require('path');
import { CreateChatResolver } from './resolvers/stack/Mutation/createChat';
import { ChatMembersResolver } from './resolvers/stack/Chat/members';
import { MessageFromResolver } from './resolvers/stack/Message/from';
import { SendMessageResolver } from './resolvers/stack/Mutation/sendMessage';
import { GetChatResolver } from './resolvers/stack/Query/getChat';
import { OnSendMessageResolver } from './resolvers/stack/Subscription/onSendMessage';
import { InviteMembersResolver } from './resolvers/stack/Mutation/inviteMembers';
import { UpdateUserResolver } from './resolvers/stack/Mutation/updateUser';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const chatTable = new Table(this, 'chatDdbTable', {
      tableName: 'chat',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING }
    })

    const graphqlApi = new CfnGraphQLApi(this, "graphQLAPi", {
      name: "ChatQL",
      authenticationType: "OPENID_CONNECT",
      xrayEnabled: true,
      openIdConnectConfig: {
        issuer: this.node.tryGetContext('issuer')
      },
    });

    const dataSourceIamRole = new Role(this, 'graphqlDataSourceRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com')
    })
    dataSourceIamRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'))

    const chatDataSource = new CfnDataSource(this, 'graphqlDataSource', {
      apiId: graphqlApi.attrApiId,
      name: 'chat',
      type: "AMAZON_DYNAMODB",
      serviceRoleArn: dataSourceIamRole.roleArn,
      dynamoDbConfig: {
        awsRegion: cdk.Stack.of(this).region,
        tableName: chatTable.tableName,
      }
    })

    new CfnGraphQLSchema(this, "graphqlSchema", {
      apiId: graphqlApi.attrApiId,
      definitionS3Location: new Asset(this, 'graphQLSchemaAsset', {
        path: path.join(__dirname, "../../frontend/schema.graphql")
      }).s3ObjectUrl
    })

    new CreateChatResolver(this, 'graphqlResolver-Mutation.createChat', {
      graphqlApi: graphqlApi,
      datasource: chatDataSource
    })
    new SendMessageResolver(this, 'graphqlResolver-Mutation.sendMessage', {
      graphqlApi: graphqlApi,
      datasource: chatDataSource
    })
    new InviteMembersResolver(this, 'graphqlResolver-Mutation.inviteMembers', {
      graphqlApi: graphqlApi,
      datasource: chatDataSource
    })
    new UpdateUserResolver(this, 'graphqlResolver-Mutation.updateUser', {
      graphqlApi: graphqlApi,
      datasource: chatDataSource
    })
    new ChatMembersResolver(this, 'graphqlResolver-Chat.members', {
      graphqlApi: graphqlApi,
      datasource: chatDataSource
    })
    new MessageFromResolver(this, 'graphqlResolver-Message.from', {
      graphqlApi: graphqlApi,
      datasource: chatDataSource
    })
    new GetChatResolver(this, 'graphqlResolver-Query.getChat', {
      graphqlApi: graphqlApi,
      datasource: chatDataSource
    })
    new OnSendMessageResolver(this, 'graphqlResolver-Subscription.onSendMessage', {
      graphqlApi: graphqlApi,
      datasource: chatDataSource
    })
  }
}
