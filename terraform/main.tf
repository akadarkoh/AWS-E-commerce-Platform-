# I. Foundational Architectural Building Blocks
# These are the AWS services you must be able to configure and interconnect.

# Networking & Isolation (The Foundation):
# VPC Design: Public and private subnets across multiple Availability Zones.
# Security Groups & NACLs: Layer 3 & 4 filtering.
# Internet Gateway / NAT Gateway: For controlled internet access.

# Get Available AZs
data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  common_tags = {
    Project = "ECommerce-Platform"
    Environment = var.environment
    ManagedBy = "Terraform"
    Owner = "Platform-Team"
  }
}

# 1. VPC
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = merge(local.common_tags, {
    Name = "${var.environment}-vpc"
  })
}

# 2. IGW - Internet Gateway
resource "aws_internet_gateway" "main"{
  vpc_id = aws_vpc.main.id

  tags = merge(local.common_tags, {
    Name = "${var.environment}-igw"
  })
}

#  Subnets 
# AZ 1:
resource "aws_subnet" "public_az1" {
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name = "${var.environment}-public-az1"
    AZ = data.aws_availability_zones.available.names[0]
    Type = "Public"
  })
}

resource "aws_subnet" "private_subnet_1A" {
  # App Tier
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.10.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false

  tags = merge(local.common_tags, {
    Name = "${var.environment}-app-az1"
    AZ = data.aws_availability_zones.available.names[0]
    Type = "App"
  })
}

# Data Tier
resource "aws_subnet" "private_subnet_1B" {
  # Database Tier
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.11.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false

  tags = merge(local.common_tags, {
    Name = "${var.environment}-database-az1"
    AZ = data.aws_availability_zones.available.names[0]
    Type = "Database"
  })
}

#  AZ 2:
resource "aws_subnet" "public_az2" {
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.2.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name = "${var.environment}-public-az2"
    AZ = data.aws_availability_zones.available.names[1]
    Type = "Public"
  })
}

resource "aws_subnet" "private_subnet_2A" {
  # App Tier
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.20.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = false

  tags = merge(local.common_tags, {
    Name = "${var.environment}-app-az2"
    AZ = data.aws_availability_zones.available.names[1]
    Type = "App"
  })
}

resource "aws_subnet" "private_subnet_2B" {
  # Database Tier
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.21.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = false

  tags = merge(local.common_tags, {
    Name = "${var.environment}-database-az2"
    AZ = data.aws_availability_zones.available.names[1]
    Type = "Database"
  })
}

#  AZ 3:
resource "aws_subnet" "private_az3" {
  # App tier - web server 3
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.30.0/24"
  availability_zone = data.aws_availability_zones.available.names[2]
  map_public_ip_on_launch = false

  tags = merge(local.common_tags, {
    Name = "${var.environment}-app-az3"
    AZ = data.aws_availability_zones.available.names[2]
    Type = "Private"
  })

}


# 4. Elastic IPs for NAT Gateways
resource "aws_eip" "nat_eip_az1"{
  domain = "vpc"

  tags = merge(local.common_tags, {
    Name = "${var.environment}-nat-eip-az1"
  })
}

resource "aws_eip" "nat_eip_az2"{
  domain = "vpc"

  tags = merge(local.common_tags, {
    Name = "${var.environment}-nat-eip-az2"
  })
}


# 5. NAT Gateways (one in each public subnet)
resource "aws_nat_gateway" "nat_az1"{
  allocation_id = aws_eip.nat_eip_az1.id
  subnet_id = aws_subnet.public_az1.id

  tags = merge(local.common_tags, {
    Name = "${var.environment}-nat-az1"
  })
}

resource "aws_nat_gateway" "nat_az2"{
  allocation_id = aws_eip.nat_eip_az2.id
  subnet_id = aws_subnet.public_az2.id

  tags = merge(local.common_tags, {
    Name = "${var.environment}-nat-az2"
  })
}


# 6. Route Tables
# Public Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(local.common_tags, {
    Name = "${var.environment}-public-rt"
  })
}

# Private Route Tables
# Private Route Tables for AZ1
resource "aws_route_table" "private_rt_az1" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat_az1.id
  }

  tags = merge(local.common_tags, {
    Name = "${var.environment}-private-rt-az1"
    AZ = data.aws_availability_zones.available.names[0]
  })
}

# Private Route Tables for AZ2
resource "aws_route_table" "private_rt_az2" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat_az2.id
  }

  tags = merge(local.common_tags, {
    Name = "${var.environment}-private-rt-az2"
    AZ = data.aws_availability_zones.available.names[1]
  })
}

# Private Route Tables for AZ3 ?
resource "aws_route_table" "private_rt_az3" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat_az2.id
  }

  tags = merge(local.common_tags, {
    Name = "${var.environment}-private-rt-az3"
    AZ = data.aws_availability_zones.available.names[2]
    Type = "WarmStandby"
  })
}


# 8. Route Table Associations
# Public Subnets -> Public Route Table
resource "aws_route_table_association" "public_rta_az1" {
  subnet_id = aws_subnet.public_az1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_rta_az2" {
  subnet_id = aws_subnet.public_az2.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "private_rta_az1_app" {
  subnet_id = aws_subnet.private_subnet_1A.id
  route_table_id = aws_route_table.private_rt_az1.id
}

resource "aws_route_table_association" "private_rta_az1_db" {
  subnet_id = aws_subnet.private_subnet_1B.id
  route_table_id = aws_route_table.private_rt_az1.id
}

resource "aws_route_table_association" "private_rta_az2_app" {
  subnet_id = aws_subnet.private_subnet_2A.id
  route_table_id = aws_route_table.private_rt_az2.id
}

resource "aws_route_table_association" "private_rta_az2_db" {
  subnet_id = aws_subnet.private_subnet_2B.id
  route_table_id = aws_route_table.private_rt_az2.id
}

resource "aws_route_table_association" "private_rta_az3_app" {
  subnet_id = aws_subnet.private_az3.id
  route_table_id = aws_route_table.private_rt_az3.id
}

# Security Group
resource "aws_security_group" "alb" {
  name = "${var.environment}-alb-sg"
  description = "SG for App Load Balancer"
  vpc_id = aws_vpc.main.id

  # Allow HTTP/HTTPS from anywhere
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Compute & Application Layer:
# EC2 (for legacy/web servers): In a private subnet, accessed via a Load Balancer.
# Lambda (for modern, serverless APIs): Key for payment processing functions. Must understand VPC integration for Lambdas to access private resources (like RDS).
# API Gateway: The public-facing endpoint for your APIs (like the payment API). Integrates with Lambda and handles authentication.
resource "aws_lb" "web" {
  name = "${var.environment}-web-alb"
  internal = false # public facing
  load_balancer_type = "application"
  # ALB needs public subnets
  subnets = [
    aws_subnet.public_az1.id,
    aws_subnet.public_az2.id
  ]
  security_groups = [aws_security_group.alb.id]
}


resource "aws_lb_target_group" "web"{
  name = "${var.environment}-web-tg"
  port = 80
  protocol = "HTTP"
  vpc_id = aws_vpc.main.id

  health_check {
    path = "/"
    interval = 30
    healthy_threshold = 2
    unhealthy_threshold = 5
    timeout = 5
  }
}

resource "aws_lb_listener" "http"{
  load_balancer_arn = aws_lb.web.arn
  port = 80
  protocol = "HTTP"

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

# ASG 
resource "aws_autoscaling_group" "web_servers" {
  name = "${var.environment}-web-asg"
  # Launch EC2s in these private app subnets
  vpc_zone_identifier = [
    aws_subnet.private_subnet_1A.id,
    aws_subnet.private_subnet_2A.id,
    aws_subnet.private_az3.id
  ]
  
  mixed_instances_policy {
    launch_template {
      launch_template_specification {
        launch_template_id = aws_launch_template.web.id
        version = "$Latest"
      }

      # AZ1/AZ2 get normal instances, AZ3 gets cheaper/spot for standby
      override{
        instance_type = "t3.small"
      }
      # Standby
      override {
        instance_type = "t3.micro" # smaller for standby
        weighted_capacity = "0.5" # half capacity when active
      }
    }
    instances_distribution {
      on_demand_percentage_above_base_capacity = 0 
      spot_allocation_strategy = "capacity-optimized"
    }
  }

  # Start with 2 instances in AZ1/AZ2, 0 in AZ3
  desired_capacity = 2
  min_size = 2
  max_size = 4 # Can scale to 3 if need be

  # Health Checks will failover automatically to AZ3
  health_check_type = "ELB"
  health_check_grace_period = 300

  tag {
    key = "WarmStandby"
    value = "true"
    propagate_at_launch = true
  }

}

# Lambda
resource "aws_lambda_function" "payment_processor" {
  filename = "lambda_payment.zip"
  function_name = "${var.environment}-payment-processor"
  role = aws_iam_role.lambda_exec.arn
  handler = "index.handler"
  runtime = "nodejs18.x"

  vpc_config {
    subnet_ids = [
      aws_subnet.private_subnet_1A.id, #app
      aws_subnet.private_subnet_2A.id #app
    ]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST = aws_db_instance.postgres.address
    }
  }
}

resource "aws_iam_role" "lambda_exec"{
  name = "${var.environment}-lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# policy attachment
resource "aws_iam_role_policy_attachment" "lambda_exec_role_attachment"{
    role = aws_iam_role.lambda_exec.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# HTTP API 
resource "aws_apigatewayv2_api" "payment_api"{
  name = "${var.environment}-payment-api"
  protocol_type = "HTTP"
  description = "E-commerce Payment API with PCI-DSS"

  cors_configuration {
    allow_origins = ["https://${aws_cloudfront_distribution.cdn.domain_name}"] # Cloudfront domain
    allow_methods = ["POST", "GET", "OPTIONS"]
    allow_headers = ["content-type", "authorization", "x-api-key"]
    max_age = 300
  }

  tags = merge(local.common_tags, {
    Name = "${var.environment}-payment-http-api"
  })
}

# API Lambda Integration
resource "aws_apigatewayv2_integration" "lambda_payment" {
  api_id = aws_apigatewayv2_api.payment_api.id
  integration_type = "AWS_PROXY"
  integration_method = "POST"
  integration_uri = aws_lambda_function.payment_processor.invoke_arn
  payload_format_version = "2.0"
}

# Route
resource "aws_apigatewayv2_route" "post_payment"{
  api_id = aws_apigatewayv2_api.payment_api.id
  route_key = "POST /payment"
  target = "integrations/${aws_apigatewayv2_integration.lambda_payment.id}"
}

# Stage
resource "aws_apigatewayv2_stage" "prod"{
  api_id = aws_apigatewayv2_api.payment_api.id
  name = "prod"
  auto_deploy = true
  # Access logging to Cloudwatch
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId = "$context.requestId"
      ip = "$context.identity.sourceIp"
      requestTime = "$context.requestTime"
      httpMethod = "$context.httpMethod"
      routeKey = "$context.routeKey"
      status = "$context.status"
      responseLength = "$context.responseLength"
      integrationError = "$context.integration.error"
    })
  }
}

# api gateway lambda permission
resource "aws_lambda_permission" "payment_api_lambda_permissions"{
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.payment_processor.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.payment_api.arn}/*/*/payment"
}

# Lambda SG
resource "aws_security_group" "lambda"{
  name = "${var.environment}-lambda-sg"
  description = "Security Group for Lambda functions"
  vpc_id = aws_vpc.main.id

  # Allow outbound traffic to RDS
  egress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  egress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "database"{
  name = "${var.environment}-database-sg"
  description = "Security Group for RDS database"
  vpc_id = aws_vpc.main.id

  # Only allow from Lambda and app servers
  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    security_groups = [aws_security_group.lambda.id]
  }

  egress {
    from_port  = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 SG
resource "aws_security_group" "web"{
  name = "${var.environment}-web-sg"
  description = "Security Group for web servers"
  vpc_id = aws_vpc.main.id

  # Allow from ALB only
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_launch_template" "web"{
  name_prefix = "${var.environment}-web"
  image_id = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  vpc_security_group_ids = [aws_security_group.web.id]

  tag_specifications {
    resource_type = "instance"
    tags = merge(local.common_tags, {
      Name = "${var.environment}-web-server"
    })
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "api_gateway"{
  name = "/aws/apigateway/${var.environment}-payment-api"
  retention_in_days = 7
  
  tags = merge(local.common_tags, {
    Name = "${var.environment}-api-gateway-logs"
  })
}
# Data Layer:
# RDS (PostgreSQL/MySQL): In a private subnet for customer data, product catalog, etc. Crucial: No public IP.
resource "aws_db_subnet_group" "database"{
  name = "${var.environment}-db-subnet-group"
  subnet_ids = [
    aws_subnet.private_subnet_1B.id, # DB subnet AZ1
    aws_subnet.private_subnet_2B.id # DB subnet AZ1
  ]
}

resource "aws_db_instance" "postgres" {
  identifier = "${var.environment}-ecommerce-db"
  engine = "postgresql"
  instance_class = "db.t3.micro"
  # RDS places PRIMARY in AZ1 and STANDBY in AZ2 automatically
  db_subnet_group_name = aws_db_subnet_group.database.name
  # Additional Security: In DB subnet (isolated)
  vpc_security_group_ids = [aws_security_group.database.id]
  # No public access
  publicly_accessible = false
}
# DynamoDB (Optional but good): For session data or high-speed transaction lookups.
# S3: For static website assets (images, JS, CSS) and logs.


# 9. VPC Flow Logs
# S3 bucket for flow logs
resource "random_id" "bucket_suffix" {
  byte_length = 8
}

resource "aws_s3_bucket" "flow_logs" {
  bucket = "${var.environment}-vpc-flow-logs-${random_id.bucket_suffix.hex}"

  tags = merge(local.common_tags, {
    Name = "${var.environment}-vpc-flow-logs"
  })
}

# Enable VPC Flow Logs
resource "aws_flow_log" "vpc_flow_log" {
  vpc_id = aws_vpc.main.id
  traffic_type = "ALL"
  log_destination = aws_s3_bucket.flow_logs.arn
  log_destination_type = "s3"

  tags = merge(local.common_tags, {
    Name = "${var.environment}-vpc-flow-logs"
  })
}
# Performance & Delivery:
# CloudFront: CDN in front of S3 (for static site) and API Gateway (for caching API responses).

resource "aws_s3_bucket" "static_website"{
  bucket = "${var.environment}-static-website-${random_id.bucket_suffix.hex}"

  tags = {
    Name = "Static Website"
    Project = "ECommerce-Demo"
  }
}

resource "aws_s3_bucket_public_access_block" "block_public"{
  bucket = aws_s3_bucket.static_website.id

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "website"{
  bucket = aws_s3_bucket.static_website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_object" "index"{
  bucket = aws_s3_bucket.static_website.id
  key = "index.html"
  source = "../frontend/index.html"
  content_type = "text/html"
  etag = filemd5("Cloud/AWS-E-commerce-Platform-/frontend/index.html")
}

resource "aws_s3_object" "error"{
  bucket = aws_s3_bucket.static_website.id
  key = "error.html"
  source = "../frontend/error.html"
  content_type = "text/html"
  etag = filemd5("Cloud/AWS-E-commerce-Platform-/frontend/error.html")
}

resource "aws_s3_object" "styles" {
  bucket = aws_s3_bucket.static_website.id
  key = "styles.css"
  source = "../frontend/styles.css"
  content_type = "text/css"
  etag = filemd5("Cloud/AWS-E-commerce-Platform-/frontend/styles.css")
}

resource "aws_s3_object" "script" {
  bucket = aws_s3_bucket.static_website.id
  key = "script.js"
  source = "../frontend/script.js"
  content_type = "application/javascript"
  etag = filemd5("Cloud/AWS-E-commerce-Platform-/frontend/script.js")
}

resource "aws_cloudfront_origin_access_control" "oac"{
  name = "static-website-oac"
  description = "OAC for static website"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

resource "aws_cloudfront_distribution" "cdn"{
  enabled = true
  is_ipv6_enabled = true
  comment = "E-Commerce Demo CDN"
  default_root_object = "index.html"

  # use free tier pricing
  price_class = "PriceClass_100"

  #Origin
  origin {
    domain_name = aws_s3_bucket.static_website.bucket_regional_domain_name
    origin_id = "S3Origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  #Default Cache Behavior
  default_cache_behavior {
    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = "S3Origin"

    # Managed cache policy
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"

    viewer_protocol_policy = "redirect-to-https"
    compress = true
  }

  # No Geo restrictions
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Cloudfront SSL cert
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "ecommerce-demo-cdn"
    Project = "ECommerce-Demo"
  }
}

# Bucket Policy
resource "aws_s3_bucket_policy" "cloudfront_only"{
  bucket = aws_s3_bucket.static_website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = "s3:GetObject"
        Resource = "${aws_s3_bucket.static_website.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.cdn.arn
          }
        }
      }
    ]
  })
}