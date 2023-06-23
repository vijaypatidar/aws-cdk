#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LaunchTemplateStack } from "../lib/launch-templates/LaunchTemplateStack";

const app = new cdk.App();
// new AwsCdkStack(app, 'AwsCdkStack', {
// });

new LaunchTemplateStack(app, "LaunchTemplateStack", {});
