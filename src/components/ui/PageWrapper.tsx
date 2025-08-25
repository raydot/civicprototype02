import React from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/ErrorFallback'

interface PageWrapperProps {
  children: React.ReactNode
  componentName: string
  className?: string
}

export function PageWrapper({ children, componentName, className = "space-y-4" }: PageWrapperProps) {
  return (
    <div className={className}>
      <ReactErrorBoundary
        FallbackComponent={props => (
          <ErrorFallback {...props} componentName={componentName} />
        )}
        onReset={() => {
          console.log(`${componentName} error boundary reset`)
        }}
      >
        {children}
      </ReactErrorBoundary>
    </div>
  )
}
