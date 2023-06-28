#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LaunchTemplateStack } from "../lib/launch-templates/LaunchTemplateStack";
import { RDSStack } from "../lib/databases/RDSStack";
import { Stage, Stages } from "../lib/constants";
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

  const lt = new LaunchTemplateStack(app, "LaunchTemplateStack-" + stage, {
    env: env,
    stage: stage,
  });
});
