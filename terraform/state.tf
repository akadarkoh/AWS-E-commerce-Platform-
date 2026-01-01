terraform {
    backend "s3" {
        bucket = "commerce-state-bucket-1000"
        key = "terraform.tfstate"
        region = "us-east-1"
        dynamodb_table = "travel-tfstate-lock-commerce"
        ecnrypt = true
    }
}