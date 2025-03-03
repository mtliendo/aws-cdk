import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as ecs from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-pseudo-terminal');

// Create a cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
  networkMode: ecs.NetworkMode.AWS_VPC,
});

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
  pseudoTerminal: true,
});

new ecs.Ec2Service(stack, 'Service', {
  cluster,
  taskDefinition,
});
new integ.IntegTest(app, 'PseudoTerminal', {
  testCases: [stack],
});

app.synth();
