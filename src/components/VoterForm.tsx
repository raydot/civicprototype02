import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/ErrorFallback'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { GripVertical } from 'lucide-react'
import { useDebugMode } from '@/utils/debugMode'

// Define a schema just for priorities
const PrioritiesSchema = z.object({
  priorities: z.array(z.string()).min(1, 'At least one priority is required'),
})

type PrioritiesFormValues = z.infer<typeof PrioritiesSchema>

interface VoterFormProps {
  onSubmit: (values: any) => void
  isLoading?: boolean
  onRandomZipCode?: (zipCode: string) => void
}

export function VoterForm({
  onSubmit,
  isLoading = false,
  onRandomZipCode,
}: VoterFormProps) {
  const form = useForm<PrioritiesFormValues>({
    resolver: zodResolver(PrioritiesSchema),
    defaultValues: {
      priorities: ['', '', '', '', '', ''],
    },
  })

  const { isEnabled: isDebugEnabled } = useDebugMode()

  const handleRandomPriorities = () => {
    // Random legitimate US zip codes from various regions
    const randomZipCodes = [
      '90210', // Beverly Hills, CA
      '10001', // New York, NY
      '60611', // Chicago, IL
      '02108', // Boston, MA
      '33139', // Miami Beach, FL
      '98101', // Seattle, WA
      '75201', // Dallas, TX
      '80202', // Denver, CO
      '20001', // Washington, DC
      '94102', // San Francisco, CA
      '85001', // Phoenix, AZ
      '19103', // Philadelphia, PA
      '37203', // Nashville, TN
      '30303', // Atlanta, GA
      '97201', // Portland, OR
    ]

    // Priorities in casual, everyday language as if written by 18-30 year olds
    const randomPriorities = [
      // Liberal-leaning concerns
      "I'm freaking out about climate change. Like, will we even have a planet in 50 years?",
      "Why is healthcare so expensive? I'm avoiding the doctor because I can't afford it.",
      "It's 2025 and people are still getting harassed for being LGBTQ+. That's messed up.",
      "The wealth gap is insane. Billionaires are buying spaceships while people can't afford rent.",
      "College shouldn't put you in debt for the rest of your life. It's ridiculous.",
      'Police need better training. Too many innocent people are getting hurt.',

      // Conservative-leaning concerns
      'The government takes way too much of my paycheck in taxes. I work hard for that money.',
      'I should be able to say what I think without being canceled online.',
      "We need to secure our borders. It's not fair to people who immigrated legally.",
      'I believe life begins at conception and we should protect the unborn.',
      "The 2nd amendment exists for a reason. Don't mess with my right to protect myself.",
      'Small businesses are drowning in regulations. My parents can barely keep their shop open.',

      // Mixed or unclear political alignment
      'Both parties are full of hypocrites who just care about getting re-elected.',
      "Why can't we have common sense solutions instead of all this partisan fighting?",
      'Social media is making everyone hate each other and destroying real conversation.',
      "I don't trust the media or politicians to tell me the truth about anything.",
      "Everyone's so extreme these days. What happened to meeting in the middle?",
      "I feel like my vote doesn't even matter in this system.",

      // Youth-focused concerns (more neutral)
      "Rent is insane. I'll be living with roommates until I'm 40 at this rate.",
      "I'm worried about my mental health but therapy costs too much.",
      'Finding a job in my field feels impossible even with my degree.',
      "I can't even think about buying a house. That's a fantasy at this point.",
      'My anxiety is through the roof with everything going on in the world.',
      "Public transportation in my city is a joke. I need a car but can't afford one.",

      // Personal freedom/censorship concerns
      "People are too quick to shut down opinions they don't like instead of having a conversation.",
      'I should be able to make my own medical decisions without government interference.',
      'Tech companies have too much power over what we can say online.',
      "I'm tired of being told what words I can and can't use.",
      "The government shouldn't be able to track everything we do online.",
      'Schools are banning too many books these days. Let people decide for themselves.',

      // Mental health, housing, education concerns
      'Mental health support should be as normal as going to a regular doctor.',
      'Teachers are underpaid and schools are underfunded. How is education not a priority?',
      "I can't focus on building a career when I'm just trying to find affordable housing.",
      'The pressure to be perfect on social media is making everyone depressed.',
      'We need more trade schools and practical education options, not just expensive degrees.',
      "My friends and I are all on anxiety meds just to deal with daily life. That's not normal.",
    ]

    // Select a random zip code
    const randomZip =
      randomZipCodes[Math.floor(Math.random() * randomZipCodes.length)]

    // Call the callback to update ZIP code in parent component
    if (onRandomZipCode) {
      onRandomZipCode(randomZip)
    }

    // Shuffle and take 6 random priorities
    const shuffled = [...randomPriorities].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 6)

    form.setValue('priorities', selected)

    console.log(`Generated random data: ZIP: ${randomZip}, 6 priorities`)
  }

  // Handle drag and drop reordering of priorities
  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return
    }

    const currentPriorities = form.getValues().priorities || []
    const reorderedPriorities = Array.from(currentPriorities)

    // Remove the item from its original position
    const [removed] = reorderedPriorities.splice(result.source.index, 1)
    // Insert it at the destination position
    reorderedPriorities.splice(result.destination.index, 0, removed)

    // Update the form values with the new order
    form.setValue('priorities', reorderedPriorities)
  }

  return (
    <ErrorBoundary
      FallbackComponent={props => (
        <ErrorFallback {...props} componentName="VoterForm" />
      )}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <FormLabel className="text-base">
                Your Top Priorities (drag to reorder)
              </FormLabel>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="priorities">
                {provided => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Draggable
                        key={`priority-${index}`}
                        draggableId={`priority-${index}`}
                        index={index}
                      >
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-1"
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="px-1 self-stretch flex items-center cursor-grab"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <FormField
                              control={form.control}
                              name={`priorities.${index}`}
                              render={({ field }) => (
                                <FormItem className="flex-1 mb-0">
                                  <FormControl>
                                    <Input
                                      placeholder={`Priority ${index + 1}`}
                                      className="h-9"
                                      maxLength={250}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="flex justify-between gap-2">
            {isDebugEnabled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 text-sm"
                onClick={handleRandomPriorities}
              >
                Random
              </Button>
            )}
            <Button type="submit" className="h-9 text-sm" disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </ErrorBoundary>
  )
}
