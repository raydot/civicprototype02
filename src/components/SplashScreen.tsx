import React from 'react'

// Checkbox icon component (reused from Header.tsx)
const CheckboxIcon = () => (
  <div className="w-6 h-6 border-2 border-black flex items-center justify-center bg-white">
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M13.5 4.5L6 12L2.5 8.5" 
        stroke="black" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

interface SplashScreenProps {
  onGetStarted: () => void
}

export function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 max-w-md mx-auto">
      {/* Centered Logo */}
      <div className="flex items-center gap-2 mb-auto mt-auto">
        <CheckboxIcon />
        <div className="text-xl font-normal text-black">VoterPrime</div>
      </div>
      
      {/* Get Started Button */}
      <button 
        onClick={onGetStarted}
        className="w-full px-4 py-3 bg-black text-white rounded text-sm font-normal hover:bg-gray-800 transition-colors mb-8"
      >
        Get Started
      </button>
    </div>
  )
}
