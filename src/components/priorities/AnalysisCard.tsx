import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConflictResult, MappedPriority } from '@/types/policy-mappings';

interface AnalysisCardProps {
  analysis: {
    summary: string;
    priorities: string[];
    conflicts: ConflictResult[];
  };
  mappedPriorities: MappedPriority[];
}

export function AnalysisCard({ analysis, mappedPriorities }: AnalysisCardProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="font-medium mb-2">Priority Analysis</h3>
          <p className="text-sm text-gray-600">{analysis.summary}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Your Priorities</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.priorities.map((priority, index) => (
              <Badge key={index} variant="secondary">
                {priority}
              </Badge>
            ))}
          </div>
        </div>

        {mappedPriorities.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Mapped Terms</h4>
            <div className="space-y-2">
              {mappedPriorities.map((mapping, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline">
                    {mapping.original}
                  </Badge>
                  <span className="text-gray-400">→</span>
                  <div className="flex flex-wrap gap-1">
                    <Badge 
                      variant={mapping.sentiment === 'positive' ? 'default' : 'destructive'} 
                      className="text-xs"
                    >
                      {mapping.mappedTerm}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {mapping.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.conflicts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-destructive">Potential Conflicts</h4>
            <div className="space-y-2">
              {analysis.conflicts.map((conflict, index) => (
                <div key={index} className="text-sm text-destructive-foreground">
                  <span className="font-medium">
                    {conflict.priorities.join(' & ')}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    ({conflict.reason})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
