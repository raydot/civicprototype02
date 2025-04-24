import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceFactory } from '../api/service-factory';
import { APIError } from '../api/utils/api-error';

interface VoterInfoParams {
  zipCode?: string;
  state?: string;
  priorities?: string[];
}

interface UseVoterInfoOptions {
  enabled?: boolean;
  onError?: (error: Error) => void;
}

export function useVoterInfo(
  params: VoterInfoParams,
  options: UseVoterInfoOptions = {}
) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch representatives by ZIP code
  const representatives = useQuery({
    queryKey: ['representatives', params.zipCode],
    queryFn: async () => {
      if (!params.zipCode) return [];
      return serviceFactory.getCivicService().getRepresentativesByZip(params.zipCode);
    },
    enabled: !!params.zipCode && !!options.enabled,
    onError: options.onError,
  });

  // Fetch candidates by state
  const candidates = useQuery({
    queryKey: ['candidates', params.state],
    queryFn: async () => {
      if (!params.state) return [];
      const currentYear = new Date().getFullYear();
      return serviceFactory.getFECService().getCandidatesByState(params.state, currentYear);
    },
    enabled: !!params.state && !!options.enabled,
    onError: options.onError,
  });

  // Fetch ballot measures by state
  const ballotMeasures = useQuery({
    queryKey: ['ballotMeasures', params.state],
    queryFn: async () => {
      if (!params.state) return [];
      const currentYear = new Date().getFullYear();
      return serviceFactory
        .getBallotService()
        .getMeasuresByState(params.state, currentYear, { status: 'active' });
    },
    enabled: !!params.state && !!options.enabled,
    onError: options.onError,
  });

  // Analyze priorities mutation
  const analyzePriorities = useMutation({
    mutationFn: async (priorities: string[]) => {
      setIsAnalyzing(true);
      try {
        const analysis = await serviceFactory
          .getPriorityService()
          .analyzePriorities(priorities);

        // Update representatives with alignment
        if (representatives.data) {
          const updatedReps = representatives.data.map((rep) => ({
            ...rep,
            issueAreas: Object.entries(analysis.mappings)
              .filter(([, terms]) =>
                rep.contactInfo.website?.toLowerCase().includes(terms[0].toLowerCase())
              )
              .map(([priority]) => priority),
            alignment: '⚠️', // Would need more data to determine alignment
          }));
          queryClient.setQueryData(['representatives', params.zipCode], updatedReps);
        }

        // Update candidates with alignment
        if (candidates.data) {
          const updatedCandidates = candidates.data.map((candidate) => ({
            ...candidate,
            platformHighlights: Object.values(analysis.mappings).flat(),
            alignment: '⚠️', // Would need more data to determine alignment
          }));
          queryClient.setQueryData(['candidates', params.state], updatedCandidates);
        }

        // Update ballot measures with user concern mapping
        if (ballotMeasures.data) {
          const updatedMeasures = ballotMeasures.data.map((measure) => ({
            ...measure,
            userConcernMapping: Object.entries(analysis.mappings).find(([, terms]) =>
              terms.some((term) =>
                measure.description.toLowerCase().includes(term.toLowerCase())
              )
            )?.[0],
          }));
          queryClient.setQueryData(['ballotMeasures', params.state], updatedMeasures);
        }

        return analysis;
      } finally {
        setIsAnalyzing(false);
      }
    },
    onError: options.onError,
  });

  // Refresh all data
  const refresh = useCallback(async () => {
    try {
      await Promise.all([
        representatives.refetch(),
        candidates.refetch(),
        ballotMeasures.refetch(),
      ]);

      if (params.priorities?.length) {
        await analyzePriorities.mutateAsync(params.priorities);
      }
    } catch (error) {
      if (error instanceof APIError) {
        options.onError?.(error);
      } else if (error instanceof Error) {
        options.onError?.(error);
      }
    }
  }, [
    params.priorities,
    representatives.refetch,
    candidates.refetch,
    ballotMeasures.refetch,
    analyzePriorities.mutateAsync,
    options.onError,
  ]);

  return {
    representatives: {
      data: representatives.data,
      isLoading: representatives.isLoading,
      error: representatives.error,
    },
    candidates: {
      data: candidates.data,
      isLoading: candidates.isLoading,
      error: candidates.error,
    },
    ballotMeasures: {
      data: ballotMeasures.data,
      isLoading: ballotMeasures.isLoading,
      error: ballotMeasures.error,
    },
    priorities: {
      analyze: analyzePriorities.mutate,
      isAnalyzing,
      error: analyzePriorities.error,
    },
    refresh,
    isLoading:
      representatives.isLoading ||
      candidates.isLoading ||
      ballotMeasures.isLoading ||
      isAnalyzing,
  };
}
