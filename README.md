# AWS-E-commerce-Platform-
Secure AWS E-commerce Platform with Hybrid Identity &amp; PCI-Compliant Payments

## Description
This project simulates the architecture and key components of a secure, scalable e-commerce platform built on AWS. It focuses on three critical areas highlighted in enterprise cloud roles: secure hybrid identity federation, PCI-DSS compliant payment processing, and defense-in-depth cloud security. The implementation demonstrates how to integrate AWS-native services with external identity providers (Okta/Azure AD) and payment gateways (Stripe/Clover-like) while maintaining compliance and operational best practices.

## Core Objectives:

- Design a zero-trust network architecture using VPC, private subnets, and security groups.
- Implement identity federation via SAML 2.0, allowing users to authenticate through Okta/Azure AD and access AWS resources without IAM users.
- Build a PCI-DSS aligned payment workflow using tokenization (via Stripe.js) and serverless processing (Lambda) to reduce compliance scope.
- Apply enterprise security controls: encryption everywhere (KMS), secrets management, monitored API gateways, and comprehensive logging.
- Demonstrate Infrastructure as Code with Terraform for reproducible, auditable deployments.

## Tech Stack
- VPC
- EC2, API Gateway & Lambda
- RDS, DynamoDB & s3
- CloudFront
- AWS IAM, KMS, SecretsManager & WAF

## Architectural Diagram
