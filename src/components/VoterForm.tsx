import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { VoterFormSchema, VoterFormValues } from '@/schemas/voterFormSchema';
import { useMode } from '@/contexts/ModeContext';
import { GripVertical } from 'lucide-react';
import { useEffect } from 'react';
import { PriorityConflicts } from './PriorityConflicts';
import { PolicyRecommendations } from './PolicyRecommendations';
import { ConflictResult } from '@/types/policy-mappings';
import { useToast } from '@/hooks/use-toast';

interface VoterFormProps {
  onSubmit: (values: VoterFormValues) => void;
  isLoading: boolean;
  initialValues?: Partial<VoterFormValues>;
}

export function VoterForm({ onSubmit, isLoading, initialValues }: VoterFormProps) {
  const { mode } = useMode();
  const { toast } = useToast();
  
  const form = useForm<VoterFormValues>({
    resolver: zodResolver(VoterFormSchema),
    defaultValues: {
      mode,
      zipCode: '',
      priorities: Array(6).fill('')
    }
  });

  // Update form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.reset({
        mode,
        zipCode: initialValues.zipCode || '',
        priorities: initialValues.priorities || Array(6).fill('')
      });
    }
  }, [initialValues, form, mode]);

  const handleSubmit = async (values: VoterFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* ZIP Code Field */}
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP Code</FormLabel>
              <FormControl>
                <Input placeholder="00000" {...field} maxLength={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priorities Fields */}
        <div className="space-y-4">
          <FormLabel>Your Top Priorities</FormLabel>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <FormField
              key={index}
              control={form.control}
              name={`priorities.${index}`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`Priority ${index + 1}`}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
