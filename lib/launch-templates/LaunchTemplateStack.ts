import * as cdk from "aws-cdk-lib";
import {
  AutoScalingGroup,
  Signals,
  UpdatePolicy,
} from "aws-cdk-lib/aws-autoscaling";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Ec2Service } from "aws-cdk-lib/aws-ecs";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class LaunchTemplateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "DefaultVPC", {
      isDefault: true,
    });

    const sg1 = new ec2.SecurityGroup(this, "sg1", {
      vpc: vpc,
    });

    const role = new iam.Role(this, "ec2-coding-helper-role", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    const keypair = new ec2.CfnKeyPair(this, "cogingHelperTemplateKeyPair", {
      keyName: "LTKeyPair",
    });

    const cogingHelperTemplate = new ec2.LaunchTemplate(
      this,
      "cogingHelperTemplate",
      {
        machineImage: ec2.MachineImage.latestAmazonLinux(),
        securityGroup: sg1,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T2,
          ec2.InstanceSize.SMALL
        ),
        keyName: keypair.keyName,
        role: role,
      }
    );

    const myAsg = new AutoScalingGroup(this, "cogingHelperAsg", {
      vpc: vpc,
      launchTemplate: cogingHelperTemplate,
      maxCapacity: 10,
      minCapacity: 1,
      desiredCapacity: 1,
      autoScalingGroupName: "CodingHelperScalingGroup",
    });
  }
}
