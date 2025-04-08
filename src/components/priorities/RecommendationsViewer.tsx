import { DashboardData, AlignmentLevel, CandidateRecommendation } from '@/types/recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLinkIcon, MailIcon, Share2Icon } from 'lucide-react';
import { Mode } from '@/contexts/ModeContext';
import { RecommendationsData } from '@/types/api';
import { RecommendationsList } from '@/components/RecommendationsList';
import { useMode } from "@/contexts/ModeContext";
import { CandidateTable } from "./CandidateTable";
import { BallotMeasuresTable } from "./BallotMeasuresTable";
import { EmailSection } from "./EmailSection";
import { ResourcesSection } from "./ResourcesSection";
import { Share } from "lucide-react";

interface RecommendationsViewerProps {
  recommendations: RecommendationsData;
  mode: Mode;
  onShare?: () => void;
}

const AlignmentBadge = ({ level }: { level: AlignmentLevel }) => {
  const variants = {
    '✅': 'default',
    '⚠️': 'secondary',
    '❌': 'destructive'
  } as const;

  return (
    <Badge variant={variants[level]}>
      {level === '✅' ? 'High' : level === '⚠️' ? 'Medium' : 'Low'} Alignment
    </Badge>
  );
};

const CandidateCard = ({ candidate }: { candidate: CandidateRecommendation }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg">{candidate.name}</CardTitle>
          <CardDescription>{candidate.office}</CardDescription>
        </div>
        <AlignmentBadge level={candidate.alignment} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Platform Highlights</h4>
          <ul className="list-disc pl-5 space-y-1">
            {candidate.platformHighlights.map((highlight, i) => (
              <li key={i}>{highlight}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Match Rationale</h4>
          <p className="text-sm text-muted-foreground">{candidate.rationale}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={candidate.officialWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            Official Website <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export function RecommendationsViewer({ 
  recommendations, 
  mode, 
  onShare 
}: RecommendationsViewerProps) {
  const { hasUpcomingBallots } = useMode();
  
  if (!recommendations?.recommendations) return null;

  const showElectionContent = mode === 'demo' || (mode === 'current' && hasUpcomingBallots);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Recommendations</h2>
          <p className="text-muted-foreground">
            {mode === 'current' 
              ? 'Current Election'
              : 'DEMO: November 2024'}
          </p>
        </div>
        {onShare && (
          <Button onClick={onShare} variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        )}
      </div>

      {/* Election Content */}
      {showElectionContent && (
        <div className="space-y-8">
          {/* Candidates */}
          {recommendations.recommendations.candidates && 
            Object.entries(recommendations.recommendations.candidates)
              .map(([office, candidates]) => (
                <CandidateTable
                  key={office}
                  office={office}
                  candidates={candidates}
                />
              ))}

          {/* Ballot Measures */}
          {recommendations.recommendations.ballotMeasures && 
            recommendations.recommendations.ballotMeasures.length > 0 && (
              <BallotMeasuresTable
                measures={recommendations.recommendations.ballotMeasures}
              />
            )}
        </div>
      )}

      {/* Always Show These Sections */}
      <EmailSection
        drafts={recommendations.recommendations.emailDrafts}
      />

      <ResourcesSection
        interestGroups={recommendations.recommendations.interestGroups}
        petitions={recommendations.recommendations.petitions}
        civicEducation={recommendations.recommendations.civicEducation}
      />

      {/* Recommendations List */}
      <RecommendationsList
        recommendations={recommendations.recommendations}
        mode={mode}
      />
    </div>
  );
}
