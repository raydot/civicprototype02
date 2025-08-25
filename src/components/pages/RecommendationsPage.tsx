import { RecommendationsData } from '@/types/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/ErrorFallback'
import { RecommendationsViewer } from '@/components/priorities/RecommendationsViewer'

interface RecommendationsPageProps {
  recommendations: any
  mode?: 'current' | 'demo'
  onUpdatePriorities?: (priorities: string[]) => void
  isUpdating?: boolean
}

export const RecommendationsPage = ({
  recommendations,
  mode = 'demo',
  onUpdatePriorities,
  isUpdating = false
}: RecommendationsPageProps) => {
  return (
    <div className="space-y-4">
      <ReactErrorBoundary
        FallbackComponent={props => (
          <ErrorFallback {...props} componentName="RecommendationsPage" />
        )}
        onReset={() => {
          console.log('RecommendationsPage error boundary reset')
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
              mode={mode}
              onUpdatePriorities={onUpdatePriorities}
              isUpdating={isUpdating}
            />
          </CardContent>
        </Card>
      </ReactErrorBoundary>
    </div>
  )
}
