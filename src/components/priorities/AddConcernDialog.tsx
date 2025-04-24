import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddConcernDialogProps {
  isOpen: boolean;
  onClose: () => void;
  concern: string;
  suggestedCategory: string;
  onAddConcern: (concern: string, category: string) => Promise<boolean>;
}

export function AddConcernDialog({
  isOpen,
  onClose,
  concern,
  suggestedCategory,
  onAddConcern
}: AddConcernDialogProps) {
  const [category, setCategory] = useState(suggestedCategory || 'Other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Economy",
    "Healthcare",
    "Education",
    "Environment",
    "Immigration",
    "Foreign Policy",
    "National Security",
    "Civil Rights",
    "Criminal Justice",
    "Technology",
    "Infrastructure",
    "Other"
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const success = await onAddConcern(concern, category);
      
      if (success) {
        toast({
          title: "Concern Added",
          description: "Thank you! Your concern has been added to our system for review.",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem adding your concern. Please try again.",
          variant: "destructive"
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error adding concern:', error);
      toast({
        title: "Error",
        description: "There was a problem adding your concern. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Your Concern</DialogTitle>
          <DialogDescription>
            Your concern will be added to our system to help future users find relevant policy information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="concern" className="text-right">
              Concern
            </Label>
            <Input
              id="concern"
              value={concern}
              readOnly
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Concern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
