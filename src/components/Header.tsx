import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

// Checkbox icon component
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

// Hamburger menu placeholder
const MenuPlaceholder = () => (
  <div className="w-6 h-6 flex flex-col justify-center gap-1">
    <div className="w-full h-0.5 bg-black"></div>
    <div className="w-full h-0.5 bg-black"></div>
    <div className="w-full h-0.5 bg-black"></div>
  </div>
)

interface HeaderProps {
  className?: string
  showBackButton?: boolean
  onBack?: () => void
  backButtonText?: string
}

export function Header({
  className = '',
  showBackButton = false,
  onBack,
  backButtonText = 'Back',
}: HeaderProps) {
  return (
    <div className={`bg-white ${className}`}>
      {/* Header content */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Logo */}
        <div className="flex items-center gap-2">
          <CheckboxIcon />
          <h1 className="text-xl font-normal text-black">VoterPrime</h1>
        </div>

        {/* Right side - Menu placeholder */}
        <MenuPlaceholder />
      </div>
      
      {/* Horizontal separator line */}
      <div className="w-full h-px bg-black"></div>
      
      {/* Navigation button below the line */}
      {showBackButton && onBack && (
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 h-8 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">{backButtonText}</span>
          </Button>
        </div>
      )}
    </div>
  )
}
