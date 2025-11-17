# ESADE Career Intelligence Platform

A serverless career intelligence platform built on AWS, integrating real-time job data from Adzuna API with AI-powered recommendations.

## Project Overview

This platform provides ESADE students and alumni with personalized job recommendations by leveraging:
- Real-time job data from Adzuna API (Spain market)
- NLP-powered skill extraction using AWS Comprehend
- Serverless architecture for scalability and cost-efficiency
- Secure authentication with ESADE email domain restrictions

## Architecture

### Infrastructure Components

**Frontend:**
- Static website hosted on Amazon S3
- Responsive design with ESADE branding
- Real-time job search and recommendations

**Backend Services:**
- **4 Lambda Functions** (Python 3.11):
  1. `job-ingestion`: Fetches jobs from Adzuna API
  2. `nlp-enrichment`: Extracts skills using Amazon Comprehend
  3. `recommendations`: Generates personalized job matches
  4. `cognito-trigger`: Validates ESADE email domains

**Data Layer:**
- **4 DynamoDB Tables**:
  - `jobs-live`: Active job postings with TTL
  - `skill-trends`: Aggregated skill demand data
  - `user-profiles`: Student preferences and history
  - `recommendations`: Pre-computed job matches

**Security & Authentication:**
- Amazon Cognito User Pool with custom triggers
- Email domain restrictions (@esade.edu, @alumni.esade.edu)
- IAM roles with least-privilege access

**Infrastructure as Code:**
- 100% Terraform managed (37 resources)
- Modular design for reusability
- Environment-based configuration

## Key Features

 **Real Job Data**: 21+ jobs from Adzuna API, refreshed automatically
 **Smart Matching**: NLP-powered skill extraction and matching
 **Secure Access**: Domain-restricted authentication
 **Scalable**: Serverless architecture handles varying loads
 **Cost-Efficient**: Pay-per-use pricing model
 **Professional UI**: ESADE-branded dashboard

## Deployment Information

**Environment:** Development (dev)
**Region:** eu-west-1 (Ireland)
**Website URL:** http://esade-career-dev-frontend-260727659404.s3-website-eu-west-1.amazonaws.com

### Current Data:
- **Jobs in Database:** 21 real positions from Adzuna
- **Job Sources:** Barcelona, Madrid, Remote positions
- **Industries:** Technology, Consulting, Finance, Other
- **Lambda Functions:** 4 active functions
- **DynamoDB Tables:** 4 tables with TTL enabled

## 📁 Repository Structure
```
esade-career-platform/
├── backend/
│   ├── job_ingestion/          # Adzuna API integration
│   ├── nlp_enrichment/         # Comprehend skill extraction
│   ├── recommendations/        # Job matching algorithm
│   └── cognito_trigger/        # Email validation
├── frontend/
│   ├── css/styles.css          # ESADE-themed styling
│   ├── js/                     # Application logic
│   ├── index.html              # Main dashboard
│   └── error.html              # Error page
├── terraform/
│   ├── modules/                # Reusable Terraform modules
│   └── environments/dev/       # Development environment
└── README.md
```

## 🔧 Technologies Used

### AWS Services
- AWS Lambda, S3, DynamoDB
- Cognito, IAM, Secrets Manager
- Amazon Comprehend, CloudWatch

### External APIs
- Adzuna Jobs API

### DevOps
- Terraform, GitHub

## Academic Context

**Course:** Cloud Solutions 
**Institution:** ESADE Business School

## Team

 Laura Rodriguez, Lorena Pinillos, Margi Ivanova , Kim Schäfer & Tasnim El Faghloumi


---

**Note:** Educational project for AWS Academy demonstrating cloud architecture skills.
