import * as cdk from "aws-cdk-lib";
import { AutoScalingGroup } from "aws-cdk-lib/aws-autoscaling";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { RDSStack } from "../databases/RDSStack";
import { Stage } from "../constants";

interface LaunchTemplateStackProps extends cdk.StackProps {
  stage: Stage;
  rdsStack: RDSStack;
}

export class LaunchTemplateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LaunchTemplateStackProps) {
    super(scope, id, props);
    const { stage } = props;

    const vpc = ec2.Vpc.fromLookup(this, "DefaultVPC", {
      isDefault: true,
    });

    const sg1 = new ec2.SecurityGroup(this, `coding-helper-sg-${stage}`, {
      vpc: vpc,
    });

    const role = new iam.Role(this, `ec2-coding-helper-role-${stage}`, {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    const keypair = new ec2.CfnKeyPair(
      this,
      `cogingHelperTemplateKeyPair-${stage}`,
      {
        keyName: "LTKeyPair-" + stage,
      }
    );

    const cogingHelperTemplate = new ec2.LaunchTemplate(
      this,
      `cogingHelperTemplate-${stage}`,
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

    const myAsg = new AutoScalingGroup(this, `cogingHelperAsg-${stage}`, {
      vpc: vpc,
      launchTemplate: cogingHelperTemplate,
      maxCapacity: 10,
      minCapacity: 1,
      desiredCapacity: 1,
      autoScalingGroupName: "CodingHelperScalingGroup" + stage,
    });
  }
}
