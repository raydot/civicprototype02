import { RecommendationsData } from '@/types/api'
import { RecommendationsViewer } from '@/components/priorities/RecommendationsViewer'
import { PageWrapper } from '@/components/ui/PageWrapper'

interface RecommendationsPageProps {
  recommendations: RecommendationsData
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
    <PageWrapper componentName="RecommendationsPage">
      <RecommendationsViewer
        recommendations={recommendations}
        mode={mode}
        onUpdatePriorities={onUpdatePriorities}
        isUpdating={isUpdating}
      />
    </PageWrapper>
  )
}
