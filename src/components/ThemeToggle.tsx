import { useState } from 'react'

interface ThemeToggleProps {
  isWood: boolean
  onToggle: () => void
}

export default function ThemeToggle({ isWood, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative w-14 h-7 rounded-full transition-all duration-300
        ${isWood 
          ? 'bg-[#E8E0D5]' 
          : 'bg-[#2d3148]'
        }
      `}
      aria-label="Toggle theme"
    >
      <div
        className={`
          absolute top-1 w-5 h-5 rounded-full transition-all duration-300
          ${isWood 
            ? 'left-8 bg-[#8B7355]' 
            : 'left-1 bg-[#6366f1]'
          }
        `}
      />
    </button>
  )
}
