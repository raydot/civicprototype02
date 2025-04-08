import { ToastActionElement } from '@/components/ui/toast';

export type Toast = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: 'default' | 'destructive';
};
