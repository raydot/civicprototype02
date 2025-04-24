import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical } from "lucide-react";

// Match the API structure from types/api.ts
interface MappedPriority {
  original: string;
  category?: string;
  mappedTerms?: string[];
  policyTerms?: string[];
}

interface PriorityMappingTableProps {
  mappedPriorities: MappedPriority[];
  onUpdatePriorities: (updatedPriorities: string[]) => void;
  isUpdating?: boolean;
}

export function PriorityMappingTable({ 
  mappedPriorities, 
  onUpdatePriorities,
  isUpdating = false
}: PriorityMappingTableProps) {
  const [editedPriorities, setEditedPriorities] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

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

  // Helper function to get the mapped terms
  const getMappedTerms = (priority: MappedPriority): string => {
    // First try mappedTerms, then policyTerms if mappedTerms is empty
    if (priority.mappedTerms && priority.mappedTerms.length > 0) {
      return priority.mappedTerms.join(', ');
    } else if (priority.policyTerms && priority.policyTerms.length > 0) {
      return priority.policyTerms.join(', ');
    }
    return 'No mapping available';
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
                    <TableHead className="w-1/2 py-2 text-xs font-medium">Your Concern</TableHead>
                    <TableHead className="w-1/2 py-2 text-xs font-medium">Mapped Policy Term(s)</TableHead>
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
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="p-0 w-12">
                            <div
                              {...provided.dragHandleProps}
                              className="flex h-full items-center justify-center cursor-grab"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </TableCell>
                          <TableCell className="p-1">
                            <Input
                              value={editedPriorities[index] || priority.original}
                              onChange={(e) => handleEditPriority(index, e.target.value)}
                              className="w-full h-8 text-sm"
                              placeholder="Your concern"
                            />
                          </TableCell>
                          <TableCell className="p-1 text-sm">
                            {getMappedTerms(priority)}
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
        <div className="flex justify-end">
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
    </div>
  );
}
