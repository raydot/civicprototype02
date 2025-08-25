import React from 'react'
import { CheckboxIcon } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

interface SplashPageProps {
  onGetStarted: () => void
}

export function SplashPage({ onGetStarted }: SplashPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 max-w-md mx-auto">
      {/* Centered Logo */}
      <div className="flex items-center gap-2 mb-auto mt-auto">
        <CheckboxIcon />
        <div className="text-xl font-normal text-black">VoterPrime</div>
      </div>
      
      {/* Get Started Button */}
      <Button 
        onClick={onGetStarted}
        className="w-full mb-8"
        size="lg"
      >
        Get Started
      </Button>
    </div>
  )
}
