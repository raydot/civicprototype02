import { useState, useEffect } from 'react'
import { VoterFormValues } from '@/schemas/voterFormSchema'
import { RecommendationsData } from '@/types/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { MapPin } from 'lucide-react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/ErrorFallback'
import { PriorityMappingTable } from '@/components/priorities/PriorityMappingTable'
import { usePPMEMapping } from '@/hooks/use-ppme-mapping'
import { PPMEFeedback } from '@/types/ppme'

interface ResultsPageProps {
  formData: VoterFormValues
  onGetRecommendations: (data: VoterFormValues) => void
  isLoading?: boolean
}

export const ResultsPage = ({
  formData,
  onGetRecommendations,
  isLoading = false,
}: ResultsPageProps) => {
  const { toast } = useToast()

  // Helper function to generate placeholder location data
  const getLocationDisplay = (zipCode: string) => {
    // Placeholder data - will be replaced with actual lookup
    const placeholderLocations: Record<
      string,
      { city: string; state: string }
    > = {
      '94102': { city: 'San Francisco', state: 'California' },
      '10001': { city: 'New York', state: 'New York' },
      '90210': { city: 'Beverly Hills', state: 'California' },
      '02101': { city: 'Boston', state: 'Massachusetts' },
      '60601': { city: 'Chicago', state: 'Illinois' },
    }

    return (
      placeholderLocations[zipCode] || {
        city: 'Anytown',
        state: 'Nebraska',
      }
    )
  }

  // PPME integration
  const {
    mappingData,
    isLoading: isPPMELoading,
    error: ppmeError,
    mapPriorities,
    submitFeedback,
    getClarification,
    clearError,
  } = usePPMEMapping()

  // Initialize PPME mapping when component mounts
  useEffect(() => {
    if (formData.priorities && formData.zipCode) {
      const filteredPriorities = formData.priorities.filter(p => p?.trim())
      if (filteredPriorities.length > 0) {
        mapPriorities({
          priorities: filteredPriorities,
          zipCode: formData.zipCode,
          mode: formData.mode || 'demo',
        })
      }
    }
  }, [formData, mapPriorities])

  // Handle PPME errors
  useEffect(() => {
    if (ppmeError) {
      toast({
        title: 'Mapping Error',
        description: ppmeError,
        variant: 'destructive',
      })
      clearError()
    }
  }, [ppmeError, toast, clearError])

  // Show mapping results when PPME data is available
  useEffect(() => {
    if (mappingData?.mappedPriorities?.length > 0) {
      // Show confidence summary
      const avgConfidence = Math.round(mappingData.overallConfidence * 100)
      const needsClarification = mappingData.needsClarification.length

      toast({
        title: 'Priorities Mapped',
        description: `Mapping completed with ${avgConfidence}% average confidence${needsClarification > 0 ? `. ${needsClarification} items need clarification.` : '.'}`,
      })
    }
  }, [mappingData, toast])

  const handleUpdatePriorities = async (updatedPriorities: string[]) => {
    // Re-map priorities using PPME
    await mapPriorities({
      priorities: updatedPriorities,
      zipCode: formData.zipCode,
      mode: formData.mode || 'demo',
    })
  }

  const handleSubmitFeedback = async (feedback: PPMEFeedback) => {
    await submitFeedback(feedback)
    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for helping improve our mapping system!',
    })
  }

  const handleGetClarification = async (priority: string) => {
    await getClarification(priority)
    toast({
      title: 'Getting Clarification',
      description: 'Loading alternative mapping options...',
    })
  }

  const handleGetRecommendations = () => {
    if (!mappingData?.mappedPriorities) {
      toast({
        title: 'No Mapping Data',
        description: 'Please wait for priority mapping to complete.',
        variant: 'destructive',
      })
      return
    }

    // Convert PPME data back to original format for recommendations
    const updatedFormData: VoterFormValues = {
      ...formData,
      priorities: mappingData.mappedPriorities.map(p => p.original),
    }

    onGetRecommendations(updatedFormData)
  }

  return (
    <div className="relative space-y-4">
        {(isLoading || isPPMELoading) && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4 mx-auto"></div>
              <p className="text-muted-foreground">
                Analyzing your priorities...
              </p>
            </div>
          </div>
        )}

        <ReactErrorBoundary
          FallbackComponent={props => (
            <ErrorFallback {...props} componentName="ResultsPage" />
          )}
          onReset={() => {
            console.log('ResultsPage error boundary reset')
          }}
        >
          {/* Location Display */}
          <Card className="w-full shadow-sm">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="font-medium">
                    {getLocationDisplay(formData.zipCode || '').city},{' '}
                    {getLocationDisplay(formData.zipCode || '').state}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {formData.zipCode}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PPME Priority Mapping Table */}
          {mappingData?.mappedPriorities && (
            <Card className="w-full shadow-sm">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">Priorities Mapping</CardTitle>
                <CardDescription className="mt-1 text-sm">
                  We have mapped your priorities to policy terms using our
                  Political Priorities Mapping Engine. Review the mappings below
                  and provide feedback to help us improve!
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <PriorityMappingTable
                  mappedPriorities={mappingData.mappedPriorities}
                  onUpdatePriorities={handleUpdatePriorities}
                  onSubmitFeedback={handleSubmitFeedback}
                  onGetClarification={handleGetClarification}
                  isUpdating={isPPMELoading}
                />

                <div className="mt-4">
                  <Button
                    onClick={handleGetRecommendations}
                    className="w-full h-9 text-sm"
                    variant="default"
                    disabled={isPPMELoading}
                  >
                    {isPPMELoading ? 'Processing...' : 'Get Recommendations'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading state when no mapping data yet */}
          {!mappingData?.mappedPriorities && !isPPMELoading && (
            <Card className="w-full shadow-sm">
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">
                  No mapping data available. Please try submitting your
                  priorities again.
                </p>
              </CardContent>
            </Card>
          )}
        </ReactErrorBoundary>
    </div>
  )
}
