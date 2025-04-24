import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { OpenAIService } from '@/services/openai-service';
import { useToast } from '@/hooks/use-toast';

export function OpenAIKeyInput() {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();
  const openAIService = new OpenAIService();

  useEffect(() => {
    // Check if API key is already configured
    const savedKey = localStorage.getItem('openai_api_key');
    setIsConfigured(!!savedKey);
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Save API key to localStorage
      openAIService.setApiKey(apiKey);
      setIsConfigured(true);
      setApiKey('');
      
      toast({
        title: 'Success',
        description: 'OpenAI API key saved successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to save API key',
        variant: 'destructive',
      });
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('openai_api_key');
    setIsConfigured(false);
    setApiKey('');
    
    toast({
      title: 'API Key Removed',
      description: 'OpenAI API key has been removed',
      variant: 'default',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>OpenAI API Configuration</CardTitle>
        <CardDescription>
          {isConfigured 
            ? 'OpenAI API is configured and ready to use'
            : 'Enter your OpenAI API key to enable AI-powered priority mapping'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConfigured ? (
          <div className="flex items-center space-x-2">
            <Input
              type="password"
              placeholder="Enter OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveKey}>Save Key</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">API key is securely stored in your browser</span>
            <Button variant="outline" onClick={handleClearKey}>Remove Key</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Your API key is stored locally in your browser and is never sent to our servers.
      </CardFooter>
    </Card>
  );
}
