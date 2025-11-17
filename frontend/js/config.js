// Configuration - Update with your Terraform outputs
const CONFIG = {
    cognito: {
        userPoolId: 'COPY_FROM_TERRAFORM_OUTPUT',
        clientId: 'COPY_FROM_TERRAFORM_OUTPUT',
        domain: 'COPY_FROM_TERRAFORM_OUTPUT',
        region: 'eu-west-1'
    },
    api: {
        endpoint: 'YOUR_API_GATEWAY_ENDPOINT' // We'll add this later
    }
};
