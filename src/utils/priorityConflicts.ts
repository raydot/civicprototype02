import { MappedPriority, ConflictResult } from '@/types/policy-mappings';
import { initialPolicyMappings } from '@/data/policy-mappings';

export function detectPriorityConflicts(mappedPriorities: MappedPriority[]): ConflictResult[] {
  const conflicts: ConflictResult[] = [];

  // Compare each priority with every other priority
  for (let i = 0; i < mappedPriorities.length; i++) {
    for (let j = i + 1; j < mappedPriorities.length; j++) {
      const priority1 = mappedPriorities[i];
      const priority2 = mappedPriorities[j];

      // Check for known conflicts based on categories
      const conflict = checkForConflict(priority1, priority2);
      if (conflict) {
        conflicts.push({
          priorities: [priority1.original, priority2.original],
          reason: conflict.reason,
          severity: conflict.severity
        });
      }
    }
  }

  return conflicts;
}

interface ConflictDefinition {
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

const knownConflicts: Record<string, Record<string, ConflictDefinition>> = {
  environmentalProtection: {
    fossilFuelIndustry: {
      reason: "Environmental protection goals may conflict with fossil fuel industry expansion",
      severity: "high"
    }
  },
  taxIncrease: {
    taxCuts: {
      reason: "Cannot simultaneously increase and decrease taxes",
      severity: "high"
    }
  },
  governmentRegulation: {
    deregulation: {
      reason: "Regulation and deregulation are opposing approaches",
      severity: "high"
    }
  }
};

function checkForConflict(priority1: MappedPriority, priority2: MappedPriority): ConflictDefinition | null {
  // Check direct category conflicts
  if (knownConflicts[priority1.category]?.[priority2.category]) {
    return knownConflicts[priority1.category][priority2.category];
  }
  
  // Check reverse category conflicts
  if (knownConflicts[priority2.category]?.[priority1.category]) {
    return knownConflicts[priority2.category][priority1.category];
  }

  // Check sentiment conflicts within same category
  if (priority1.category === priority2.category && 
      priority1.sentiment !== priority2.sentiment &&
      priority1.sentiment !== 'neutral' &&
      priority2.sentiment !== 'neutral') {
    return {
      reason: `Conflicting stances on ${priority1.category}`,
      severity: "medium"
    };
  }

  return null;
}
