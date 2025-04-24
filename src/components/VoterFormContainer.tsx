import { VoterForm } from '@/components/VoterForm';
import { VoterFormValues } from '@/schemas/voterFormSchema';
import { RecommendationsData } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecommendationsViewer } from '@/components/priorities/RecommendationsViewer';
import { useState, useEffect } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PriorityMappingTable } from './priorities/PriorityMappingTable';
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AutoFillMenu } from "@/components/AutoFillMenu";

type ModeType = "current" | "demo";

interface VoterFormContainerProps {
  onSubmit: (values: VoterFormValues) => Promise<void>;
  isLoading: boolean;
  recommendations: RecommendationsData | null;
  mode?: ModeType;
}

// Schema for just the ZIP code
const ZipCodeSchema = z.object({
  zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be exactly 5 digits")
});

type ZipCodeFormValues = z.infer<typeof ZipCodeSchema>;

export const VoterFormContainer = ({
  onSubmit,
  isLoading,
  recommendations,
  mode = 'demo'
}: VoterFormContainerProps) => {
  const [selectedMode, setSelectedMode] = useState<ModeType>(mode);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMappingOnly, setShowMappingOnly] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [mappedPriorities, setMappedPriorities] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Form for ZIP code
  const zipForm = useForm<ZipCodeFormValues>({
    resolver: zodResolver(ZipCodeSchema),
    defaultValues: {
      zipCode: recommendations?.zipCode || ""
    }
  });
  
  // Update ZIP form value when recommendations change
  useEffect(() => {
    if (recommendations?.zipCode) {
      zipForm.setValue("zipCode", recommendations.zipCode);
    }
  }, [recommendations?.zipCode, zipForm]);
  
  // Debug logging
  useEffect(() => {
    console.log('VoterFormContainer rendered with recommendations:', recommendations);
    
    // If we have recommendations, extract the mapped priorities
    if (recommendations?.analysis?.mappedPriorities) {
      // Log the structure of mappedPriorities for debugging
      console.log('Mapped priorities structure:', JSON.stringify(recommendations.analysis.mappedPriorities, null, 2));
      
      // Make sure we're creating a deep copy and the data is properly structured
      const processedPriorities = recommendations.analysis.mappedPriorities.map(priority => {
        // Ensure each priority has the required fields
        return {
          original: priority.original || '',
          mappedTerms: Array.isArray(priority.mappedTerms) ? priority.mappedTerms : [],
          category: priority.category || ''
        };
      });
      
      setMappedPriorities(processedPriorities);
      setShowMappingOnly(true);
    }
  }, [recommendations]);

  const handleModeChange = (value: ModeType) => {
    setSelectedMode(value);
    toast({
      title: `Mode changed to ${value === 'current' ? 'Current Date' : 'Election SIM Mode'}`,
      description: "Your form has been updated with the new mode."
    });
  };

  const handleUpdatePriorities = async (updatedPriorities: string[]) => {
    setIsUpdating(true);
    try {
      console.log('Updating priorities:', updatedPriorities);
      await onSubmit({
        mode: selectedMode,
        zipCode: zipForm.getValues().zipCode,
        priorities: updatedPriorities
      });
    } catch (error) {
      console.error('Error updating priorities:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFormSubmit = async (values: any) => {
    console.log('Form submitted with values:', values);
    try {
      // Ensure the mode and ZIP code are included
      const formValues: VoterFormValues = {
        ...values,
        mode: selectedMode,
        zipCode: zipForm.getValues().zipCode
      };
      setShowMappingOnly(true);
      setShowRecommendations(false);
      await onSubmit(formValues);
    } catch (error) {
      console.error('Error in form submission:', error);
      // Log to localStorage for persistent debugging
      const errorLog = JSON.parse(localStorage.getItem('formErrorLog') || '[]');
      errorLog.push({
        timestamp: new Date().toISOString(),
        values,
        error: error instanceof Error ? error.message : String(error)
      });
      localStorage.setItem('formErrorLog', JSON.stringify(errorLog.slice(-10))); // Keep last 10 errors
    }
  };
  
  const handleZipCodeSubmit = async (data: ZipCodeFormValues) => {
    // If we have priorities already, update them with the new ZIP code
    // but don't reset the priorities mapping table
    if (recommendations?.analysis?.priorities?.length) {
      await onSubmit({
        mode: selectedMode,
        zipCode: data.zipCode,
        priorities: recommendations.analysis.priorities
      });
    }
  };
  
  const handleGetRecommendations = () => {
    setShowMappingOnly(false);
    setShowRecommendations(true);
    toast({
      title: "Generating recommendations",
      description: "Preparing your personalized recommendations based on your priorities."
    });
  };

  const handleRandomZipCode = (zipCode: string) => {
    zipForm.setValue("zipCode", zipCode);
  };

  const handleAutoFill = (values: { zipCode: string; priorities: string[] }) => {
    zipForm.setValue("zipCode", values.zipCode);
    if (typeof setMappedPriorities === 'function') {
      setMappedPriorities(values.priorities);
    }
    toast({ title: "Auto-filled!", description: "Random ZIP and priorities set." });
  };

  return (
    <div className="relative space-y-4">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Analyzing your priorities...</p>
          </div>
        </div>
      )}
      
      <ReactErrorBoundary
        FallbackComponent={(props) => (
          <ErrorFallback {...props} componentName="VoterFormContainer" />
        )}
        onReset={() => {
          // Reset form state if needed
          console.log('VoterFormContainer error boundary reset');
        }}
      >
        {!recommendations && (
          <Card className="w-full shadow-sm">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Mode Selection</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <RadioGroup
                value={selectedMode}
                onValueChange={handleModeChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current" id="current" />
                  <Label htmlFor="current" className="text-sm">Current Date</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="demo" id="demo" />
                  <Label htmlFor="demo" className="text-sm">Election SIM Mode</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {!recommendations && (
          <Card className="w-full shadow-sm">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">ZIP Code</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <Form {...zipForm}>
                <FormField
                  control={zipForm.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <Input placeholder="00000" className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </CardContent>
          </Card>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <AutoFillMenu onSelect={handleAutoFill} mode={selectedMode} />
        </div>

        {!recommendations && (
          <Card className="w-full shadow-sm">
            <CardHeader className="py-3 px-4">
              <CardTitle>Your Voting Priorities</CardTitle>
              <CardDescription className="text-sm">
                Tell us what matters most to you, and we'll help match you with candidates and measures that align with your values.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <VoterForm 
                onSubmit={handleFormSubmit} 
                isLoading={isLoading}
                onRandomZipCode={handleRandomZipCode}
              />
            </CardContent>
          </Card>
        )}

        {/* Priority Mapping Table - Only visible after priorities are submitted and before "Get Recommendations" is clicked */}
        {recommendations && mappedPriorities.length > 0 && showMappingOnly && (
          <Card className="w-full shadow-sm">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Priorities Mapping</CardTitle>
              <CardDescription className="mt-1 text-sm">
                We have mapped your priorities to policy terms to provide the best recommendations.
                Please update your priorities below if we didn't get this right!
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <PriorityMappingTable 
                mappedPriorities={mappedPriorities}
                onUpdatePriorities={handleUpdatePriorities}
                isUpdating={isUpdating}
              />
              
              <div className="mt-4">
                <Button 
                  onClick={handleGetRecommendations} 
                  className="w-full h-9 text-sm"
                  variant="default"
                >
                  Get Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations - Only visible after clicking "Get Recommendations" */}
        {recommendations && showRecommendations && (
          <ReactErrorBoundary
            FallbackComponent={(props) => (
              <ErrorFallback {...props} componentName="RecommendationsViewer" />
            )}
            onReset={() => {
              console.log('RecommendationsViewer error boundary reset');
            }}
          >
            <Card className="w-full shadow-sm">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">Your Recommendations</CardTitle>
                <CardDescription className="text-sm">
                  Based on your priorities, here are your personalized recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <RecommendationsViewer 
                  recommendations={recommendations}
                  mode={selectedMode}
                  onUpdatePriorities={handleUpdatePriorities}
                  isUpdating={isUpdating}
                />
              </CardContent>
            </Card>
          </ReactErrorBoundary>
        )}
      </ReactErrorBoundary>
    </div>
  );
};
