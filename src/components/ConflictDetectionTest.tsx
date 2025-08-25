import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { VoterForm } from './pages/VoterFormPage'
import { Mode } from '@/contexts/ModeContext'

const testScenarios = [
  {
    name: 'Environmental vs Economic Growth',
    description:
      'Testing conflict between environmental protection and fossil fuel industry support',
    values: {
      mode: 'demo' as Mode,
      zipCode: '12345',
      priorities: [
        'Protect the environment and fight climate change',
        'Support oil and gas industry jobs',
        'Increase renewable energy investment',
        'Expand offshore drilling',
        '',
        '',
      ],
    },
  },
  {
    name: 'Tax Policy Conflicts',
    description: 'Testing conflicts in fiscal policy preferences',
    values: {
      mode: 'demo' as Mode,
      zipCode: '12345',
      priorities: [
        'Lower taxes for everyone',
        'Increase funding for social programs',
        'Reduce government spending',
        'Expand Medicare coverage',
        '',
        '',
      ],
    },
  },
  {
    name: 'Immigration Policy',
    description: 'Testing conflicts in immigration stance',
    values: {
      mode: 'demo' as Mode,
      zipCode: '12345',
      priorities: [
        'Support pathway to citizenship for immigrants',
        'Strengthen border security and deportation',
        'Protect DACA recipients',
        'Reduce illegal immigration',
        '',
        '',
      ],
    },
  },
  {
    name: 'Healthcare Policy',
    description: 'Testing healthcare policy conflicts',
    values: {
      mode: 'demo' as Mode,
      zipCode: '12345',
      priorities: [
        'Support Medicare for All',
        'Keep healthcare private and market-based',
        'Expand government healthcare programs',
        'Reduce government role in healthcare',
        '',
        '',
      ],
    },
  },
]

export function ConflictDetectionTest() {
  const handleSubmit = async (values: any) => {
    console.log('Form submitted:', values)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="prose max-w-none mb-8">
        <h1>Conflict Detection Test Scenarios</h1>
        <p>
          This page demonstrates the conflict detection system with various test
          scenarios. Each scenario contains priorities that may have different
          types of conflicts.
        </p>
      </div>

      <div className="grid gap-8">
        {testScenarios.map((scenario, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{scenario.name}</CardTitle>
              <CardDescription>{scenario.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <VoterForm
                onSubmit={handleSubmit}
                isLoading={false}
                initialValues={scenario.values}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
