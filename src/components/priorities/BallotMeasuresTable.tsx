import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BallotMeasure } from "@/types/recommendations";
import { ExternalLink } from "lucide-react";

interface BallotMeasuresTableProps {
  measures: BallotMeasure[];
}

export function BallotMeasuresTable({ measures }: BallotMeasuresTableProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Ballot Measures</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[250px]">Title</TableHead>
            <TableHead>Summary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {measures.map((measure, index) => (
            <TableRow key={index}>
              <TableCell>
                {measure.link ? (
                  <a
                    href={measure.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline inline-flex items-center"
                  >
                    {measure.id}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                ) : (
                  measure.id
                )}
              </TableCell>
              <TableCell className="font-medium">
                {measure.title}
              </TableCell>
              <TableCell>
                <p className="text-muted-foreground">
                  {measure.summary}
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
