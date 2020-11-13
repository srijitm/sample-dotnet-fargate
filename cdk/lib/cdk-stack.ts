import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = this.node.tryGetContext('use_default_vpc') === '1' ?
      ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true }) :
      this.node.tryGetContext('use_vpc_id') ?
        ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: this.node.tryGetContext('use_vpc_id') }) :
        new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });

    const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'service', {
      vpc,
      memoryLimitMiB: 2048,
      cpu: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('mcr.microsoft.com/dotnet/samples:aspnetapp'),
        containerName: 'flask-api',
        containerPort: 80,
      },
      assignPublicIp: false,
      desiredCount: 2,
      publicLoadBalancer: true
    });
    
    loadBalancedFargateService.targetGroup.configureHealthCheck({
      path: "/",
      port: "80"
    });

    const taskPolicy = new iam.PolicyStatement()
    taskPolicy.addAllResources()
    taskPolicy.addActions(
      "s3:Get*",
      "s3:List*",
      "s3:Describe*",
      "s3:PutObject"
    )
    loadBalancedFargateService.taskDefinition.taskRole.addToPrincipalPolicy(taskPolicy)
  }
}
