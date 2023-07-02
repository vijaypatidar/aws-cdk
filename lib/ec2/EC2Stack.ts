import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { Stage } from "../constants";
import { Peer } from "aws-cdk-lib/aws-ec2";

interface EC2StackProps extends cdk.StackProps {
  stage: Stage;
}

export class EC2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EC2StackProps) {
    super(scope, id, props);
    const { stage } = props;

    const vpc = ec2.Vpc.fromLookup(this, "DefaultVPC", {
      isDefault: true,
    });

    const sg1 = new ec2.SecurityGroup(this, `coding-helper-sg-${stage}`, {
      vpc: vpc,
    });

    sg1.addIngressRule(Peer.anyIpv4(), ec2.Port.tcp(22));

    const role = new iam.Role(this, `ec2-coding-helper-role-${stage}`, {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    const keypair = new ec2.CfnKeyPair(
      this,
      `coging-helper-instance-key-pair-${stage}`,
      {
        keyName: "LTKeyPair-" + stage,
      }
    );

    const instanceType = ec2.InstanceType.of(
      ec2.InstanceClass.T2,
      ec2.InstanceSize.MICRO
    );

    const userData = ec2.UserData.forLinux();

    userData.addCommands("sudo yum install nodejs");

    const ec2Instance = new ec2.Instance(
      this,
      `coging-helper-server-${stage}`,
      {
        machineImage: ec2.MachineImage.latestAmazonLinux(),
        securityGroup: sg1,
        instanceType: instanceType,
        keyName: keypair.keyName,
        role: role,
        userData: userData,
        vpc: vpc,
      }
    );
  }
}
