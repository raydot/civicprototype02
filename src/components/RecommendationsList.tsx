import { Mode } from '@/contexts/ModeContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import { 
  Candidate,
  BallotMeasure,
  EmailDraft,
  InterestGroup,
  Petition,
  CivicEducationResource
} from '@/types/api';

interface RecommendationsListProps {
  recommendations?: {
    potus?: Candidate[];
    localOffices?: { [office: string]: Candidate[] };
    ballotMeasures?: BallotMeasure[];
    emailDrafts?: EmailDraft[];
    interestGroups?: InterestGroup[];
    petitions?: Petition[];
    civicEducation?: CivicEducationResource[];
  };
  mode: Mode;
}

export function RecommendationsList({ recommendations, mode }: RecommendationsListProps) {
  const isDemo = mode === 'demo';

  if (!recommendations) {
    return null;
  }

  const {
    potus = [],
    localOffices = {},
    ballotMeasures = [],
    emailDrafts = [],
    interestGroups = [],
    petitions = [],
    civicEducation = []
  } = recommendations;

  return (
    <div className="space-y-8">
      {/* Presidential Candidates */}
      {potus.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-4">Presidential Candidates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {potus.map((candidate, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{candidate.name}</CardTitle>
                  <CardDescription>
                    {candidate.party} • {candidate.office || 'Presidential Candidate'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant={candidate.alignment === '✅' ? 'default' : 'destructive'}>
                    {candidate.alignment}
                  </Badge>
                  <p className="mt-2 text-sm">{candidate.rationale}</p>
                  {candidate.platformHighlights && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Platform Highlights</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {candidate.platformHighlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <a href={candidate.officialWebsite} target="_blank" rel="noopener noreferrer">
                      Official Website <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Local Offices */}
      {Object.keys(localOffices).length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-4">Local Offices</h3>
          <Accordion type="single" collapsible>
            {Object.entries(localOffices).map(([office, candidates], index) => (
              <AccordionItem key={index} value={`office-${index}`}>
                <AccordionTrigger>{office}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {candidates.map((candidate, idx) => (
                      <Card key={idx}>
                        <CardHeader>
                          <CardTitle>{candidate.name}</CardTitle>
                          <CardDescription>{candidate.party}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Badge variant={candidate.alignment === '✅' ? 'default' : 'destructive'}>
                            {candidate.alignment}
                          </Badge>
                          <p className="mt-2 text-sm">{candidate.rationale}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" asChild>
                            <a href={candidate.officialWebsite} target="_blank" rel="noopener noreferrer">
                              Learn More <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {/* Ballot Measures */}
      {ballotMeasures.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-4">Ballot Measures</h3>
          <div className="space-y-4">
            {ballotMeasures.map((measure, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{measure.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{measure.description}</p>
                  <div className="mt-4 space-y-2">
                    <div>
                      <h4 className="text-sm font-medium">Supporting Organizations</h4>
                      <p className="text-sm text-muted-foreground">{measure.supporters.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Opposing Organizations</h4>
                      <p className="text-sm text-muted-foreground">{measure.opposers.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Your Concerns</h4>
                      <p className="text-sm">{measure.userConcernMapping}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <a href={measure.ballotpediaLink} target="_blank" rel="noopener noreferrer">
                      View on Ballotpedia <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Email Drafts */}
      {emailDrafts.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-4">Email Templates</h3>
          <div className="space-y-4">
            {emailDrafts.map((draft, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Email to {draft.recipient.name}</CardTitle>
                  <CardDescription>
                    {draft.recipient.position} • {draft.recipient.email}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium">Subject</h4>
                      <p className="text-sm">{draft.subject}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Message</h4>
                      <p className="text-sm whitespace-pre-wrap">{draft.body}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={`mailto:${draft.recipient.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Email Client <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Interest Groups */}
      {interestGroups.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-4">Relevant Organizations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interestGroups.map((group, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{group.name}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{group.relevance}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <a href={group.website} target="_blank" rel="noopener noreferrer">
                      Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Petitions */}
      {petitions.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-4">Related Petitions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {petitions.map((petition, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{petition.title}</CardTitle>
                  <CardDescription>{petition.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{petition.relevance}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <a href={petition.changeOrgUrl} target="_blank" rel="noopener noreferrer">
                      View on Change.org <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Civic Education */}
      {civicEducation.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-4">Educational Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {civicEducation.map((resource, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{resource.topic}</CardTitle>
                  <CardDescription>From {resource.source}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{resource.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    {resource.type}
                  </Badge>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      Access Resource <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
