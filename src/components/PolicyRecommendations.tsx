import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PolicyRecommendation } from '@/utils/policyRecommendations';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon, MagnifyingGlassIcon, SunIcon, ScissorsIcon } from '@radix-ui/react-icons';

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

interface PolicyRecommendationsProps {
  recommendations: PolicyRecommendation[];
}

export function PolicyRecommendations({ recommendations }: PolicyRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SunIcon className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Policy Recommendations</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((recommendation, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              {typeIcons[recommendation.type]}
            </div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={priorityColors[recommendation.priority]}
                >
                  {recommendation.priority}
                </Badge>
                <Badge variant="outline">{recommendation.type}</Badge>
              </div>
              <CardTitle className="mt-2">{recommendation.title}</CardTitle>
              <CardDescription>{recommendation.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendation.suggestedActions && (
                <div className="space-y-2">
                  <h4 className="font-medium">Suggested Actions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {recommendation.suggestedActions.map((action, actionIndex) => (
                      <li key={actionIndex}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Related Priorities:</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {recommendation.relatedPriorities.map((priority, priorityIndex) => (
                    <Badge key={priorityIndex} variant="outline" className="text-xs">
                      {priority}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
