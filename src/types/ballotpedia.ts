export interface BallotMeasure {
  title: string;
  description: string;
  supporters: string[];
  opposers: string[];
  userConcernMapping: string;
  ballotpediaLink: string;
}

export interface BallotpediaApiResponse {
  data: Array<{
    title?: string;
    name?: string;
    summary?: string;
    description?: string;
    supporters?: string[];
    opponents?: string[];
    topic?: string;
    category?: string;
    url?: string;
  }>;
}
