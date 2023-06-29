import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Stage } from "../constants";

import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { MysqlEngineVersion } from "aws-cdk-lib/aws-rds";
import { Peer } from "aws-cdk-lib/aws-ec2";
export interface RDSStackProps extends cdk.StackProps {
  stage: Stage;
}

export class RDSStack extends cdk.Stack {
  public url: string;
  constructor(scope: Construct, id: string, props: RDSStackProps) {
    super(scope, id, props);

    const { stage } = props;

    const vpc = ec2.Vpc.fromLookup(this, "DefaultVPC", {
      isDefault: true,
    });

    const sg1 = new ec2.SecurityGroup(this, `coding-helper-sg-${stage}`, {
      securityGroupName: `coding-helper-sg-${stage}`,
      vpc: vpc,
    });

    sg1.addIngressRule(Peer.anyIpv4(), ec2.Port.tcp(3306));

    /**
     * RDS will automatically creates the username/password for the RDS and you can found them on AWS SecretManager
     * Params(in secret can be found): password,engine,port,dbInstanceIdentifier,host,username
     */

    const dbInstance = new rds.DatabaseInstance(this, "MyDbInstance", {
      instanceIdentifier: `coding-helper-db-${stage}`,
      engine: rds.DatabaseInstanceEngine.mysql({
        version: MysqlEngineVersion.VER_8_0_31,
      }),
      vpc: vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      allocatedStorage: 20,
      securityGroups: [sg1],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC, // by default RDS is created in private and it is also recommended to keep it in private subnet to avoid public access and only application deployed in public subnet can have access to it.
      },
    });

    dbInstance.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY); // destroy database as well when the stack is get destroyed
  }
}
