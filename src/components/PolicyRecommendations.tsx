import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon, MagnifyingGlassIcon, SunIcon, ScissorsIcon } from '@radix-ui/react-icons';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';
import { useState, useEffect } from 'react';

const typeIcons = {
  compromise: <ScissorsIcon className="h-4 w-4" />,
  alternative: <ArrowRightIcon className="h-4 w-4" />,
  clarification: <MagnifyingGlassIcon className="h-4 w-4" />
};

const priorityColors = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
};

// Updated interface to match the actual data structure
interface PolicyRecommendationsProps {
  recommendations: {
    topPolicies?: string[];
    explanation?: string;
  };
}

export function PolicyRecommendations({ recommendations }: PolicyRecommendationsProps) {
  // Debug logging
  useEffect(() => {
    console.log('PolicyRecommendations rendered with data:', recommendations);
  }, [recommendations]);

  // Safety check for recommendations data
  if (!recommendations) {
    console.error('PolicyRecommendations: recommendations is null or undefined');
    return null;
  }

  const { topPolicies = [], explanation = 'Based on your priorities' } = recommendations;

  if (topPolicies.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback {...props} componentName="PolicyRecommendations" />
      )}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <SunIcon className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold">Policy Recommendations</h2>
        </div>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle>Top Policy Priorities</CardTitle>
            <CardDescription>{explanation}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPolicies.map((policy, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge className="mt-0.5" variant="secondary">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{policy}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
