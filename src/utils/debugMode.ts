/**
 * Debug mode utilities for controlling visibility of debugging features
 */

class DebugModeManager {
  private static instance: DebugModeManager
  private debugMode: boolean = false
  private listeners: Set<(enabled: boolean) => void> = new Set()

  private constructor() {
    // Check environment variable for default debug state
    // Only enable debug mode if explicitly set to 'true' in VITE_DEBUG_MODE
    // Remove automatic enabling in DEV mode to respect user preference
    this.debugMode = import.meta.env.VITE_DEBUG_MODE === 'true'

    console.log('🐛 Debug Mode Initialization:', {
      VITE_DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE,
      DEV: import.meta.env.DEV,
      debugModeEnabled: this.debugMode,
    })

    // Set up keyboard listener for Konami-style activation
    this.setupKeyboardListener()
  }

  public static getInstance(): DebugModeManager {
    if (!DebugModeManager.instance) {
      DebugModeManager.instance = new DebugModeManager()
    }
    return DebugModeManager.instance
  }

  private setupKeyboardListener() {
    let keySequence: string[] = []
    const targetSequence = ['d', 'e', 'b', 'u', 'g'] // Type "debug" to toggle

    const handleKeyPress = (event: KeyboardEvent) => {
      // Only listen for letter keys, ignore modifiers
      if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
        keySequence.push(event.key.toLowerCase())

        // Keep only the last 5 characters
        if (keySequence.length > targetSequence.length) {
          keySequence = keySequence.slice(-targetSequence.length)
        }

        // Check if sequence matches
        if (
          keySequence.length === targetSequence.length &&
          keySequence.every((key, index) => key === targetSequence[index])
        ) {
          this.toggle()
          keySequence = [] // Reset sequence
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
  }

  public isEnabled(): boolean {
    return this.debugMode
  }

  public enable(): void {
    if (!this.debugMode) {
      this.debugMode = true
      this.notifyListeners()
      console.log('🐛 Debug mode enabled')
    }
  }

  public disable(): void {
    if (this.debugMode) {
      this.debugMode = false
      this.notifyListeners()
      console.log('🐛 Debug mode disabled')
    }
  }

  public toggle(): void {
    if (this.debugMode) {
      this.disable()
    } else {
      this.enable()
    }
  }

  public subscribe(callback: (enabled: boolean) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.debugMode))
  }
}

export const debugMode = DebugModeManager.getInstance()

// React hook for components
import { useState, useEffect } from 'react'

export function useDebugMode() {
  console.log('Debug mode env:', import.meta.env.VITE_DEBUG_MODE)
  const [isEnabled, setIsEnabled] = useState(debugMode.isEnabled())

  useEffect(() => {
    const unsubscribe = debugMode.subscribe(setIsEnabled)
    return unsubscribe
  }, [])

  return {
    isEnabled,
    enable: () => debugMode.enable(),
    disable: () => debugMode.disable(),
    toggle: () => debugMode.toggle(),
  }
}
