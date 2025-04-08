import { useRef } from 'react';
import Navbar from '../components/Navbar';
import { VoterFormContainer } from '@/components/VoterFormContainer';
import { usePrioritiesAnalysis } from '@/hooks/priorities-analysis/use-priorities-analysis';
import { VoterFormValues } from '@/schemas/voterFormSchema';

const Index = () => {
  const {
    isLoading,
    recommendations,
    analyzePriorities,
  } = usePrioritiesAnalysis();
  
  const handleSubmit = async (values: VoterFormValues) => {
    await analyzePriorities({
      ...values,
      priorities: values.priorities.filter(Boolean)
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <VoterFormContainer
            onSubmit={handleSubmit}
            isLoading={isLoading}
            recommendations={recommendations}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
