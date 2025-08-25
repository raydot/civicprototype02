import {
  DashboardData,
  AlignmentLevel,
  CandidateRecommendation,
  BallotMeasure as BallotMeasureType,
  InterestGroup as InterestGroupType,
  Petition as PetitionType,
  CivicEducationResource,
} from '@/types/recommendations'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExternalLinkIcon, MailIcon, Share2Icon } from 'lucide-react'
import { Mode, useMode } from '@/contexts/ModeContext'
import {
  RecommendationsData,
  Candidate,
  BallotMeasure,
  InterestGroup,
  Petition,
} from '@/types/api'
import { RecommendationsList } from '@/components/RecommendationsList'
import { CandidateTable } from './CandidateTable'
import { BallotMeasuresTable } from './BallotMeasuresTable'
import { EmailSection } from './EmailSection'
import { ResourcesSection } from './ResourcesSection'
import { Share } from 'lucide-react'
import { PriorityMappingTable } from './PriorityMappingTable'
import { PolicyRecommendations } from '@/components/PolicyRecommendations'
import { RecommendationsHeader } from './RecommendationsHeader'
import { useState } from 'react'
import { usePrioritiesAnalysis } from '@/hooks/use-priorities-analysis'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/ErrorFallback'

interface RecommendationsViewerProps {
  recommendations: RecommendationsData
  mode?: Mode
  onShare?: () => void
  onUpdatePriorities?: (priorities: string[]) => void
  isUpdating?: boolean
}

const AlignmentBadge = ({ level }: { level: AlignmentLevel }) => {
  const variants = {
    '✅': 'default',
    '⚠️': 'secondary',
    '❌': 'destructive',
  } as const

  return (
    <Badge variant={variants[level]}>
      {level === '✅' ? 'High' : level === '⚠️' ? 'Medium' : 'Low'} Alignment
    </Badge>
  )
}

const CandidateCard = ({
  candidate,
}: {
  candidate: CandidateRecommendation
}) => (
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
          <a
            href={candidate.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            Official Website <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </CardContent>
  </Card>
)

export function RecommendationsViewer({
  recommendations,
  mode,
  onShare,
  onUpdatePriorities,
  isUpdating = false,
}: RecommendationsViewerProps) {
  const { mode: contextMode, hasUpcomingBallots } = useMode()
  const { isLoading: isAnalysisLoading } = usePrioritiesAnalysis()

  // Use mode from props if provided, otherwise use from context
  const activeMode = mode || contextMode

  if (!recommendations?.recommendations) return null

  const showElectionContent =
    activeMode === 'demo' || (activeMode === 'current' && hasUpcomingBallots)

  // Transform mapped priorities for the PriorityMappingTable
  const mappedPrioritiesForTable =
    recommendations.analysis?.mappedPriorities?.map(priority => ({
      original: priority.original,
      mappedTerms: priority.mappedTerms,
      category: priority.category,
      sentiment: priority.sentiment,
      confidence: priority.confidence,
      needsClarification: priority.needsClarification,
      possibleTopics: priority.possibleTopics,
    })) || []

  // Handle priority updates
  const handleUpdatePriorities = (updatedPriorities: string[]) => {
    if (onUpdatePriorities) {
      onUpdatePriorities(updatedPriorities)
    }
  }

  // Convert API types to component types
  const convertToCandidateRecommendation = (
    candidate: Candidate
  ): CandidateRecommendation => ({
    name: candidate.name,
    office: candidate.office || 'Unknown Office',
    summary: candidate.positionSummary || '',
    match:
      candidate.alignment === '✅'
        ? 'full'
        : candidate.alignment === '⚠️'
          ? 'partial'
          : 'conflict',
    platformHighlights: candidate.platformHighlights || [],
    rationale: candidate.rationale || '',
    officialWebsite: candidate.officialWebsite || '#',
    party: candidate.party || '',
  })

  const convertToBallotMeasure = (
    measure: BallotMeasure
  ): BallotMeasureType => ({
    id: measure.title.replace(/\s+/g, '-').toLowerCase(),
    title: measure.title,
    summary: measure.description,
    supporters: measure.supporters,
    opposers: measure.opposers,
    userConcernMapping: measure.userConcernMapping,
    ballotpediaLink: measure.ballotpediaLink,
  })

  const convertToInterestGroup = (group: InterestGroup): InterestGroupType => ({
    name: group.name,
    description: group.description,
    website: group.website || '#',
    priorities: [],
    relevance: '',
  })

  const convertToPetition = (petition: Petition): PetitionType => ({
    title: petition.title,
    description: petition.description,
    link: petition.changeOrgUrl || '#',
    relevantPriorities: [],
    signatures: 0,
  })

  const convertToEducationResource = (
    resource: any
  ): CivicEducationResource => ({
    title: resource.topic || '',
    description: resource.description,
    source: resource.source as any,
    link: resource.url || '#',
    topics: [],
    type: resource.type,
  })

  // Convert the data
  const candidates =
    recommendations.recommendations.candidates?.map(
      convertToCandidateRecommendation
    ) || []
  const ballotMeasures =
    recommendations.recommendations.ballotMeasures?.map(
      convertToBallotMeasure
    ) || []
  const interestGroups =
    recommendations.recommendations.interestGroups?.map(
      convertToInterestGroup
    ) || []
  const petitions =
    recommendations.recommendations.petitions?.map(convertToPetition) || []
  const educationResources =
    recommendations.recommendations.educationResources?.map(
      convertToEducationResource
    ) || []

  return (
    <div className="space-y-8">
      {/* Main Header - only show this one */}
      <RecommendationsHeader
        recommendationsData={recommendations}
        onRemovePriority={() => {}}
        sectionTitle="Your Recommendations"
      />

      {/* Top Policy Priorities List - first item below header */}
      {recommendations.recommendations?.policyRecommendations?.topPolicies &&
        recommendations.recommendations.policyRecommendations.topPolicies
          .length > 0 && (
          <div className="space-y-3">
            <div>Your top policy priorities:</div>
            {recommendations.recommendations.policyRecommendations.topPolicies.map(
              (policy, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-medium text-primary bg-primary/10 rounded-full mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-base font-medium">{policy}</p>
                </div>
              )
            )}
          </div>
        )}

      {/* Tabs for different recommendation types */}
      <Tabs defaultValue="candidates" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="ballot">Ballot Measures</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-4 pt-4">
          {showElectionContent && candidates && candidates.length > 0 ? (
            <ErrorBoundary
              FallbackComponent={props => (
                <ErrorFallback {...props} componentName="CandidateTable" />
              )}
              onReset={() => {
                console.log('CandidateTable error boundary reset')
              }}
            >
              <CandidateTable candidates={candidates} />
            </ErrorBoundary>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  No candidate recommendations available for your current
                  settings.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ballot" className="space-y-4 pt-4">
          {showElectionContent && ballotMeasures.length > 0 && (
            <ErrorBoundary
              FallbackComponent={props => (
                <ErrorFallback {...props} componentName="BallotMeasuresTable" />
              )}
              onReset={() => {
                console.log('BallotMeasuresTable error boundary reset')
              }}
            >
              <BallotMeasuresTable measures={ballotMeasures} />
            </ErrorBoundary>
          )}
          {(!showElectionContent || ballotMeasures.length === 0) && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  No ballot measure recommendations available for your current
                  settings.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4 pt-4">
          <ResourcesSection
            interestGroups={interestGroups}
            petitions={petitions}
            educationResources={educationResources}
          />
        </TabsContent>

        <TabsContent value="email" className="space-y-4 pt-4">
          <EmailSection recommendations={recommendations} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
