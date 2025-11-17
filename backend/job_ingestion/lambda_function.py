import json
import boto3
import os
from datetime import datetime, timedelta

dynamodb = boto3.resource('dynamodb')
JOBS_TABLE = os.environ.get('JOBS_TABLE')

def lambda_handler(event, context):
    print(f"Starting job ingestion at {datetime.utcnow().isoformat()}")
    jobs_table = dynamodb.Table(JOBS_TABLE)
    
    sample_jobs = [
        {
            'jobId': f'job-{int(datetime.utcnow().timestamp())}-001',
            'title': 'Data Scientist',
            'company': 'Tech Corp Europe',
            'description': 'Seeking experienced data scientist with ML, Python, SQL expertise.',
            'location': 'Barcelona, Spain',
            'industry': 'Technology',
            'salary': '55000-75000',
            'workModel': 'Hybrid',
            'experienceLevel': 'Mid-Senior',
            'url': 'https://example.com/jobs/data-scientist',
            'postedDate': datetime.utcnow().isoformat(),
            'skills': ['Python', 'Machine Learning', 'SQL', 'Statistics'],
            'expirationTime': int((datetime.utcnow() + timedelta(days=30)).timestamp())
        }
    ]
    
    for job in sample_jobs:
        jobs_table.put_item(Item=job)
        print(f"Ingested job: {job['jobId']}")
    
    return {'statusCode': 200, 'body': json.dumps({'message': 'Jobs ingested'})}
