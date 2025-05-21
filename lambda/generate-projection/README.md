# NBA Draft Hub - AI Projection Lambda Function

This AWS Lambda function handles secure AI player projections for NBA Draft Hub.

## Setup Instructions

### 1. Create Lambda Function

1. Navigate to AWS Lambda console.
2. Click "Create function" and select "Author from scratch".
3. Enter function name, e.g., `drafthub-ai-projection`.
4. Select Node.js 16.x or later runtime.
5. Click "Create function".

### 2. Deploy Code

From this directory, run:

```bash
npm install
zip -r function.zip index.js node_modules package.json
```

Then upload the zip file to your Lambda function through the AWS Console or CLI:

```bash
aws lambda update-function-code --function-name drafthub-ai-projection --zip-file fileb://function.zip
```

### 3. Configure Environment Variables

In the Lambda console:
1. Navigate to the "Configuration" tab.
2. Click "Environment variables".
3. Add:
   - Key: `OPENROUTER_API_KEY`
   - Value: Your OpenRouter API key

### 4. Set IAM Permissions

1. Create a new IAM policy using the contents of `iam-policy.json`.
2. Attach the policy to your Lambda function's execution role.

### 5. Create API Gateway Endpoint

1. Navigate to API Gateway console.
2. Create a new REST API.
3. Create a new resource and POST method that integrates with your Lambda function.
4. Deploy the API to create a production stage.
5. Copy the Invoke URL of your endpoint and update the `VITE_LAMBDA_API_ENDPOINT` in your `.env` file.

### 6. Configure CORS

In API Gateway:
1. Select your resource and click "Enable CORS".
2. Configure allowed origins (e.g., `https://yourdomain.com`).
3. Select "Enable CORS and replace existing CORS headers".
4. Redeploy your API.

### 7. Testing

Test your Lambda function with a sample event:

```json
{
  "body": "{\"prompt\":\"Generate a scouting report for Kevin Durant\", \"systemMessage\":\"You are a professional NBA scout.\", \"temperature\":0.7, \"maxTokens\":1000}"
}
``` 