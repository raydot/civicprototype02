# Political Report Generator Migration Guide

## Overview

This guide explains how to extract the `handleGenerateReport` functionality from your Next.js application and use it in different environments.

## Current Architecture

The report generation system consists of:

- **Frontend Handler**: `handleGenerateReport()` in `/src/app/page.js`
- **API Route**: `/src/app/api/recommendations/route.js`
- **Core Logic**: `generateRecommendationsWithGPT()` in `/src/utils/openai.js`
- **Dependencies**: OpenAI API, zip code lookup service

## Migration Options

### 1. Standalone Node.js Script (Easiest)

**Best for**: Command-line usage, batch processing, simple integrations

**Setup**:

```bash
# Install dependencies
npm install openai

# Set environment variable
export OPENAI_API_KEY="your-api-key-here"

# Run the script
node standalone-report-generator.js
```

**Usage**:

```javascript
import { generateRecommendations } from './standalone-report-generator.js'

const selections = {
  category01: 'Local Taxes',
  category01Concern: 'Property tax increases',
  category02: 'Healthcare',
  category02Concern: 'Medicare reform',
  category03: 'Climate Change',
  category03Concern: 'International cooperation',
  zipCode: '90210',
  educationLevel: "Bachelor's Degree",
}

const report = await generateRecommendations(selections)
```

### 2. Express.js API Server

**Best for**: Microservice architecture, multiple client applications

**Setup**:

```bash
npm init -y
npm install express openai cors helmet
```

**Implementation**:

```javascript
// server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { generateRecommendations } from './standalone-report-generator.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors())
app.use(express.json())

app.post('/api/recommendations', async (req, res) => {
  try {
    const { selections } = req.body
    const report = await generateRecommendations(selections)
    res.json({ report: `# Your Personalized Report\n\n${report}` })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### 3. Python Implementation

**Best for**: Data science workflows, Jupyter notebooks, Python ecosystems

```python
# requirements.txt
openai==1.3.0
requests==2.31.0

# report_generator.py
import openai
import requests
import json
import os
from datetime import datetime

class PoliticalReportGenerator:
    def __init__(self, api_key=None):
        self.client = openai.OpenAI(api_key=api_key or os.getenv('OPENAI_API_KEY'))

    def get_city_state_from_zip(self, zip_code):
        try:
            response = requests.get(f"https://api.zippopotam.us/us/{zip_code}")
            if response.ok:
                data = response.json()
                place = data['places'][0]
                return {
                    'city': place['place name'],
                    'state': place['state'],
                    'country': 'USA'
                }
        except Exception as e:
            print(f"Error fetching location: {e}")
        return None

    def generate_recommendations(self, selections):
        # Implementation similar to Node.js version
        # ... (full implementation would go here)
        pass
```

### 4. REST API Documentation

**For external integrations**:

```yaml
# api-spec.yaml (OpenAPI 3.0)
openapi: 3.0.0
info:
  title: Political Report Generator API
  version: 1.0.0
paths:
  /api/recommendations:
    post:
      summary: Generate political recommendations
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                selections:
                  type: object
                  properties:
                    category01:
                      type: string
                      description: Local political issue
                    category01Concern:
                      type: string
                      description: Specific local concern
                    category02:
                      type: string
                      description: National political issue
                    category02Concern:
                      type: string
                      description: Specific national concern
                    category03:
                      type: string
                      description: International political issue
                    category03Concern:
                      type: string
                      description: Specific international concern
                    zipCode:
                      type: string
                      description: User's zip code
                    educationLevel:
                      type: string
                      description: User's education level
      responses:
        '200':
          description: Successfully generated report
          content:
            application/json:
              schema:
                type: object
                properties:
                  report:
                    type: string
                    description: Generated markdown report
```

## Required Dependencies

### Node.js/JavaScript

```json
{
  "dependencies": {
    "openai": "^4.0.0"
  }
}
```

### Python

```txt
openai>=1.3.0
requests>=2.31.0
```

### Environment Variables

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

## Key Components to Extract

### 1. Core Function

- `generateRecommendationsWithGPT()` - Main AI generation logic
- `getCityStateFromZip()` - Location lookup utility

### 2. Configuration

- OpenAI model settings (gpt-4-turbo)
- Temperature, top_p, max_tokens parameters
- System and user prompts

### 3. Data Structure

The `selections` object format:

```javascript
{
  category01: string,        // Local issue
  category01Concern: string, // Local concern
  category02: string,        // National issue
  category02Concern: string, // National concern
  category03: string,        // International issue
  category03Concern: string, // International concern
  zipCode: string,          // User location
  educationLevel: string    // Education context
}
```

## Integration Examples

### Webhook Integration

```javascript
// For platforms like Zapier, Make.com
app.post('/webhook/generate-report', async (req, res) => {
  const selections = req.body
  const report = await generateRecommendations(selections)
  res.json({ success: true, report })
})
```

### CLI Tool

```bash
#!/bin/bash
# generate-report.sh
node -e "
import('./standalone-report-generator.js').then(async ({ generateRecommendations }) => {
  const selections = JSON.parse(process.argv[1]);
  const report = await generateRecommendations(selections);
  console.log(report);
});
" "$1"
```

## Security Considerations

1. **API Key Protection**: Never expose OpenAI API key in client-side code
2. **Rate Limiting**: Implement request throttling for public APIs
3. **Input Validation**: Sanitize user inputs before processing
4. **CORS Configuration**: Restrict origins for web-based integrations

## Cost Optimization

- **Token Management**: Monitor and limit max_tokens per request
- **Caching**: Cache responses for identical inputs
- **Batch Processing**: Group multiple requests when possible
- **Model Selection**: Consider using GPT-3.5-turbo for cost savings

## Testing

```javascript
// test-report-generator.js
import { generateRecommendations } from './standalone-report-generator.js'

const testSelections = {
  category01: 'Transportation',
  category02: 'Education',
  category03: 'Trade Policy',
  zipCode: '10001',
}

console.log(await generateRecommendations(testSelections))
```

## Deployment Options

1. **Serverless Functions**: AWS Lambda, Vercel Functions, Netlify Functions
2. **Container Deployment**: Docker + Kubernetes
3. **Traditional Hosting**: VPS with PM2 or similar process manager
4. **Cloud Functions**: Google Cloud Functions, Azure Functions
