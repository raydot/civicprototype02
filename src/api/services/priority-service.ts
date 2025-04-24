import { APIClient } from '../utils/api-client';
import { rateLimiters } from '../utils/rate-limiter';
import { caches } from '../utils/cache';
import { APIError, ValidationError } from '../utils/api-error';

interface PriorityAnalysisResult {
  mappings: Record<string, string[]>;
  analysis: string;
  conflicts: Array<{
    priority1: string;
    priority2: string;
    description: string;
  }>;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class PriorityService extends APIClient {
  constructor(apiKey: string) {
    super({
      baseURL: 'https://api.openai.com/v1',
      apiKey,
      headers: {
        'OpenAI-Organization': process.env.OPENAI_ORG_ID || '',
      },
    });
  }

  async analyzePriorities(priorities: string[]): Promise<PriorityAnalysisResult> {
    if (!priorities.length) {
      throw new ValidationError('No priorities provided');
    }

    // Check rate limit
    await rateLimiters.openai.checkLimit('analyze');

    // Check cache
    const cacheKey = priorities.sort().join(',');
    const cached = caches.priorities.get<PriorityAnalysisResult>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.post<OpenAIResponse>('/chat/completions', {
        body: {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a political analyst expert who maps voter priorities to standardized policy terms and identifies potential conflicts.

Instructions:
1. Map each priority to relevant policy areas and political terminology
2. Identify any conflicting priorities
3. Generate a brief analysis explaining the relationships
4. Provide confidence scores for each mapping

Output Format (JSON):
{
  "mappings": {
    "[priority]": ["mapped term 1", "mapped term 2"]
  },
  "analysis": "Multi-paragraph analysis with line breaks",
  "conflicts": [
    {
      "priority1": "first priority",
      "priority2": "second priority",
      "description": "Explanation of the conflict"
    }
  ]
}`
            },
            {
              role: 'user',
              content: `Analyze these voter priorities:\n${priorities.join('\n')}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
      });

      if (!response.choices?.[0]?.message?.content) {
        throw new APIError(
          'Invalid response from OpenAI',
          500,
          'INVALID_RESPONSE'
        );
      }

      const result = JSON.parse(response.choices[0].message.content) as PriorityAnalysisResult;

      // Cache the result
      caches.priorities.set(cacheKey, result);

      return result;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new APIError(
          'Failed to parse OpenAI response',
          500,
          'PARSE_ERROR',
          error
        );
      }
      throw error;
    }
  }
}
