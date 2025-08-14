import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getRandomZipCode, getRandomPriorities } from "@/PPMEMappingData/testPersonas";
import { VoterFormValues } from "@/schemas/voterFormSchema";
import { useMode } from "@/contexts/ModeContext";

interface TestPersonaControlsProps {
  onPersonaSelect: (values: VoterFormValues) => void;
}

export const TestPersonaControls = ({ onPersonaSelect }: TestPersonaControlsProps) => {
  const { mode } = useMode();

  const handleRandomPersona = () => {
    const randomPersona: VoterFormValues = {
      mode: mode,
      zipCode: getRandomZipCode(),
      priorities: getRandomPriorities()
    };
    onPersonaSelect(randomPersona);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <Button
          variant="default"
          onClick={handleRandomPersona}
          className="h-8 px-3"
        >
          Random
        </Button>
      </div>
    </div>
  );
};
