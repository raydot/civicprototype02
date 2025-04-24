import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CandidateRecommendation } from "@/types/recommendations";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';

interface CandidateTableProps {
  candidates: CandidateRecommendation[];
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedOffice, setExpandedOffice] = useState<string | null>(null);

  // Automatically expand the first office (presidential) when candidates load
  useEffect(() => {
    if (candidates.length > 0) {
      const offices = Array.from(new Set(candidates.map(c => c.office)));
      const presidentialOffice = offices.find(o => o.toLowerCase().includes('president'));
      setExpandedOffice(presidentialOffice || offices[0]);
    }
  }, [candidates]);

  const getMatchIcon = (match: CandidateRecommendation['match']) => {
    switch (match) {
      case 'full':
        return '✓';
      case 'partial':
        return '⚠️';
      case 'conflict':
        return '❌';
      default:
        return '-';
    }
  };

  const getMatchValue = (match: CandidateRecommendation['match']) => {
    switch (match) {
      case 'full':
        return 3;
      case 'partial':
        return 2;
      case 'conflict':
        return 1;
      default:
        return 0;
    }
  };

  // Group candidates by office
  const candidatesByOffice = useMemo(() => {
    if (!candidates || candidates.length === 0) {
      console.log("No candidates available to group");
      return {};
    }

    console.log("Grouping candidates:", candidates);
    
    const grouped = candidates.reduce((acc, candidate) => {
      const office = candidate.office || 'Unknown Office';
      if (!acc[office]) {
        acc[office] = [];
      }
      acc[office].push(candidate);
      return acc;
    }, {} as Record<string, CandidateRecommendation[]>);

    // Sort candidates within each office by match level
    Object.keys(grouped).forEach(office => {
      grouped[office].sort((a, b) => {
        const valueA = getMatchValue(a.match);
        const valueB = getMatchValue(b.match);
        return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
      });
    });

    return grouped;
  }, [candidates, sortOrder]);

  // Order offices with presidential candidates first
  const orderedOffices = useMemo(() => {
    const offices = Object.keys(candidatesByOffice);
    
    // Presidential offices should appear first
    return offices.sort((a, b) => {
      const isAPresidential = a.toLowerCase().includes('president');
      const isBPresidential = b.toLowerCase().includes('president');
      
      if (isAPresidential && !isBPresidential) return -1;
      if (!isAPresidential && isBPresidential) return 1;
      
      // For non-presidential offices, sort alphabetically
      return a.localeCompare(b);
    });
  }, [candidatesByOffice]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const toggleOfficeExpansion = (office: string) => {
    setExpandedOffice(expandedOffice === office ? null : office);
  };

  // Debug output
  console.log("Candidate data:", { candidates, candidatesByOffice, orderedOffices });

  useEffect(() => {
    console.log('CandidateTable rendered with candidates:', candidates);
    
    // Check for potential issues in candidate data
    if (!candidates || !Array.isArray(candidates)) {
      console.error('CandidateTable: candidates is not an array:', candidates);
    } else if (candidates.length === 0) {
      console.warn('CandidateTable: candidates array is empty');
    } else {
      // Log any candidates with missing required fields
      candidates.forEach((candidate, index) => {
        if (!candidate.name) console.error(`Candidate at index ${index} missing name:`, candidate);
        if (!candidate.office) console.error(`Candidate at index ${index} missing office:`, candidate);
        if (!candidate.party) console.warn(`Candidate at index ${index} missing party:`, candidate);
      });
    }
  }, [candidates]);

  // Safety check for candidates data
  if (!candidates || !Array.isArray(candidates)) {
    return (
      <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
        Invalid candidate data format. Please try submitting the form again.
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="p-4 border rounded-md">
        No candidate recommendations available.
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback {...props} componentName="CandidateTable" />
      )}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Candidate Recommendations</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleSortOrder}
            className="flex items-center gap-1"
          >
            Sort by Alignment {sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>

        {orderedOffices.map(office => (
          <ErrorBoundary
            key={office}
            FallbackComponent={(props) => (
              <ErrorFallback {...props} componentName={`CandidateGroup-${office}`} />
            )}
          >
            <Card key={office} className="overflow-hidden">
              <CardHeader 
                className="bg-muted/50 cursor-pointer"
                onClick={() => toggleOfficeExpansion(office)}
              >
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{office}</CardTitle>
                  {expandedOffice === office ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </div>
              </CardHeader>
              
              {expandedOffice === office && (
                <CardContent className="p-0">
                  <ScrollArea className="max-h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px] lg:w-[200px]">Name</TableHead>
                          <TableHead>Summary</TableHead>
                          <TableHead className="w-[60px] text-center">Match</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {candidatesByOffice[office].map((candidate, index) => (
                          <ErrorBoundary
                            key={index}
                            FallbackComponent={(props) => (
                              <ErrorFallback {...props} componentName={`Candidate-${candidate.name || index}`} />
                            )}
                          >
                            <TableRow key={index}>
                              <TableCell>
                                <div className="space-y-1">
                                  <a 
                                    href={candidate.officialWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium hover:underline inline-flex items-center"
                                  >
                                    {candidate.name}
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                  {candidate.party && (
                                    <Badge variant="outline" className="block mt-1 text-xs">
                                      {candidate.party}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-2">
                                  <p className="text-sm">{candidate.summary}</p>
                                  {candidate.platformHighlights && candidate.platformHighlights.length > 0 && (
                                    <div className="hidden md:block">
                                      <ul className="list-disc list-inside text-xs text-muted-foreground">
                                        {candidate.platformHighlights.slice(0, 2).map((highlight, i) => (
                                          <li key={i}>{highlight}</li>
                                        ))}
                                        {candidate.platformHighlights.length > 2 && (
                                          <li className="italic">+ {candidate.platformHighlights.length - 2} more</li>
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="text-lg" title={candidate.match}>
                                  {getMatchIcon(candidate.match)}
                                </span>
                              </TableCell>
                            </TableRow>
                          </ErrorBoundary>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              )}
            </Card>
          </ErrorBoundary>
        ))}
      </div>
    </ErrorBoundary>
  );
}
