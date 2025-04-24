// This service handles sending unmapped user inputs to an external AI service
// for clarification and suggestion generation

interface ClarificationResponse {
  suggestedQuestion: string;
  possibleTopics: string[];
  confidence: number;
}

export class AIClarificationService {
  private apiKey: string | null = null;
  private endpoint: string = 'https://api.openai.com/v1/chat/completions';
  
  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
    } else {
      // Try to get from environment
      this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
    }
  }
  
  /**
   * Set the API key for the service
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  /**
   * Check if the service is configured with an API key
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
  
  /**
   * Get clarification for an unmapped user input
   * This will call the external AI API to generate a clarification question
   */
  async getClarification(userInput: string): Promise<ClarificationResponse> {
    if (!this.apiKey) {
      // If no API key, return a default response
      return this.getDefaultClarification(userInput);
    }
    
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that helps clarify political priorities. 
              When given a statement that is unclear or doesn't match standard policy topics, 
              generate a clarification question in the format "Do you mean - [specific policy topic]?" 
              Also suggest 2-3 possible policy topics this might relate to. Keep your response brief and focused.`
            },
            {
              role: 'user',
              content: `The user said: "${userInput}". 
              This doesn't clearly match our standard policy topics. 
              Generate a clarification question and suggest possible policy topics.`
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error from OpenAI API:', data.error);
        return this.getDefaultClarification(userInput);
      }
      
      const aiResponse = data.choices[0].message.content;
      
      // Parse the AI response to extract the question and topics
      return this.parseAIResponse(aiResponse, userInput);
      
    } catch (error) {
      console.error('Error calling AI service:', error);
      return this.getDefaultClarification(userInput);
    }
  }
  
  /**
   * Parse the AI response to extract the clarification question and possible topics
   */
  private parseAIResponse(aiResponse: string, originalInput: string): ClarificationResponse {
    // Default values
    let suggestedQuestion = `Do you mean - something related to ${originalInput}?`;
    const possibleTopics: string[] = [];
    
    try {
      // Try to extract the question (should be in format "Do you mean - ...?")
      const questionMatch = aiResponse.match(/Do you mean - [^?]+\?/i);
      if (questionMatch) {
        suggestedQuestion = questionMatch[0];
      }
      
      // Try to extract topics (often listed after the question)
      const topicsSection = aiResponse.replace(suggestedQuestion, '');
      const topicMatches = topicsSection.match(/[A-Z][a-zA-Z\s]+(?:Policy|Rights|Reform|Security|Care|Control|Action|Justice)/g);
      
      if (topicMatches && topicMatches.length > 0) {
        topicMatches.forEach(topic => {
          const cleanTopic = topic.trim();
          if (cleanTopic && !possibleTopics.includes(cleanTopic)) {
            possibleTopics.push(cleanTopic);
          }
        });
      }
      
      // If we couldn't extract topics, try a different approach
      if (possibleTopics.length === 0) {
        const lines = aiResponse.split('\n');
        for (const line of lines) {
          if (line.includes(':') || line.includes('-') || line.includes('•')) {
            const parts = line.split(/[:•-]/);
            if (parts.length > 1) {
              const topic = parts[1].trim();
              if (topic && !possibleTopics.includes(topic)) {
                possibleTopics.push(topic);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }
    
    return {
      suggestedQuestion,
      possibleTopics: possibleTopics.length > 0 ? possibleTopics : this.generateDefaultTopics(originalInput),
      confidence: 0.5 // Medium confidence for AI-generated suggestions
    };
  }
  
  /**
   * Generate a default clarification when API is not available
   */
  private getDefaultClarification(userInput: string): ClarificationResponse {
    return {
      suggestedQuestion: `Do you mean - something related to ${this.categorizeInput(userInput)}?`,
      possibleTopics: this.generateDefaultTopics(userInput),
      confidence: 0.3 // Low confidence for default suggestions
    };
  }
  
  /**
   * Simple categorization of user input when API is not available
   */
  private categorizeInput(input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.match(/tax|money|income|economy|job|wage|debt|spend|cost/)) {
      return 'economic policy';
    }
    
    if (lowerInput.match(/health|doctor|medical|insurance|hospital|medicine/)) {
      return 'healthcare';
    }
    
    if (lowerInput.match(/school|education|student|teacher|learn|college|university/)) {
      return 'education';
    }
    
    if (lowerInput.match(/environment|climate|pollution|green|energy|renewable/)) {
      return 'environmental policy';
    }
    
    if (lowerInput.match(/gun|crime|police|safety|violence|law|justice/)) {
      return 'public safety';
    }
    
    if (lowerInput.match(/vote|election|democracy|government|congress|president/)) {
      return 'governance';
    }
    
    if (lowerInput.match(/immigrant|border|foreign|international|global|trade/)) {
      return 'international policy';
    }
    
    return 'policy priorities';
  }
  
  /**
   * Generate default topics based on simple text analysis
   */
  private generateDefaultTopics(input: string): string[] {
    const lowerInput = input.toLowerCase();
    const topics: string[] = [];
    
    if (lowerInput.match(/tax|money|income|economy|job|wage|debt|spend|cost/)) {
      topics.push('Economic Policy', 'Tax Reform');
    }
    
    if (lowerInput.match(/health|doctor|medical|insurance|hospital|medicine/)) {
      topics.push('Healthcare Access', 'Medical Insurance');
    }
    
    if (lowerInput.match(/school|education|student|teacher|learn|college|university/)) {
      topics.push('Education Reform', 'School Funding');
    }
    
    if (lowerInput.match(/environment|climate|pollution|green|energy|renewable/)) {
      topics.push('Environmental Protection', 'Climate Policy');
    }
    
    if (lowerInput.match(/gun|crime|police|safety|violence|law|justice/)) {
      topics.push('Public Safety', 'Criminal Justice Reform');
    }
    
    if (lowerInput.match(/vote|election|democracy|government|congress|president/)) {
      topics.push('Electoral Reform', 'Government Transparency');
    }
    
    if (lowerInput.match(/immigrant|border|foreign|international|global|trade/)) {
      topics.push('Immigration Policy', 'International Relations');
    }
    
    // If no matches, provide general topics
    if (topics.length === 0) {
      topics.push('Policy Reform', 'Government Priorities', 'Civic Engagement');
    }
    
    return topics.slice(0, 3); // Return up to 3 topics
  }
}
