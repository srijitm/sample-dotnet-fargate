# Sample Flask API

## Description

This project will build a basic Python Flask API docker image and run it on ECS Fargate behind a private ALB. An API Gateway (HTTP) will be provisioned along with a VPC Link to allow connectivity to the ALB. The purpose of this demo is to provide the building blocks to add a custom authorizer to API Gateway.

** Note: This is not Production grade and simply meant as a demo **

## AWS Services

* ECS Fargate
* Application Load Balancer
* API Gateway

## Pre-Requisites

* Docker
* AWS CLI configured with appropriate permissions.

## Instructions

```bash
cd app/cdk
npm install
npm run build
cdk bootstrap # Only needs to be executed once
cdk deploy # To deploy and pay $$ to AWS
cdk destroy # To delete the stack and stop paying $$ to AWS
```
