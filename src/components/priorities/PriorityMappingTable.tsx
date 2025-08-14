import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, ThumbsUp, ThumbsDown, HelpCircle, AlertCircle, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { PPMEMappedPriority, PPMEFeedback, getConfidenceLevel, getConfidenceColor, getConfidenceBgColor } from '@/types/ppme';
import { cn } from '@/lib/utils';

interface PriorityMappingTableProps {
  mappedPriorities: PPMEMappedPriority[];
  onUpdatePriorities: (updatedPriorities: string[]) => void;
  onSubmitFeedback?: (feedback: PPMEFeedback) => void;
  onGetClarification?: (priority: string) => void;
  isUpdating?: boolean;
}

export function PriorityMappingTable({ 
  mappedPriorities, 
  onUpdatePriorities,
  onSubmitFeedback,
  onGetClarification,
  isUpdating = false
}: PriorityMappingTableProps) {
  const [editedPriorities, setEditedPriorities] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<Set<string>>(new Set());

  // Initialize edited priorities from the mapped priorities
  useEffect(() => {
    if (mappedPriorities.length > 0 && editedPriorities.length === 0) {
      // Use the original field as the user's priority
      setEditedPriorities(mappedPriorities.map(p => p.original));
    }
  }, [mappedPriorities, editedPriorities.length]);

  const handleEditPriority = (index: number, newValue: string) => {
    const newEditedPriorities = [...editedPriorities];
    newEditedPriorities[index] = newValue;
    setEditedPriorities(newEditedPriorities);
    setIsEditing(true);
  };

  const handleUpdatePriorities = () => {
    onUpdatePriorities(editedPriorities);
    setIsEditing(false);
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(editedPriorities);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setEditedPriorities(items);
    setIsEditing(true);
  };

  // Handle feedback submission
  const handleFeedback = (priority: PPMEMappedPriority, feedbackType: 'thumbs_up' | 'thumbs_down') => {
    if (!onSubmitFeedback) return;
    
    const feedback: PPMEFeedback = {
      originalPriority: priority.original,
      selectedTermId: priority.termId,
      feedbackType,
      confidence: priority.confidence,
      timestamp: new Date().toISOString()
    };
    
    onSubmitFeedback(feedback);
    setFeedbackSubmitted(prev => new Set(prev).add(priority.original));
  };

  // Handle clarification request
  const handleClarification = (priority: PPMEMappedPriority) => {
    if (!onGetClarification) return;
    onGetClarification(priority.original);
  };

  // Render enhanced confidence indicator with icons
  const renderConfidenceIndicator = (confidence: number) => {
    const level = getConfidenceLevel(confidence);
    const percentage = Math.round(confidence * 100);
    
    // Enhanced confidence styling
    const getConfidenceIcon = () => {
      if (confidence >= 0.8) return <CheckCircle className="h-3 w-3 text-green-600" />;
      if (confidence >= 0.6) return <AlertTriangle className="h-3 w-3 text-yellow-600" />;
      return <XCircle className="h-3 w-3 text-red-600" />;
    };
    
    const getConfidenceStyles = () => {
      if (confidence >= 0.8) return {
        bg: "bg-green-50",
        border: "border-green-200",
        progress: "bg-green-500",
        text: "text-green-700"
      };
      if (confidence >= 0.6) return {
        bg: "bg-yellow-50", 
        border: "border-yellow-200",
        progress: "bg-yellow-500",
        text: "text-yellow-700"
      };
      return {
        bg: "bg-red-50",
        border: "border-red-200", 
        progress: "bg-red-500",
        text: "text-red-700"
      };
    };
    
    const styles = getConfidenceStyles();
    
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          {getConfidenceIcon()}
          <span className={cn("text-xs font-medium", styles.text)}>
            {level.toUpperCase()}
          </span>
        </div>
        <div className={cn(
          "w-full h-2 rounded-full border",
          styles.bg, styles.border
        )}>
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              styles.progress
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className={cn("text-xs text-center font-mono", styles.text)}>
          {percentage}%
        </div>
      </div>
    );
  };

  // Enhanced mapping display with better structure
  const renderMappingDisplay = (priority: PPMEMappedPriority) => {
    const confidenceStyles = priority.confidence >= 0.8 ? 
      "border-green-200 bg-green-50" : 
      priority.confidence >= 0.6 ? 
      "border-yellow-200 bg-yellow-50" : 
      "border-red-200 bg-red-50";
    
    return (
      <div className={cn(
        "space-y-2 p-2 rounded-md border transition-all duration-200",
        confidenceStyles
      )}>
        {/* Standard Policy Term */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Policy Term
          </div>
          <div className="font-semibold text-sm text-gray-900">
            {priority.standardTerm}
          </div>
        </div>
        
        {/* Plain English Explanation */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            What This Means
          </div>
          <div className="text-sm text-gray-700 leading-relaxed">
            {priority.plainEnglish}
          </div>
        </div>
        
        {/* Reasoning (if available) */}
        {priority.reasoning && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Why This Match
            </div>
            <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
              {priority.reasoning}
            </div>
          </div>
        )}
        
        {/* Term ID for debugging in dev mode */}
        {process.env.NODE_ENV === 'development' && priority.termId && (
          <div className="text-xs text-gray-400 font-mono">
            ID: {priority.termId}
          </div>
        )}
      </div>
    );
  };

  // Render feedback buttons
  const renderFeedbackButtons = (priority: PPMEMappedPriority) => {
    const hasSubmittedFeedback = feedbackSubmitted.has(priority.original);
    
    return (
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={() => handleFeedback(priority, 'thumbs_up')}
          disabled={hasSubmittedFeedback}
        >
          <ThumbsUp className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={() => handleFeedback(priority, 'thumbs_down')}
          disabled={hasSubmittedFeedback}
        >
          <ThumbsDown className="h-3 w-3" />
        </Button>
        {priority.needsClarification && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => handleClarification(priority)}
          >
            <HelpCircle className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="priorities-table">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="border rounded-md overflow-hidden"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="w-1/4 py-2 text-xs font-medium">Your Priority</TableHead>
                    <TableHead className="w-2/5 py-2 text-xs font-medium">Policy Mapping</TableHead>
                    <TableHead className="w-24 py-2 text-xs font-medium text-center">Match Quality</TableHead>
                    <TableHead className="w-20 py-2 text-xs font-medium text-center">Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappedPriorities.map((priority, index) => (
                    <Draggable
                      key={`priority-row-${index}`}
                      draggableId={`priority-row-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "hover:bg-muted/30 transition-colors duration-200",
                            priority.needsClarification && "bg-yellow-50 border-l-4 border-l-yellow-400",
                            priority.confidence >= 0.8 && "border-l-2 border-l-green-300",
                            priority.confidence < 0.6 && "border-l-2 border-l-red-300"
                          )}
                        >
                          <TableCell className="p-0 w-12">
                            <div className="flex flex-col items-center gap-1">
                              <div
                                {...provided.dragHandleProps}
                                className="flex items-center justify-center cursor-grab p-1"
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                              {priority.needsClarification && (
                                <AlertCircle className="h-3 w-3 text-yellow-600" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            <div className="space-y-1">
                              <Input
                                value={editedPriorities[index] || priority.original}
                                onChange={(e) => handleEditPriority(index, e.target.value)}
                                className="w-full h-8 text-sm"
                                placeholder="Describe your priority..."
                              />
                              <div className="text-xs text-muted-foreground">
                                Priority #{index + 1}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            {renderMappingDisplay(priority)}
                          </TableCell>
                          <TableCell className="p-2 text-center">
                            {renderConfidenceIndicator(priority.confidence)}
                          </TableCell>
                          <TableCell className="p-2">
                            <div className="flex justify-center">
                              {renderFeedbackButtons(priority)}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
            {isUpdating ? "Updating..." : "Update Mapping"}
          </Button>
        </div>
      )}
      
      {mappedPriorities.some(p => p.needsClarification) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Some priorities need clarification</span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Items marked with ⚠️ have low confidence mappings. Use the help button to see alternative options.
          </p>
        </div>
      )}
    </div>
  );
}
