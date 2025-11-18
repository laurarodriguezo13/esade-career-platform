# ESADE Career Intelligence Platform
A serverless career-intelligence prototype built entirely on AWS and developed as part of the ESADE Cloud Solutions coursework.

## Overview
The platform helps ESADE students and alumni explore job opportunities through secure authentication, job-market insights and a scalable serverless backend.  
The frontend provides a complete user experience using Amazon Cognito authentication and client-side recommendations, while the backend ingestion and NLP pipelines run independently in AWS.

---

## Architecture Summary

### Frontend (Amazon S3)
- Static HTML/CSS/JS site hosted on S3  
- Cognito authentication (signup, verification, login)  
- Representative job dataset and ranking logic implemented client-side in `app.js`  
- Live demo:  
  **http://esade-career-dev-frontend-260727659404.s3-website-eu-west-1.amazonaws.com**

### Authentication (Amazon Cognito)
- ESADE-only signup enforced through a Pre-Signup Lambda trigger  
- Email verification workflow enabled  
- Client-side session handling via Cognito tokens

### Data Layer (DynamoDB)
Provisioned with Terraform:

- `jobs-live` — normalized job postings  
- `skill-trends` — aggregated skill frequencies  
- `user-profiles` — provisioned for future integration  
- `recommendations` — backend placeholder table  

TTL is enabled to automatically remove expired items.

### Backend (AWS Lambda)
All Lambda functions are deployed:

- `job-ingestion` — retrieves job data from Adzuna  
- `nlp-enrichment` — extracts skills using Amazon Comprehend  
- `recommendations` — placeholder (frontend currently performs ranking)  
- `cognito-trigger` — enforces allowed email domains  

### Security & Secrets
- Adzuna credentials stored in AWS Secrets Manager  
- IAM roles follow least-privilege design  
- Cognito enforces password complexity and email verification  

### Infrastructure as Code (Terraform)
- Fully modular IaC (Cognito, Lambda, IAM, DynamoDB, S3, CloudFront)  
- Dev environment via `terraform/environments/dev/`  
- Automated packaging and deployment for Lambda functions  

---

## Prototype Behaviour (Current Implementation)
- Authentication is fully functional (real signup & verification).  
- Backend ingestion and NLP pipelines run in AWS.  
- The frontend displays a curated sample of jobs stored in `app.js`.  
- Job recommendations are computed client-side.  
- API Gateway connection is planned for the next version.

---

## Repository Structure

esade-career-platform/
├── aws_architecture.html
├── backend/
│ ├── cognito_trigger/
│ ├── job_ingestion/
│ ├── nlp_enrichment/
│ └── recommendations/
├── frontend/
│ ├── css/
│ ├── js/
│ ├── index.html
│ └── error.html
└── terraform/
├── environments/dev/
└── modules/


---

## Technologies
**AWS:** S3, Lambda, DynamoDB, Cognito, IAM, Secrets Manager, Comprehend  
**External API:** Adzuna Jobs API  
**DevOps:** Terraform, GitHub  
**Languages:** JavaScript, Python, HCL  

---

## Team
Lorena Pinillos, Laura Rodriguez, Margi Ivanova, Kim Schäfer & Tasnim El Faghloumi  
*Educational project developed for ESADE Business School.*

