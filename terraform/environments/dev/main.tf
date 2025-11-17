# DynamoDB Module
module "dynamodb" {
  source = "../../modules/dynamodb"

  project_name = var.project_name
  environment  = var.environment
}

# IAM Module
module "iam" {
  source = "../../modules/iam"

  project_name    = var.project_name
  environment     = var.environment
  dynamodb_tables = module.dynamodb.table_arns
}

# S3 Module
module "s3" {
  source = "../../modules/s3"

  project_name = var.project_name
  environment  = var.environment
}
