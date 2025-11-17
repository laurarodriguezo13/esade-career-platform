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

# Lambda Module
module "lambda" {
  source = "../../modules/lambda"
  project_name                = var.project_name
  environment                 = var.environment
  jobs_table_name            = module.dynamodb.jobs_live_table_name
  skill_trends_table_name    = module.dynamodb.skill_trends_table_name
  user_profiles_table_name   = module.dynamodb.user_profiles_table_name
  recommendations_table_name = module.dynamodb.recommendations_table_name
  job_ingestion_role_arn     = module.iam.job_ingestion_lambda_role_arn
  nlp_enrichment_role_arn    = module.iam.nlp_enrichment_lambda_role_arn
  recommendations_role_arn   = module.iam.recommendations_lambda_role_arn
  cognito_trigger_role_arn   = module.iam.cognito_trigger_lambda_role_arn
}

# Cognito Module
module "cognito" {
  source = "../../modules/cognito"
  project_name           = var.project_name
  environment            = var.environment
  allowed_email_domains  = var.allowed_email_domains
  pre_signup_lambda_arn  = module.lambda.cognito_trigger_function_arn
}
