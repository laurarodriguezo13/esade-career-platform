import json
import boto3
import os
from datetime import datetime, timedelta
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
JOBS_TABLE = os.environ.get('JOBS_TABLE')
USER_PROFILES_TABLE = os.environ.get('USER_PROFILES_TABLE')
RECOMMENDATIONS_TABLE = os.environ.get('RECOMMENDATIONS_TABLE')

def lambda_handler(event, context):
    user_id = event.get('userId') or event.get('pathParameters', {}).get('userId')
    
    if not user_id:
        return {'statusCode': 400, 'body': json.dumps({'error': 'userId required'})}
    
    # Mock recommendations for demo
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'recommendations': [
                {'jobId': '001', 'title': 'Data Scientist', 'matchScore': 85}
            ]
        })
    }
