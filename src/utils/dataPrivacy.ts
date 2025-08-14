/**
 * Data privacy utilities for sanitizing sensitive data in development
 */

export function sanitizeZipCode(zipCode: string): string {
  if (import.meta.env.DEV) {
    // In development, replace with safe test ZIP codes
    const testZips = ['90210', '10001', '60611', '30309', '78701']
    return testZips[Math.floor(Math.random() * testZips.length)]
  }
  return zipCode
}

export function sanitizePriorities(priorities: string[]): string[] {
  if (import.meta.env.DEV) {
    // In development, replace with generic test priorities
    const testPriorities = [
      'Lower taxes',
      'Better schools',
      'Healthcare access',
      'Environmental protection',
      'Public safety',
    ]
    return priorities.map(
      (_, index) =>
        testPriorities[index % testPriorities.length] || 'Generic priority'
    )
  }
  return priorities
}

export function shouldLogData(): boolean {
  // Only log detailed data in development
  return import.meta.env.DEV
}

export function getDataRetentionPolicy(): 'none' | 'session' | 'persistent' {
  if (import.meta.env.DEV) {
    return 'session' // Clear on browser close
  }
  return 'none' // Don't store in production
}

export function sanitizeForLogging(data: any): any {
  if (import.meta.env.PROD) {
    // In production, remove sensitive fields
    const sanitized = { ...data }
    delete sanitized.zipCode
    delete sanitized.priorities
    delete sanitized.userInput
    return { ...sanitized, _sanitized: true }
  }
  return data
}
