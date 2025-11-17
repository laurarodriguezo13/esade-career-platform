output "dynamodb_tables" {
  description = "DynamoDB table names"
  value = {
    jobs_live       = module.dynamodb.jobs_live_table_name
    skill_trends    = module.dynamodb.skill_trends_table_name
    user_profiles   = module.dynamodb.user_profiles_table_name
    recommendations = module.dynamodb.recommendations_table_name
  }
}

output "s3_website_endpoint" {
  description = "S3 website endpoint"
  value       = module.s3.website_endpoint
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = module.s3.bucket_name
}
