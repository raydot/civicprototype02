import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  componentStack?: string;
  componentName?: string;
}

export const ErrorFallback = ({ 
  error, 
  resetErrorBoundary,
  componentStack,
  componentName = 'Component'
}: ErrorFallbackProps) => {
  // Log the error to console for debugging
  React.useEffect(() => {
    console.error(`Error in ${componentName}:`, error);
    // Store in localStorage for persistent debugging
    const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
    errorLog.push({
      timestamp: new Date().toISOString(),
      component: componentName,
      message: error.message,
      stack: error.stack,
      componentStack
    });
    localStorage.setItem('errorLog', JSON.stringify(errorLog.slice(-10))); // Keep last 10 errors
  }, [error, componentName, componentStack]);

  return (
    <Card className="w-full border-destructive">
      <CardHeader className="bg-destructive/10">
        <CardTitle className="text-destructive">Error in {componentName}</CardTitle>
        <CardDescription>
          An error occurred while rendering this component
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <strong>Error Message:</strong> {error.message || 'Unknown error'}
        </div>
        
        {error.stack && (
          <div className="mb-4">
            <strong>Stack Trace:</strong>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4 font-mono text-sm">
              {error.stack}
            </ScrollArea>
          </div>
        )}
        
        {componentStack && (
          <div className="mb-4">
            <strong>Component Stack:</strong>
            <ScrollArea className="h-[100px] w-full rounded-md border p-4 font-mono text-sm">
              {componentStack}
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            // Copy error details to clipboard
            const errorDetails = `
Error in ${componentName}
Message: ${error.message}
Stack: ${error.stack}
Component Stack: ${componentStack}
            `;
            navigator.clipboard.writeText(errorDetails);
          }}
        >
          Copy Details
        </Button>
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </CardFooter>
    </Card>
  );
};
