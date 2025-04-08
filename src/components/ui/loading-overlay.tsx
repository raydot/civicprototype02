import { LoadingSpinner } from "./loading-spinner";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  message = "Analyzing your priorities...",
  className 
}: LoadingOverlayProps) {
  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm",
      "flex flex-col items-center justify-center gap-4",
      "z-50 transition-all duration-200",
      className
    )}>
      <LoadingSpinner size="lg" />
      <p className="text-lg text-muted-foreground animate-pulse">
        {message}
      </p>
    </div>
  );
}
