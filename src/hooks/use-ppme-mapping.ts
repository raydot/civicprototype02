import { useState, useCallback } from 'react';
import { ppmeApiService, PPMEMappingRequest, PPMEMappingResponse, PPMEFeedback } from '@/services/ppme-mock-api';
import { PPMEMappedPriority } from '@/types/ppme';

interface UsePPMEMappingReturn {
  mappingData: PPMEMappingResponse | null;
  isLoading: boolean;
  error: string | null;
  mapPriorities: (request: PPMEMappingRequest) => Promise<void>;
  submitFeedback: (feedback: PPMEFeedback) => Promise<void>;
  getClarification: (priority: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export function usePPMEMapping(): UsePPMEMappingReturn {
  const [mappingData, setMappingData] = useState<PPMEMappingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapPriorities = useCallback(async (request: PPMEMappingRequest) => {
    if (!request.priorities.some(p => p.trim())) {
      setError('At least one priority is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await ppmeApiService.mapPriorities(request);
      setMappingData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to map priorities';
      setError(errorMessage);
      console.error('PPME mapping error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitFeedback = useCallback(async (feedback: PPMEFeedback) => {
    try {
      await ppmeApiService.submitFeedback(feedback);
      
      // Update local mapping data to reflect feedback
      if (mappingData) {
        const updatedPriorities = mappingData.mappedPriorities.map(priority => {
          if (priority.original === feedback.originalPriority) {
            return {
              ...priority,
              // Mark as user-confirmed if thumbs up
              confidence: feedback.feedbackType === 'thumbs_up' ? 1.0 : priority.confidence,
              needsClarification: feedback.feedbackType === 'thumbs_up' ? false : priority.needsClarification
            };
          }
          return priority;
        });

        setMappingData({
          ...mappingData,
          mappedPriorities: updatedPriorities
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit feedback';
      setError(errorMessage);
      console.error('PPME feedback error:', err);
    }
  }, [mappingData]);

  const getClarification = useCallback(async (priority: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const candidates = await ppmeApiService.getClarification(priority);
      
      // Update the mapping data with clarification candidates
      if (mappingData) {
        const updatedPriorities = mappingData.mappedPriorities.map(p => {
          if (p.original === priority) {
            return {
              ...p,
              candidates
            };
          }
          return p;
        });

        setMappingData({
          ...mappingData,
          mappedPriorities: updatedPriorities
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get clarification';
      setError(errorMessage);
      console.error('PPME clarification error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mappingData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setMappingData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    mappingData,
    isLoading,
    error,
    mapPriorities,
    submitFeedback,
    getClarification,
    clearError,
    reset
  };
}
