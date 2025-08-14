/**
 * API mode utilities using Vite's built-in dev/prod modes
 */

export function isDevMode(): boolean {
  return import.meta.env.DEV
}

export function isProdMode(): boolean {
  return import.meta.env.PROD
}

export function useMockAPIs(): boolean {
  return import.meta.env.DEV
}

export function useLiveAPIs(): boolean {
  return import.meta.env.PROD
}

// React hook
import { useState } from 'react'

export function useApiMode() {
  const [isDev] = useState(import.meta.env.DEV)

  return {
    isDev,
    isProd: !isDev,
    useMock: isDev,
    useLive: !isDev,
  }
}
