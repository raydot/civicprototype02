import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VoterForm } from "./VoterForm";
import { VoterFormValues } from "@/schemas/voterFormSchema";
import { LoadingOverlay } from "./ui/loading-overlay";
import { Mode, useMode } from "@/contexts/ModeContext";
import { RecommendationsData } from "@/types/api";
import { RecommendationsViewer } from "./priorities/RecommendationsViewer";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { TestPersonaControls } from "./TestPersonaControls";

interface VoterFormContainerProps {
  onSubmit: (values: VoterFormValues) => Promise<void>;
  isLoading: boolean;
  recommendations?: RecommendationsData;
}

export function VoterFormContainer({ 
  onSubmit, 
  isLoading,
  recommendations 
}: VoterFormContainerProps) {
  const { mode, setMode } = useMode();
  const [selectedValues, setSelectedValues] = useState<VoterFormValues>({});

  const handleModeChange = (value: Mode) => {
    setMode(value);
  };

  const handlePersonaSelect = (persona: VoterFormValues) => {
    setSelectedValues(persona);
  };

  return (
    <div className="relative space-y-8">
      {isLoading && <LoadingOverlay />}
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Mode Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={mode}
            onValueChange={handleModeChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="current" id="current" />
              <Label htmlFor="current">Current Date</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="demo" id="demo" />
              <Label htmlFor="demo">DEMO: November 2024 Election</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Test Personas</CardTitle>
          <CardDescription>
            Select a pre-defined persona to quickly test different voter profiles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestPersonaControls onSelectPersona={handlePersonaSelect} />
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Voting Priorities</CardTitle>
          <CardDescription>
            Tell us what matters most to you, and we'll help match you with candidates and measures that align with your values.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VoterForm 
            onSubmit={onSubmit} 
            isLoading={isLoading} 
            initialValues={selectedValues}
          />
        </CardContent>
      </Card>

      {recommendations && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Your Recommendations</CardTitle>
            <CardDescription>
              Based on your priorities, here are your personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecommendationsViewer 
              recommendations={recommendations}
              mode={mode}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
