import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import React, { useState } from 'react'
import { PageWrapper } from '@/components/ui/PageWrapper'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDebugMode } from '@/utils/debugMode'
import { DragHandle } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

// Define schema for ZIP code and priorities
const VoterFormSchema = z.object({
  zipCode: z.string().min(5, 'ZIP code is required').max(10, 'Invalid ZIP code'),
  priorities: z.array(z.string()).min(1, 'At least one priority is required'),
})

// Move SortableItem outside the main component to prevent recreation
const SortableItem = React.memo(({ id, index, form, errors }: { id: string; index: number; form: any; errors: any }) => {
  console.log(`SortableItem ${index} rendering`)
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  }

  const fieldName = `priorities.${index}`
  const hasError = errors?.priorities?.[index]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1 ${isDragging ? 'shadow-lg border-2 border-blue-300 bg-white rounded' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing hover:bg-gray-50 rounded transition-all duration-200 active:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        tabIndex={-1}
      >
        <DragHandle />
      </div>
      <div className="flex-1">
        <input
          {...form.register(fieldName)}
          placeholder="Start typing here..."
          className={`w-full px-4 py-3 border rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasError ? 'border-red-500' : 'border-black'
          }`}
          tabIndex={index + 2}
          onFocus={() => console.log(`Input ${index} focused`)}
          onBlur={() => console.log(`Input ${index} blurred`)}
          onKeyDown={(e) => console.log(`Input ${index} keydown:`, e.key)}
        />
        {hasError && (
          <p className="text-red-500 text-xs mt-1">{hasError.message}</p>
        )}
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Only re-render if id or index changes, ignore form object changes
  return prevProps.id === nextProps.id && prevProps.index === nextProps.index
})

type VoterFormValues = z.infer<typeof VoterFormSchema>

interface VoterFormPageProps {
  onSubmit: (values: VoterFormValues) => void
  isLoading?: boolean
  onRandomZipCode?: (zipCode: string) => void
  initialValues?: Partial<VoterFormValues>
}

export function VoterFormPage({
  onSubmit,
  isLoading = false,
  onRandomZipCode,
  initialValues,
}: VoterFormPageProps) {
  const form = useForm<VoterFormValues>({
    resolver: zodResolver(VoterFormSchema),
    defaultValues: {
      zipCode: initialValues?.zipCode || '',
      priorities: initialValues?.priorities || ['', '', '', '', '', ''],
    },
  })

  const { formState: { errors } } = form

  const { isEnabled: isDebugEnabled } = useDebugMode()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [itemOrder, setItemOrder] = useState<number[]>([0, 1, 2, 3, 4, 5])

  // Configure sensors for better drag experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

    // Set ZIP code in form and call callback
    form.setValue('zipCode', randomZip)
    if (onRandomZipCode) {
      onRandomZipCode(randomZip)
    }

    // Shuffle and take 6 random priorities
    const shuffled = [...randomPriorities].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 6)

    form.setValue('priorities', selected)

    console.log(`Generated random data: ZIP: ${randomZip}, 6 priorities`)
  }


  // Drag overlay component for smooth visual feedback
  const DragOverlayItem = ({ originalIndex }: { originalIndex: number }) => {
    const currentValues = form.getValues('priorities')
    // Find the current position of this original index in the itemOrder array
    const currentPosition = itemOrder.findIndex(index => index === originalIndex)
    const displayValue = currentValues[currentPosition] || 'Start typing here...'
    
    return (
      <div className="bg-white shadow-2xl border-2 border-blue-400 rounded-lg overflow-hidden opacity-95 transform rotate-2 flex items-center gap-1 p-2">
        <DragHandle />
        <input
          value={displayValue}
          className="flex-1 px-4 py-3 border border-black rounded text-sm pointer-events-none"
          readOnly
        />
      </div>
    )
  }

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)

    if (over && active.id !== over.id) {
      const activeOriginalIndex = parseInt(active.id.toString().split('-')[1])
      const overOriginalIndex = parseInt(over.id.toString().split('-')[1])
      
      // Find current positions in the itemOrder array
      const oldIndex = itemOrder.findIndex(index => index === activeOriginalIndex)
      const newIndex = itemOrder.findIndex(index => index === overOriginalIndex)

      // First update the visual order immediately
      const newItemOrder = [...itemOrder]
      const [reorderedOrderItem] = newItemOrder.splice(oldIndex, 1)
      newItemOrder.splice(newIndex, 0, reorderedOrderItem)
      setItemOrder(newItemOrder)

      // Then update form values after a short delay to let the animation complete
      setTimeout(() => {
        const currentValues = form.getValues('priorities')
        const newValues = [...currentValues]
        const [reorderedItem] = newValues.splice(oldIndex, 1)
        newValues.splice(newIndex, 0, reorderedItem)
        form.setValue('priorities', newValues)
      }, 150) // Small delay to let the visual transition complete
    }
  }

  return (
    <PageWrapper componentName="VoterFormPage">
      <div className="bg-white">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ZIP Code Section */}
          <div className="space-y-2">
            <label className="block text-base font-normal text-black">
              Enter Zip Code
            </label>
            <input
              {...form.register('zipCode')}
              placeholder="#####"
              className={`w-full px-4 py-3 border rounded text-sm text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.zipCode ? 'border-red-500' : 'border-black'
              }`}
              tabIndex={1}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-xs">{errors.zipCode.message}</p>
            )}
          </div>

          {/* Priorities Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-base font-bold text-black">Priorities</h2>
              <p className="text-base text-black leading-relaxed">
                Tell us what matters to you most and we'll suggest civic actions that align with your values.
              </p>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={itemOrder.map(i => `priority-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {itemOrder.map((originalIndex, currentIndex) => (
                    <SortableItem
                      key={`priority-${originalIndex}`}
                      id={`priority-${originalIndex}`}
                      index={currentIndex}
                      form={form}
                      errors={errors}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay>
                {activeId ? (
                  <DragOverlayItem originalIndex={parseInt(activeId.split('-')[1])} />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Submit Section */}
          <div className="flex justify-between items-center gap-2">
            {isDebugEnabled && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRandomPriorities}
              >
                Random
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
              variant="secondary"
            >
              {isLoading ? 'Analyzing...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  )
}
