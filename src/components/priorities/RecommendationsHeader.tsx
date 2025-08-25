import { ShareRecommendations } from '@/components/ShareRecommendations';
import { RecommendationsData } from '@/types/api';
import { useMode } from '@/contexts/ModeContext';

export interface RecommendationsHeaderProps {
  recommendationsData: RecommendationsData;
  onRemovePriority: (priority: string) => void;
  sectionTitle?: string; 
}

export const RecommendationsHeader = ({
  recommendationsData,
  onRemovePriority,
  sectionTitle
}: RecommendationsHeaderProps) => {
  const { mode } = useMode();
  const isDemo = mode === 'demo';

  const showTitle = sectionTitle !== undefined;

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-left">{sectionTitle}</h2>
          <ShareRecommendations
            recommendationsData={recommendationsData}
          />
        </div>
      )}
      
      <div className="text-left space-y-2">
        {isDemo ? (
          <p className="text-muted-foreground text-base">
            Here are your personalized recommendations for the November 2024 election
            in ZIP code {recommendationsData.zipCode}.
          </p>
        ) : (
          <p className="text-muted-foreground text-base">
            Based on your priorities, here are the elected officials, candidates, and civic actions that most closely match your concerns.
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">{recommendationsData.city}, {recommendationsData.state}</span>
          <span className="text-muted-foreground ml-2">{recommendationsData.zipCode}</span>
        </p>
        
      </div>
    </div>
  );
};
