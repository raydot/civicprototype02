import React from 'react'

// Checkbox icon component - used in Header and SplashScreen
export const CheckboxIcon = () => (
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

// Drag handle component - used in VoterFormPage
export const DragHandle = () => (
  <div className="flex flex-col gap-1 p-2">
    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
  </div>
)
