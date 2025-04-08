import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Target, AlertTriangle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NuancedMapping {
  standardTerm: string;
  confidence: number;
  nuances: {
    [key: string]: number;
  };
  contextualFactors: string[];
  potentialConflicts: string[];
}

interface PriorityMapping {
  originalInput: string;
  mappedTerms: NuancedMapping[];
  hasAmbiguity: boolean;
  hasConflict: boolean;
}

interface PriorityMappingTableProps {
  mappings: PriorityMapping[];
  onGetRecommendations: () => void;
  onUpdatePriorities: () => void;
}

export function PriorityMappingTable({ 
  mappings, 
  onGetRecommendations,
  onUpdatePriorities 
}: PriorityMappingTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Priorities Mapping</h2>
      </div>
      
      <p className="text-sm text-muted-foreground">
        We have mapped your priorities to policy terms to provide the best recommendations.
        Please review the mappings and update your priorities if needed.
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Your Priority</TableHead>
            <TableHead>Policy Terms & Nuances</TableHead>
            <TableHead className="w-[100px]">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings.map((mapping, index) => (
            <TableRow key={index}>
              <TableCell>{mapping.originalInput}</TableCell>
              <TableCell>
                <div className="space-y-2">
                  {/* Main Policy Terms */}
                  <div className="flex flex-wrap gap-1">
                    {mapping.mappedTerms.map((term, termIndex) => (
                      <TooltipProvider key={termIndex}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge 
                              variant={term.confidence > 0.8 ? "default" : "secondary"}
                              className="cursor-help"
                            >
                              {term.standardTerm}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-2 p-2">
                              <p className="font-medium">Key Aspects:</p>
                              <ul className="list-disc list-inside text-sm">
                                {Object.entries(term.nuances)
                                  .filter(([_, value]) => value > 0.7)
                                  .map(([key], i) => (
                                    <li key={i}>{key.replace(/_/g, ' ')}</li>
                                  ))}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>

                  {/* Contextual Factors */}
                  {mapping.mappedTerms.some(term => term.contextualFactors.length > 0) && (
                    <div className="flex flex-wrap gap-1">
                      {mapping.mappedTerms.flatMap(term => 
                        term.contextualFactors.map((factor, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))
                      )}
                    </div>
                  )}

                  {/* Warnings */}
                  <div className="flex items-center gap-2 text-xs">
                    {mapping.hasAmbiguity && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <AlertTriangle className="h-3 w-3" />
                        <span>May need clarification</span>
                      </div>
                    )}
                    {mapping.hasConflict && (
                      <div className="flex items-center gap-1 text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        <span>Potential conflicts detected</span>
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {mapping.mappedTerms.map((term, i) => (
                  <div key={i} className="text-sm">
                    {Math.round(term.confidence * 100)}%
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={onUpdatePriorities}>
          Update Priorities
        </Button>
        <Button onClick={onGetRecommendations}>
          Get Recommendations
        </Button>
      </div>
    </div>
  );
}
