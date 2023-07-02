#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Stages } from "../lib/constants";
import { EC2Stack } from "../lib/ec2/EC2Stack";
const env: cdk.Environment = {
  region: "ap-south-1",
  account: "323439077171",
};

const app = new cdk.App();

Stages.forEach((stage) => {
  // const rdsStack = new RDSStack(app, "RDSStack-" + stage, {
  //   env: env,
  //   stage: stage,
  // });

  // const lt = new LaunchTemplateStack(app, "LaunchTemplateStack-" + stage, {
  //   env: env,
  //   stage: stage,
  // });

  const ec2Stack = new EC2Stack(app, `ec2-stack-${stage}`, {
    stage: stage,
    env: env,
  });
});
