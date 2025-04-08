import { 
  InterestGroup, 
  Petition, 
  CivicEducationResource 
} from "@/types/recommendations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  BookOpen, 
  ExternalLink 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResourcesSectionProps {
  interestGroups: InterestGroup[];
  petitions: Petition[];
  civicEducation: CivicEducationResource[];
}

export function ResourcesSection({ 
  interestGroups, 
  petitions, 
  civicEducation 
}: ResourcesSectionProps) {
  return (
    <div className="space-y-8">
      {/* Interest Groups */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Relevant Organizations</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interestGroups.map((group, index) => (
            <Card key={index} className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold">{group.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {group.priorities.map((priority, i) => (
                    <Badge key={i} variant="secondary">
                      {priority}
                    </Badge>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(group.website, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Petitions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Related Petitions</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {petitions.map((petition, index) => (
            <Card key={index} className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold">{petition.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {petition.description}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {petition.relevantPriorities.map((priority, i) => (
                    <Badge key={i} variant="secondary">
                      {priority}
                    </Badge>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(petition.link, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Petition
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Civic Education */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Educational Resources</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {civicEducation.map((resource, index) => (
            <Card key={index} className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{resource.title}</h4>
                  <Badge variant="outline">
                    {resource.source}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {resource.topics.map((topic, i) => (
                    <Badge key={i} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(resource.link, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
