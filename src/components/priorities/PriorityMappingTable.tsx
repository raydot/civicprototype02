import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
import {
  PPMEMappedPriority,
  PPMEFeedback,
  getConfidenceLevel,
  getConfidenceColor,
  getConfidenceBgColor,
} from '@/types/ppme'
import { cn } from '@/lib/utils'

interface PriorityMappingTableProps {
  mappedPriorities: PPMEMappedPriority[]
  onUpdatePriorities: (updatedPriorities: string[]) => void
  onSubmitFeedback?: (feedback: PPMEFeedback) => void
  onGetClarification?: (priority: string) => void
  isUpdating?: boolean
}

export function PriorityMappingTable({
  mappedPriorities,
  onUpdatePriorities,
  onSubmitFeedback,
  onGetClarification,
  isUpdating = false,
}: PriorityMappingTableProps) {
  const [editedPriorities, setEditedPriorities] = useState<string[]>([])
  const [reorderedMappedPriorities, setReorderedMappedPriorities] = useState<
    PPMEMappedPriority[]
  >([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedIndices, setEditedIndices] = useState<Set<number>>(new Set())
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<Set<string>>(
    new Set()
  )

  // Initialize edited priorities and reordered mapped priorities
  useEffect(() => {
    if (mappedPriorities.length > 0) {
      setEditedPriorities(mappedPriorities.map(p => p.original))
      setReorderedMappedPriorities([...mappedPriorities])
    }
  }, [mappedPriorities])

  const handleEditPriority = (index: number, newValue: string) => {
    const newEditedPriorities = [...editedPriorities]
    newEditedPriorities[index] = newValue
    setEditedPriorities(newEditedPriorities)
    
    const originalValue = mappedPriorities[index]?.original
    if (newValue !== originalValue) {
      setEditedIndices(prev => new Set(prev).add(index))
      setIsEditing(true)
    } else {
      setEditedIndices(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
    }
  }

  const handleUpdatePriorities = () => {
    onUpdatePriorities(editedPriorities)
    setIsEditing(false)
    setEditedIndices(new Set())
  }




  // Render enhanced confidence indicator with icons
  const renderConfidenceIndicator = (confidence: number) => {
    const level = getConfidenceLevel(confidence)
    const percentage = Math.round(confidence * 100)

    // Enhanced confidence styling
    const getConfidenceIcon = () => {
      if (confidence >= 0.8)
        return <CheckCircle className="h-3 w-3 text-green-600" />
      if (confidence >= 0.6)
        return <AlertTriangle className="h-3 w-3 text-yellow-600" />
      return <XCircle className="h-3 w-3 text-red-600" />
    }

    const getConfidenceStyles = () => {
      if (confidence >= 0.8)
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          progress: 'bg-green-500',
          text: 'text-green-700',
        }
      if (confidence >= 0.6)
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          progress: 'bg-yellow-500',
          text: 'text-yellow-700',
        }
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        progress: 'bg-red-500',
        text: 'text-red-700',
      }
    }

    const styles = getConfidenceStyles()

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          {getConfidenceIcon()}
          <span className={cn('text-xs font-medium', styles.text)}>
            {level.toUpperCase()}
          </span>
        </div>
        <div
          className={cn(
            'w-full h-2 rounded-full border',
            styles.bg,
            styles.border
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              styles.progress
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className={cn('text-xs text-center font-mono', styles.text)}>
          {percentage}%
        </div>
      </div>
    )
  }


  // Handle feedback submission
  const handleFeedback = (
    priority: PPMEMappedPriority,
    feedbackType: 'thumbs_up' | 'thumbs_down'
  ) => {
    if (!onSubmitFeedback) return

    const feedback: PPMEFeedback = {
      originalPriority: priority.original,
      selectedTermId: priority.termId,
      feedbackType,
      confidence: priority.confidence,
      timestamp: new Date().toISOString(),
    }

    onSubmitFeedback(feedback)
    setFeedbackSubmitted(prev => new Set(prev).add(priority.original))
  }

  // Handle clarification request
  const handleClarification = (priority: PPMEMappedPriority) => {
    if (!onGetClarification) return
    onGetClarification(priority.original)
  }

  // Individual Priority Card Component
  const PriorityCard = ({
    priority,
    index,
  }: {
    priority: PPMEMappedPriority
    index: number
  }) => {
    const hasSubmittedFeedback = feedbackSubmitted.has(priority.original)
    const hasBeenEdited = editedIndices.has(index)

    return (
      <Card className="w-full shadow-md border-2 border-gray-200 rounded-lg bg-white">
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {/* Row 1: Priority # and Editable Input */}
              <TableRow className="border-b border-gray-100">
                <TableCell className="py-3 px-4 font-medium text-sm w-1/3 align-middle">
                  Priority #{index + 1}
                </TableCell>
                <TableCell className="py-3 px-4 align-middle">
                  <div className="space-y-2">
                    <Textarea
                      value={editedPriorities[index] || priority.original}
                      onChange={(e) => handleEditPriority(index, e.target.value)}
                      className="w-full min-h-[2rem] text-sm resize-none"
                      placeholder="Describe your priority..."
                      rows={2}
                    />
                    {hasBeenEdited && (
                      <Button
                        size="sm"
                        onClick={handleUpdatePriorities}
                        disabled={isUpdating}
                        className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                      >
                        {isUpdating ? 'Updating...' : 'Update This Priority'}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>

              {/* Row 2: Policy Term with Help Icon */}
              <TableRow className="border-b border-gray-100">
                <TableCell className="py-3 px-4 font-medium text-sm align-middle">
                  Policy Term
                </TableCell>
                <TableCell className="py-3 px-4 align-middle">
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-sm text-gray-900 flex-1">
                      {priority.standardTerm}
                    </div>
                    {priority.needsClarification && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 ml-2"
                        onClick={() => handleClarification(priority)}
                        title="See suggested terms"
                      >
                        <HelpCircle className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>

              {/* Row 3: Why This Match */}
              <TableRow className="border-b border-gray-100">
                <TableCell className="py-3 px-4 font-medium text-sm align-middle">
                  Why This Match
                </TableCell>
                <TableCell className="py-3 px-4 align-middle">
                  {priority.reasoning && (
                    <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                      {priority.reasoning}
                    </div>
                  )}
                </TableCell>
              </TableRow>

              {/* Row 4: Match Quality - User Feedback for Reinforcement Learning */}
              <TableRow>
                <TableCell className="py-3 px-4 font-medium text-sm align-middle">
                  Match Quality
                </TableCell>
                <TableCell className="py-3 px-4 align-middle">
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">
                      Do you agree with this match?
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={hasSubmittedFeedback ? "secondary" : "outline"}
                        className="h-8 px-3 text-xs"
                        onClick={() => handleFeedback(priority, 'thumbs_up')}
                        disabled={hasSubmittedFeedback}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Agree
                      </Button>
                      <Button
                        size="sm"
                        variant={hasSubmittedFeedback ? "secondary" : "outline"}
                        className="h-8 px-3 text-xs"
                        onClick={() => handleFeedback(priority, 'thumbs_down')}
                        disabled={hasSubmittedFeedback}
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Disagree
                      </Button>
                      {hasSubmittedFeedback && (
                        <span className="text-xs text-green-600 ml-2">
                          ✓ Feedback submitted
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {reorderedMappedPriorities.map((priority, index) => (
        <PriorityCard
          key={`priority-card-${index}`}
          priority={priority}
          index={index}
        />
      ))}

      {isEditing && (
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Changes will trigger re-analysis of your priorities
          </div>
          <Button
            onClick={handleUpdatePriorities}
            disabled={isUpdating}
            size="sm"
            className="h-8 text-xs"
          >
            {isUpdating ? 'Updating...' : 'Update Mapping'}
          </Button>
        </div>
      )}

      {reorderedMappedPriorities.some(p => p.needsClarification) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">
              Some priorities need clarification
            </span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Items marked with ⚠️ have low confidence mappings. Use the help
            button to see alternative options.
          </p>
        </div>
      )}
    </div>
  )
}
