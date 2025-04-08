import { useState } from 'react';
import { VoterFormValues } from '@/schemas/voterFormSchema';
import { RecommendationsData } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { PrioritiesApiService } from '@/services/priorities-api-service';

export function usePrioritiesAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [feedbackPriorities, setFeedbackPriorities] = useState<string[]>([]);
  const [submitCount, setSubmitCount] = useState(0);
  const { toast } = useToast();

  const apiService = new PrioritiesApiService(toast);

  const analyzePriorities = async (formData: VoterFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiService.mapPriorities(formData, feedbackPriorities);
      if (response.ok && response.data) {
        setRecommendations(response.data);
        setSubmitCount(prev => prev + 1);
        
        // Show conflicts if any are detected
        if (response.data.analysis.conflicts?.length > 0) {
          toast({
            title: 'Priority Conflicts Detected',
            description: 'Some of your priorities may conflict. Please review the analysis.',
            variant: "default",
          });
        }
      } else {
        throw new Error(response.error || 'Failed to analyze priorities');
      }
    } catch (error: any) {
      console.error('Error analyzing priorities:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while analyzing your priorities',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addFeedbackPriority = (priority: string) => {
    setFeedbackPriorities(prev => [...prev, priority]);
  };

  const removeFeedbackPriority = (priority: string) => {
    setFeedbackPriorities(prev => prev.filter(p => p !== priority));
  };

  return {
    isLoading,
    recommendations,
    feedbackPriorities,
    submitCount,
    analyzePriorities,
    addFeedbackPriority,
    removeFeedbackPriority
  };
}
