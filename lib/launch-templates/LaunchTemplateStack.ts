import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
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

    const keypair = new ec2.CfnKeyPair(this, "LaunchTemplateKeyPair", {
      keyName: "LTKeyPair",
    });

    const launchTemplate = new ec2.LaunchTemplate(this, "LaunchTemplate", {
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      securityGroup: sg1,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.SMALL
      ),
      keyName: keypair.keyName,
    });
  }
}
