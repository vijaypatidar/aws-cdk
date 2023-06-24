import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Stage } from "../constants";

export interface RDSStackProps extends cdk.StackProps {
  stage: Stage;
}

export class RDSStack extends cdk.Stack {
  public url: string;
  constructor(scope: Construct, id: string, props: RDSStackProps) {
    super(scope, id, props);

    // rds

    this.url = "dummy";
  }
}
