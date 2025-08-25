import { VoterForm } from '@/components/pages/VoterFormPage'
import { VoterFormValues } from '@/schemas/voterFormSchema'
import { RecommendationsData } from '@/types/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RecommendationsViewer } from '@/components/priorities/RecommendationsViewer'
import { useState, useEffect } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/ErrorFallback'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { PriorityMappingTable } from './priorities/PriorityMappingTable'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AutoFillMenu } from '@/components/AutoFillMenu'
import { usePPMEMapping } from '@/hooks/use-ppme-mapping'
import { PPMEMappedPriority, PPMEFeedback } from '@/types/ppme'
import { useDebugMode } from '@/utils/debugMode'

type ModeType = 'current' | 'demo'

interface VoterFormContainerProps {
  onSubmit: (values: VoterFormValues) => Promise<void>
  isLoading: boolean
  recommendations: RecommendationsData | null
  mode?: ModeType
}

// Schema for just the ZIP code
const ZipCodeSchema = z.object({
  zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be exactly 5 digits'),
})

type ZipCodeFormValues = z.infer<typeof ZipCodeSchema>

export const VoterFormContainer = ({
  onSubmit,
  isLoading,
  recommendations,
  mode = 'demo',
}: VoterFormContainerProps) => {
  const [selectedMode, setSelectedMode] = useState<ModeType>(mode)
  const [showMappingOnly, setShowMappingOnly] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const { toast } = useToast()

  // PPME integration
  const {
    mappingData,
    isLoading: isPPMELoading,
    error: ppmeError,
    mapPriorities,
    submitFeedback,
    getClarification,
    clearError,
    reset: resetPPME,
  } = usePPMEMapping()

  // Form for ZIP code
  const zipForm = useForm<ZipCodeFormValues>({
    resolver: zodResolver(ZipCodeSchema),
    defaultValues: {
      zipCode: recommendations?.zipCode || '',
    },
  })

  // Update ZIP form value when recommendations change
  useEffect(() => {
    if (recommendations?.zipCode) {
      zipForm.setValue('zipCode', recommendations.zipCode)
    }
  }, [recommendations?.zipCode, zipForm])

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
      setShowMappingOnly(true)
      setShowRecommendations(false)

      // Show confidence summary
      const avgConfidence = Math.round(mappingData.overallConfidence * 100)
      const needsClarification = mappingData.needsClarification.length

      toast({
        title: 'Priorities Mapped',
        description: `Mapping completed with ${avgConfidence}% average confidence${needsClarification > 0 ? `. ${needsClarification} items need clarification.` : '.'}`,
      })
    }
  }, [mappingData, toast])

  const handleModeChange = (value: ModeType) => {
    setSelectedMode(value)
    toast({
      title: `Mode changed to ${value === 'current' ? 'Current Date' : 'Election SIM Mode'}`,
      description: 'Your form has been updated with the new mode.',
    })
  }

  const handleUpdatePriorities = async (updatedPriorities: string[]) => {
    const currentZipCode = zipForm.getValues().zipCode

    // Re-map priorities using PPME
    await mapPriorities({
      priorities: updatedPriorities,
      zipCode: currentZipCode,
      mode: selectedMode,
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

  // In VoterFormContainer, create a validation wrapper
  const handleValidatedSubmit = async (values: any) => {
    // Validate ZIP code before proceeding
    const currentZipCode = zipForm.getValues().zipCode
    const zipValidation = ZipCodeSchema.safeParse({ zipCode: currentZipCode })

    if (!zipValidation.success) {
      toast({
        title: 'ZIP Code Required',
        description:
          'Please enter a valid 5-digit ZIP code before submitting your priorities.',
        variant: 'destructive',
      })
      return
    }

    // If ZIP code is valid, proceed with the original handleFormSubmit logic
    await handleFormSubmit(values)
  }

  const handleFormSubmit = async (values: any) => {
    console.log('Form submitted with values:', values)

    // Validate ZIP code before proceeding
    const currentZipCode = zipForm.getValues().zipCode
    const zipValidation = ZipCodeSchema.safeParse({ zipCode: currentZipCode })

    if (!zipValidation.success) {
      toast({
        title: 'ZIP Code Required',
        description:
          'Please enter a valid 5-digit ZIP code before submitting your priorities.',
        variant: 'destructive',
      })
      return
    }

    try {
      // Use PPME to map priorities first
      await mapPriorities({
        priorities: values.priorities.filter((p: string) => p.trim()),
        zipCode: currentZipCode,
        mode: selectedMode,
      })
    } catch (error) {
      console.error('Error in PPME mapping:', error)
      toast({
        title: 'Mapping Error',
        description: 'Failed to analyze your priorities. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleZipCodeSubmit = async (data: ZipCodeFormValues) => {
    // If we have priorities already, update them with the new ZIP code
    // but don't reset the priorities mapping table
    if (recommendations?.analysis?.priorities?.length) {
      await onSubmit({
        mode: selectedMode,
        zipCode: data.zipCode,
        priorities: recommendations.analysis.priorities,
      })
    }
  }

  const handleGetRecommendations = async () => {
    if (!mappingData?.mappedPriorities) {
      toast({
        title: 'No Mapping Data',
        description: 'Please submit your priorities first.',
        variant: 'destructive',
      })
      return
    }

    try {
      // Convert PPME data back to original format for recommendations
      const formValues: VoterFormValues = {
        mode: selectedMode,
        zipCode: zipForm.getValues().zipCode,
        priorities: mappingData.mappedPriorities.map(p => p.original),
      }

      setShowMappingOnly(false)
      setShowRecommendations(true)

      await onSubmit(formValues)

      toast({
        title: 'Generating recommendations',
        description:
          'Preparing your personalized recommendations based on your mapped priorities.',
      })
    } catch (error) {
      console.error('Error generating recommendations:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate recommendations. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleRandomZipCode = (zipCode: string) => {
    zipForm.setValue('zipCode', zipCode)
  }

  const handleAutoFill = (values: {
    zipCode: string
    priorities: string[]
  }) => {
    zipForm.setValue('zipCode', values.zipCode)
    // Auto-fill will trigger form submission which will use PPME mapping
    toast({
      title: 'Auto-filled!',
      description: 'Random ZIP and priorities set.',
    })
  }

  const { isEnabled: isDebugEnabled } = useDebugMode()

  return (
    <div className="relative space-y-4">
      {(isLoading || isPPMELoading) && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">
              Analyzing your priorities...
            </p>
          </div>
        </div>
      )}

      <ReactErrorBoundary
        FallbackComponent={props => (
          <ErrorFallback {...props} componentName="VoterFormContainer" />
        )}
        onReset={() => {
          // Reset form state if needed
          console.log('VoterFormContainer error boundary reset')
        }}
      >
        {!recommendations && (
          <Card className="w-full shadow-sm">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Mode Selection</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <RadioGroup
                value={selectedMode}
                onValueChange={handleModeChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current" id="current" />
                  <Label htmlFor="current" className="text-sm">
                    Current Date
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="demo" id="demo" />
                  <Label htmlFor="demo" className="text-sm">
                    Election SIM Mode
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {!recommendations && (
          <Card className="w-full shadow-sm">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">ZIP Code</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <Form {...zipForm}>
                <FormField
                  control={zipForm.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <Input placeholder="00000" className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </CardContent>
          </Card>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 8,
          }}
        >
          {isDebugEnabled && (
            <AutoFillMenu onSelect={handleAutoFill} mode={selectedMode} />
          )}
        </div>

        {!recommendations && (
          <ReactErrorBoundary
            FallbackComponent={props => (
              <ErrorFallback {...props} componentName="VoterForm" />
            )}
            onReset={() => {
              console.log('VoterForm error boundary reset')
            }}
          >
            <Card className="w-full shadow-sm">
              <CardHeader className="py-3 px-4">
                <CardTitle>Your Voting Priorities</CardTitle>
                <CardDescription className="text-sm">
                  Tell us what matters most to you, and we'll help match you
                  with candidates and measures that align with your values.
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <VoterForm
                  onSubmit={handleValidatedSubmit}
                  isLoading={isLoading}
                  onRandomZipCode={handleRandomZipCode}
                />
              </CardContent>
            </Card>
          </ReactErrorBoundary>
        )}

        {/* PPME Priority Mapping Table */}
        {mappingData?.mappedPriorities && showMappingOnly && (
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

        {/* Recommendations - Only visible after clicking "Get Recommendations" */}
        {recommendations && showRecommendations && (
          <ReactErrorBoundary
            FallbackComponent={props => (
              <ErrorFallback {...props} componentName="RecommendationsViewer" />
            )}
            onReset={() => {
              console.log('RecommendationsViewer error boundary reset')
            }}
          >
            <Card className="w-full shadow-sm">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">
                  Your Recommendations
                </CardTitle>
                <CardDescription className="text-sm">
                  Based on your priorities, here are your personalized
                  recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <RecommendationsViewer
                  recommendations={recommendations}
                  mode={selectedMode}
                  onUpdatePriorities={handleUpdatePriorities}
                  isUpdating={isPPMELoading}
                />
              </CardContent>
            </Card>
          </ReactErrorBoundary>
        )}
      </ReactErrorBoundary>
    </div>
  )
}
