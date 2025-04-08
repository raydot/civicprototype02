import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CandidateRecommendation } from "@/types/recommendations";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface CandidateTableProps {
  office: string;
  candidates: CandidateRecommendation[];
}

export function CandidateTable({ office, candidates }: CandidateTableProps) {
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

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{office}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead className="w-[100px] text-center">Match</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate, index) => (
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
                    <Badge variant="outline" className="ml-2">
                      {candidate.party}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <p>{candidate.summary}</p>
                  {candidate.platformHighlights.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {candidate.platformHighlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-lg" title={candidate.match}>
                  {getMatchIcon(candidate.match)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
