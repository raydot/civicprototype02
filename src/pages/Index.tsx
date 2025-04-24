import Navbar from '../components/Navbar';
import { VoterFormContainer } from '@/components/VoterFormContainer';
import { useState } from 'react';
import { VoterFormValues } from '@/schemas/voterFormSchema';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RecommendationsData, Recommendations } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { useMode } from '@/contexts/ModeContext';
import { DebugPanel } from '@/components/DebugPanel';
import { Bug } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const { toast } = useToast();
  const { mode } = useMode();
  
  const handleSubmit = async (values: VoterFormValues) => {
    setIsLoading(true);
    
    try {
      // Log form submission for debugging
      const formSubmissionLog = JSON.parse(localStorage.getItem('formSubmissionLog') || '[]');
      formSubmissionLog.push({
        timestamp: new Date().toISOString(),
        values
      });
      localStorage.setItem('formSubmissionLog', JSON.stringify(formSubmissionLog.slice(-10))); // Keep last 10 submissions
      
      // Filter out empty priorities
      const filteredPriorities = values.priorities?.filter(p => p?.trim()) || [];
      
      if (filteredPriorities.length === 0) {
        toast({
          title: "No Priorities",
          description: "Please enter at least one priority to get recommendations.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      console.log("Form submitted with values:", values);
      
      // Create hardcoded demo recommendations
      const demoRecommendations: Recommendations = {
        candidates: [
          {
            name: "Tanya Nguyen",
            office: "President",
            party: "Independent",
            positionSummary: "Supports tax relief, opposes DEI mandates, funds AI literacy in schools",
            platformHighlights: [
              "Tax relief for middle-class families",
              "Opposes DEI mandates in public institutions",
              "Supports AI literacy programs in schools"
            ],
            rationale: "Aligns with your priorities on tax reform and education",
            officialWebsite: "https://example.com/tanya-nguyen",
            alignment: "✅"
          },
          {
            name: "Marcos Vidal",
            office: "President",
            party: "Republican",
            positionSummary: "Favors tech transparency, moderate on transit expansion, neutral on DEI",
            platformHighlights: [
              "Transparency in government AI use",
              "Moderate support for transit expansion",
              "Neutral stance on DEI initiatives"
            ],
            rationale: "Aligns with your priorities on government transparency",
            officialWebsite: "https://example.com/marcos-vidal",
            alignment: "✅"
          },
          {
            name: "Anya Bellamy",
            office: "President",
            party: "Democrat",
            positionSummary: "Transit-focused, supports green infrastructure, neutral on Jan 6 issues",
            platformHighlights: [
              "Expansion of public transit systems",
              "Investment in green infrastructure",
              "Neutral stance on January 6 related issues"
            ],
            rationale: "Partially aligns with your priorities on transportation",
            officialWebsite: "https://example.com/anya-bellamy",
            alignment: "⚠️"
          },
          {
            name: "Robert Chen",
            office: "Senator",
            party: "Independent",
            positionSummary: "Supports free speech protections, climate research funding, and religious liberty",
            platformHighlights: [
              "Strong free speech protections",
              "Increased funding for climate research",
              "Protecting religious liberty"
            ],
            rationale: "Aligns with your priorities on free expression and climate policy",
            officialWebsite: "https://example.com/robert-chen",
            alignment: "✅"
          }
        ],
        ballotMeasures: [
          {
            title: "Prop 204",
            description: "Adds 0.25% sales tax for expanded rural bus service",
            supporters: ["Transit Advocates Coalition", "Rural Communities Alliance"],
            opposers: ["Taxpayers Association", "Small Business Federation"],
            userConcernMapping: "This measure relates to your interest in public transportation",
            ballotpediaLink: "https://ballotpedia.org/example/prop204"
          }
        ],
        policyRecommendations: {
          topPolicies: filteredPriorities,
          explanation: "These recommendations are based on your stated priorities."
        },
        emailDrafts: [],
        interestGroups: [],
        petitions: [],
        educationResources: []
      };
      
      // Create data object
      const prioritiesData: RecommendationsData = {
        mode: values.mode || mode,
        zipCode: values.zipCode || '',
        region: 'United States',
        analysis: {
          priorities: filteredPriorities,
          conflicts: [],
          mappedPriorities: filteredPriorities.map(p => ({
            original: p,
            category: 'Other',
            mappedTerms: [p],
            sentiment: 'neutral',
            confidence: 0.5
          }))
        },
        recommendations: demoRecommendations
      };
      
      console.log("Setting recommendations data:", prioritiesData);
      
      // Set the recommendations
      setRecommendations(prioritiesData);
      
      toast({
        title: "Analysis Complete",
        description: "Your priorities have been analyzed and recommendations are ready.",
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your priorities.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback {...props} componentName="IndexPage" />
      )}
    >
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Voter Priorities Tool</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowDebugPanel(!showDebugPanel)}
                className="relative"
                title="Toggle Debug Panel"
              >
                <Bug className="h-4 w-4" />
              </Button>
              <Link to="/test/mapping">
                <Button variant="outline" className="flex items-center gap-2">
                  Test Priority Mapping
                </Button>
              </Link>
            </div>
          </div>
          
          {showDebugPanel && (
            <div className="mb-6">
              <DebugPanel onClose={() => setShowDebugPanel(false)} />
            </div>
          )}
          
          <div className="space-y-8">
            <VoterFormContainer
              onSubmit={handleSubmit}
              isLoading={isLoading}
              recommendations={recommendations}
            />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
