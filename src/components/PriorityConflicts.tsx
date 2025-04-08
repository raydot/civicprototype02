import { ConflictResult } from '@/utils/priorityConflicts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface PriorityConflictsProps {
  conflicts: ConflictResult[];
}

export function PriorityConflicts({ conflicts }: PriorityConflictsProps) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="space-y-4">
      {conflicts.map((conflict, index) => (
        <Alert
          key={index}
          variant={conflict.severity === 'high' ? 'destructive' : 'default'}
          className="border-l-4 border-yellow-500"
        >
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Potential Conflict Detected
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm">
              Your priorities may have conflicting goals:
            </p>
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">Priority 1:</p>
              <p className="text-sm pl-4">{conflict.priority1}</p>
              <p className="text-sm font-medium">Priority 2:</p>
              <p className="text-sm pl-4">{conflict.priority2}</p>
              <p className="text-sm font-medium mt-2">Reason:</p>
              <p className="text-sm pl-4">{conflict.reason}</p>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
