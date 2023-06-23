#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LaunchTemplateStack } from "../lib/launch-templates/LaunchTemplateStack";

const env: cdk.Environment = {
  region: "ap-south-1",
  account: "323439077171",
};

const app = new cdk.App();

new LaunchTemplateStack(app, "LaunchTemplateStack", {
  env: env,
});
