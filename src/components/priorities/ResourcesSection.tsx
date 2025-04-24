import React from 'react';
import { 
  InterestGroup, 
  Petition, 
  CivicEducationResource 
} from "@/types/recommendations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  BookOpen, 
  ExternalLink 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';
import { useState, useEffect } from 'react'

interface ResourcesSectionProps {
  interestGroups: InterestGroup[];
  petitions: Petition[];
  educationResources: CivicEducationResource[];
}

export function ResourcesSection({ 
  interestGroups = [], 
  petitions = [], 
  educationResources = []
}: ResourcesSectionProps) {
  // Debug logging
  useEffect(() => {
    console.log('ResourcesSection rendered with data:', {
      interestGroups,
      petitions,
      educationResources
    });
  }, [interestGroups, petitions, educationResources]);

  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback {...props} componentName="ResourcesSection" />
      )}
    >
      <div className="space-y-8">
        {/* Interest Groups */}
        {interestGroups.length > 0 && (
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
                      {group.priorities?.map((priority, i) => (
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
        )}

        {/* Petitions */}
        {petitions.length > 0 && (
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
                      {petition.relevantPriorities?.map((priority, i) => (
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
        )}

        {/* Civic Education Resources */}
        {educationResources && educationResources.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Educational Resources</h3>
            </div>
            <p className="text-muted-foreground">
              Learn more about the issues that matter to you with these educational resources.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationResources.map((resource, index) => (
                <Card key={index}>
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    <p className="text-xs text-muted-foreground">Source: {resource.source}</p>
                    <div className="flex flex-wrap gap-1">
                      {resource.topics?.map((topic, i) => (
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
                      Access Resource
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Show a message if no resources are available */}
        {interestGroups.length === 0 && petitions.length === 0 && educationResources.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No additional resources available for your priorities.</p>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
}
