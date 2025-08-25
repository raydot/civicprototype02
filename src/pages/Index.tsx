import { useState } from 'react'
import { VoterFormValues } from '@/schemas/voterFormSchema'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { RecommendationsData } from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import { useMode } from '@/contexts/ModeContext'
import { DebugPanel } from '@/components/DebugPanel'
import { Bug } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/ErrorFallback'
import { useDebugMode } from '@/utils/debugMode'
import { createDemoRecommendations } from '@/data/demo_recs_hardcoded'
import { SplashScreen } from '@/components/SplashScreen'
import { Header } from '@/components/Header'
import { VoterForm } from '@/components/VoterForm'

type CurrentScreen = 'splash' | 'form' | 'results'

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('splash')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] =
    useState<RecommendationsData | null>(null)
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const { toast } = useToast()
  const { mode } = useMode()
  const { isEnabled: isDebugEnabled } = useDebugMode()

  const handleSubmit = async (values: VoterFormValues) => {
    setIsLoading(true)

    try {
      // Log form submission for debugging
      const formSubmissionLog = JSON.parse(
        localStorage.getItem('formSubmissionLog') || '[]'
      )
      formSubmissionLog.push({
        timestamp: new Date().toISOString(),
        values,
      })
      localStorage.setItem(
        'formSubmissionLog',
        JSON.stringify(formSubmissionLog.slice(-10))
      ) // Keep last 10 submissions

      // Filter out empty priorities
      const filteredPriorities = values.priorities?.filter(p => p?.trim()) || []

      if (filteredPriorities.length === 0) {
        toast({
          title: 'No Priorities',
          description:
            'Please enter at least one priority to get recommendations.',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      console.log('Form submitted with values:', values)

      // Create hardcoded demo recommendations
      const demoRecommendations = createDemoRecommendations(filteredPriorities)

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
            confidence: 0.5,
          })),
        },
        recommendations: demoRecommendations,
      }

      console.log('Setting recommendations data:', prioritiesData)

      // Set the recommendations and switch to results screen
      setRecommendations(prioritiesData)
      setCurrentScreen('results')

      toast({
        title: 'Analysis Complete',
        description:
          'Your priorities have been analyzed and recommendations are ready.',
      })
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast({
        title: 'Error',
        description: 'There was a problem processing your priorities.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen onGetStarted={() => setCurrentScreen('form')} />
        )
      case 'form':
        return (
          <>
            <Header />
            <div className="p-4">
              <VoterForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
              
              {/* Debug Panel - positioned near bottom */}
              {isDebugEnabled && (
                <div className="mt-6">
                  <div className="flex gap-2 mb-4">
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
                  
                  {showDebugPanel && (
                    <DebugPanel onClose={() => setShowDebugPanel(false)} />
                  )}
                </div>
              )}
            </div>
          </>
        )
      case 'results':
        return (
          <>
            <Header />
            <div className="p-4">
              {/* Results display - will be implemented later */}
              <div className="text-center py-8">
                <h2 className="text-xl font-bold mb-4">Results</h2>
                <p>Recommendations will be displayed here</p>
                <Button 
                  onClick={() => setCurrentScreen('form')}
                  className="mt-4"
                >
                  Back to Form
                </Button>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <ErrorBoundary
      FallbackComponent={props => (
        <ErrorFallback {...props} componentName="IndexPage" />
      )}
    >
      <div className="min-h-screen bg-white max-w-md mx-auto">
        {renderCurrentScreen()}
      </div>
    </ErrorBoundary>
  )
}

export default Index
