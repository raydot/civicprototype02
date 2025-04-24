import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PolicyMapper } from '@/services/policy-mapper';
import { MappedPriority } from '@/types/policy-mappings';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { OpenAIService } from '@/services/openai-service';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function TestMappingForm() {
  const [priority, setPriority] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [mappedPriorities, setMappedPriorities] = useState<MappedPriority[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editedPriorities, setEditedPriorities] = useState<string[]>([]);
  const [showInputForm, setShowInputForm] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  
  const policyMapper = new PolicyMapper();
  const openAIService = new OpenAIService();
  
  // Check if API key is stored in localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      openAIService.setApiKey(storedApiKey);
      setIsApiConfigured(true);
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      openAIService.setApiKey(apiKey);
      setIsApiConfigured(true);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!priority.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Try to use OpenAI service first for better mapping
      let analysis;
      if (isApiConfigured) {
        try {
          analysis = await openAIService.analyzePriorities([priority]);
          console.log('Using OpenAI analysis');
        } catch (error) {
          console.error('OpenAI analysis failed:', error);
          analysis = null;
        }
      }
      
      // Fall back to policy mapper if OpenAI fails or isn't configured
      if (!analysis) {
        analysis = await policyMapper.mapPriorities([priority]);
        console.log('Using local policy mapper');
      }
      
      setMappedPriorities(analysis.mappedPriorities);
      setEditedPriorities(analysis.mappedPriorities.map(p => p.original));
      setPriority(''); // Clear the input field
      setShowInputForm(false); // Hide the input form after submission
    } catch (error) {
      console.error('Error mapping priority:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTestCase = (testCase: string) => {
    setPriority(testCase);
  };
  
  const handleEditPriority = (index: number, newValue: string) => {
    const newEditedPriorities = [...editedPriorities];
    newEditedPriorities[index] = newValue;
    setEditedPriorities(newEditedPriorities);
    setIsEditing(true);
  };
  
  const handleUpdateMapping = async () => {
    if (editedPriorities.length === 0 || !editedPriorities.some(p => p.trim())) return;
    
    setIsLoading(true);
    
    try {
      // Filter out empty priorities
      const validPriorities = editedPriorities.filter(p => p.trim());
      
      // Try to use OpenAI service first for better mapping
      let analysis;
      if (isApiConfigured) {
        try {
          analysis = await openAIService.analyzePriorities(validPriorities);
          console.log('Using OpenAI analysis for update');
        } catch (error) {
          console.error('OpenAI analysis failed:', error);
          analysis = null;
        }
      }
      
      // Fall back to policy mapper if OpenAI fails or isn't configured
      if (!analysis) {
        analysis = await policyMapper.mapPriorities(validPriorities);
        console.log('Using local policy mapper for update');
      }
      
      setMappedPriorities(analysis.mappedPriorities);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating mappings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setShowInputForm(true);
    setMappedPriorities([]);
    setPriority('');
    setEditedPriorities([]);
  };
  
  const testCases = [
    'I want women to have choices and control over our bodies',
    'I think it is important that the law protects LGBTQ+ rights and prevents racial discrimination',
    'It\'s rigged, the whole system is corrupt',
    'I voted once, but it felt forced, like I didn\'t have anyone great to choose from. Just because a candidate is a woman doesn\'t mean she\'s going to be any better.',
    'Tired of high income taxes; wants to pass on wealth to children',
    'Disagrees with hiring based on race/gender',
    'Uncertain about climate change claims',
    'Needs better local transportation',
    'I don\'t trust the Democrats',
    'We need to move beyond race-based policies',
    'My biggest concern is the future of AI'
  ];
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Priority Mapping Test</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {isApiConfigured ? 'API Configured' : 'Configure API'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>OpenAI API Configuration</DialogTitle>
              <DialogDescription>
                Enter your OpenAI API key to enable advanced priority mapping.
                The key will be stored in your browser's local storage.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="apiKey" className="text-right">
                  API Key
                </Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveApiKey}>Save API Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {showInputForm ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Your Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={zipCode} 
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter ZIP code (optional)"
                  className="w-1/4"
                />
                <Input 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  placeholder="Enter a priority..."
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Mapping...' : 'Map Priority'}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {testCases.map((testCase, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    onClick={() => handleAddTestCase(testCase)}
                    className="text-xs"
                  >
                    {testCase}
                  </Button>
                ))}
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Your Mapped Priority</h2>
          <Button onClick={handleReset} variant="outline">
            Enter New Priority
          </Button>
        </div>
      )}
      
      {mappedPriorities.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mapping Results</CardTitle>
            {isEditing && (
              <Button 
                onClick={handleUpdateMapping}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? 'Updating...' : 'Update Mapping'}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {zipCode && (
              <div className="mb-4">
                <p className="text-sm font-medium">ZIP Code: {zipCode}</p>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Your Priority</TableHead>
                  <TableHead className="w-1/3">Mapped Policy Term(s)</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappedPriorities.map((priority, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Textarea 
                        value={editedPriorities[index] || priority.original}
                        onChange={(e) => handleEditPriority(index, e.target.value)}
                        className="min-h-[80px] resize-none"
                        placeholder="Edit your priority here..."
                      />
                    </TableCell>
                    <TableCell>
                      {priority.needsClarification ? (
                        <div className="space-y-2">
                          <div className="font-medium text-amber-600">{priority.mappedTerms[0]}</div>
                          {priority.possibleTopics && priority.possibleTopics.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {priority.possibleTopics.map((topic, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {priority.mappedTerms.join(', ')}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{priority.category}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          priority.sentiment === 'positive' ? 'default' : 
                          priority.sentiment === 'negative' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {priority.sentiment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={
                          priority.confidence >= 0.8 ? 'text-green-600' : 
                          priority.confidence >= 0.5 ? 'text-amber-600' : 
                          'text-red-600'
                        }>
                          {Math.round(priority.confidence * 100)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
