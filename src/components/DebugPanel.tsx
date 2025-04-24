import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, X, AlertTriangle, Check, RefreshCw } from 'lucide-react';

interface DebugPanelProps {
  onClose: () => void;
}

export const DebugPanel = ({ onClose }: DebugPanelProps) => {
  const [activeTab, setActiveTab] = useState('errors');
  const [errors, setErrors] = useState<any[]>([]);
  const [formLogs, setFormLogs] = useState<any[]>([]);
  const [recommendationsLogs, setRecommendationsLogs] = useState<any[]>([]);
  const [appState, setAppState] = useState<Record<string, any>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load debug data from localStorage
  useEffect(() => {
    try {
      // Load error logs
      const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
      const formErrorLog = JSON.parse(localStorage.getItem('formErrorLog') || '[]');
      setErrors([...errorLog, ...formErrorLog]);

      // Load form logs
      setFormLogs(JSON.parse(localStorage.getItem('formSubmissionLog') || '[]'));

      // Load recommendations logs
      setRecommendationsLogs(JSON.parse(localStorage.getItem('recommendationsDebugLog') || '[]'));

      // Collect app state information
      setAppState({
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        localStorage: Object.keys(localStorage),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading debug data:', error);
    }
  }, [isRefreshing]);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all debug logs?')) {
      localStorage.removeItem('errorLog');
      localStorage.removeItem('formErrorLog');
      localStorage.removeItem('formSubmissionLog');
      localStorage.removeItem('recommendationsDebugLog');
      refreshData();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-yellow-500">
      <CardHeader className="bg-yellow-500/10 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Debug Panel
          </CardTitle>
          <CardDescription>
            Troubleshooting information for VoterPrime application
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="errors" className="flex-1">
              Errors {errors.length > 0 && <Badge variant="destructive" className="ml-2">{errors.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="form" className="flex-1">
              Form Logs
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex-1">
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="state" className="flex-1">
              App State
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="errors" className="p-4">
            {errors.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                <Check className="h-12 w-12 mb-4 text-green-500" />
                <p>No errors logged</p>
              </div>
            ) : (
              <div className="space-y-4">
                {errors.map((error, index) => (
                  <Collapsible key={index} className="border rounded-md">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <div className="font-medium">{error.component || 'Unknown Component'}</div>
                        <div className="text-sm text-muted-foreground">{new Date(error.timestamp).toLocaleString()}</div>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-3 border-t bg-muted/20">
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium">Error Message:</div>
                          <div className="text-sm">{error.message || error.error || 'Unknown error'}</div>
                        </div>
                        {error.stack && (
                          <div>
                            <div className="font-medium">Stack Trace:</div>
                            <ScrollArea className="h-[100px] w-full rounded-md border p-2 font-mono text-xs">
                              {error.stack}
                            </ScrollArea>
                          </div>
                        )}
                        {error.componentStack && (
                          <div>
                            <div className="font-medium">Component Stack:</div>
                            <ScrollArea className="h-[100px] w-full rounded-md border p-2 font-mono text-xs">
                              {error.componentStack}
                            </ScrollArea>
                          </div>
                        )}
                        {error.values && (
                          <div>
                            <div className="font-medium">Form Values:</div>
                            <ScrollArea className="h-[100px] w-full rounded-md border p-2 font-mono text-xs">
                              {JSON.stringify(error.values, null, 2)}
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="form" className="p-4">
            {formLogs.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No form submission logs available
              </div>
            ) : (
              <div className="space-y-4">
                {formLogs.map((log, index) => (
                  <Collapsible key={index} className="border rounded-md">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">Form Submission</div>
                        <div className="text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-3 border-t bg-muted/20">
                      <ScrollArea className="h-[200px] w-full rounded-md border p-2 font-mono text-xs">
                        {JSON.stringify(log, null, 2)}
                      </ScrollArea>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="p-4">
            {recommendationsLogs.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No recommendations logs available
              </div>
            ) : (
              <div className="space-y-4">
                {recommendationsLogs.map((log, index) => (
                  <Collapsible key={index} className="border rounded-md">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">Recommendations Data</div>
                        <div className="text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-3 border-t bg-muted/20">
                      <ScrollArea className="h-[200px] w-full rounded-md border p-2 font-mono text-xs">
                        {log.recommendationsData}
                      </ScrollArea>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="state" className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Browser Information</h3>
                <div className="text-sm">{appState.userAgent}</div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Screen Size</h3>
                <div className="text-sm">{appState.screenSize}</div>
              </div>
              <div>
                <h3 className="font-medium mb-1">LocalStorage Keys</h3>
                <div className="flex flex-wrap gap-2">
                  {appState.localStorage?.map((key: string) => (
                    <Badge key={key} variant="outline">{key}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Last Updated</h3>
                <div className="text-sm">{new Date(appState.timestamp || '').toLocaleString()}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline" size="sm" onClick={clearLogs}>
          Clear All Logs
        </Button>
        <div className="text-xs text-muted-foreground">
          Debug Panel v1.0
        </div>
      </CardFooter>
    </Card>
  );
};
