"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-[72px] h-9 rounded-full bg-muted animate-pulse" />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        // Base styles
        "theme-toggle relative w-[72px] h-9 rounded-full",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        // Neumorphic container - raised in light, pressed/inset in dark
        "bg-[#e0e5ec] dark:bg-[#1a1f2e]",
        // Light mode: raised effect
        "shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff]",
        // Dark mode: inset/pressed effect
        "dark:shadow-[inset_4px_4px_8px_#0f131a,inset_-4px_-4px_8px_#252b3d]",
        // Smooth shadow transition - slow motion
        "transition-[box-shadow,background-color] duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Icons container */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
        {/* Sun icon (left side) */}
        <div className="relative w-4 h-4">
          <Sun
            className={cn(
              "absolute inset-0 w-4 h-4",
              "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
              isDark 
                ? "opacity-40 scale-[0.7] rotate-[-90deg] text-gray-500" 
                : "opacity-100 scale-100 rotate-0 text-amber-500"
            )}
          />
        </div>
        
        {/* Moon icon (right side) */}
        <div className="relative w-4 h-4">
          <Moon
            className={cn(
              "absolute inset-0 w-4 h-4",
              "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
              isDark 
                ? "opacity-100 scale-100 rotate-0 text-indigo-300" 
                : "opacity-40 scale-[0.7] rotate-[90deg] text-gray-400"
            )}
          />
        </div>
      </div>

      {/* Toggle thumb - using translateX for smooth movement */}
      <div
        className={cn(
          "absolute top-1 left-1 h-7 w-7 rounded-full",
          "transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          // Position using translateX
          isDark ? "translate-x-[36px]" : "translate-x-0",
          // Neumorphic thumb - always raised
          "bg-[#e0e5ec] dark:bg-[#252b3d]",
          "shadow-[3px_3px_6px_#b8bec7,-3px_-3px_6px_#ffffff]",
          "dark:shadow-[3px_3px_6px_#0f131a,-3px_-3px_6px_#353d52]",
          "transition-[transform,box-shadow,background-color] duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        )}
      >
        {/* Thumb inner glow */}
        <div 
          className={cn(
            "absolute inset-[3px] rounded-full",
            "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            isDark 
              ? "bg-gradient-to-br from-indigo-400/30 via-transparent to-transparent" 
              : "bg-gradient-to-br from-amber-300/40 via-transparent to-transparent"
          )}
        />
        
        {/* Active icon inside thumb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sun
            className={cn(
              "absolute w-3.5 h-3.5 text-amber-500",
              "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
              isDark 
                ? "opacity-0 scale-50 rotate-[-180deg]" 
                : "opacity-100 scale-100 rotate-0"
            )}
          />
          <Moon
            className={cn(
              "absolute w-3.5 h-3.5 text-indigo-300",
              "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
              isDark 
                ? "opacity-100 scale-100 rotate-0" 
                : "opacity-0 scale-50 rotate-[180deg]"
            )}
          />
        </div>
      </div>
    </button>
  )
}

// Compact version for tight spaces (header)
export function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-14 h-7 rounded-full bg-muted animate-pulse" />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        // Base styles
        "theme-toggle relative w-14 h-7 rounded-full",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        // Neumorphic container
        "bg-[#e0e5ec] dark:bg-[#1a1f2e]",
        // Light mode: raised
        "shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff]",
        // Dark mode: inset/pressed
        "dark:shadow-[inset_3px_3px_6px_#0f131a,inset_-3px_-3px_6px_#252b3d]",
        // Smooth transitions - slow motion
        "transition-[box-shadow,background-color] duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Sun
          className={cn(
            "w-3.5 h-3.5",
            "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            isDark 
              ? "opacity-40 scale-[0.7] rotate-[-90deg] text-gray-500" 
              : "opacity-100 scale-100 rotate-0 text-amber-500"
          )}
        />
        <Moon
          className={cn(
            "w-3.5 h-3.5",
            "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            isDark 
              ? "opacity-100 scale-100 rotate-0 text-indigo-300" 
              : "opacity-40 scale-[0.7] rotate-[90deg] text-gray-400"
          )}
        />
      </div>

      {/* Toggle thumb */}
      <div
        className={cn(
          "absolute top-0.5 left-0.5 h-6 w-6 rounded-full",
          // Use translateX for smooth movement
          isDark ? "translate-x-[28px]" : "translate-x-0",
          // Neumorphic thumb
          "bg-[#e0e5ec] dark:bg-[#252b3d]",
          "shadow-[2px_2px_4px_#b8bec7,-2px_-2px_4px_#ffffff]",
          "dark:shadow-[2px_2px_4px_#0f131a,-2px_-2px_4px_#353d52]",
          // Synchronized transitions - slow motion
          "transition-[transform,box-shadow,background-color] duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        )}
      >
        {/* Active icon inside thumb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sun
            className={cn(
              "absolute w-3 h-3 text-amber-500",
              "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
              isDark 
                ? "opacity-0 scale-50 rotate-[-180deg]" 
                : "opacity-100 scale-100 rotate-0"
            )}
          />
          <Moon
            className={cn(
              "absolute w-3 h-3 text-indigo-300",
              "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
              isDark 
                ? "opacity-100 scale-100 rotate-0" 
                : "opacity-0 scale-50 rotate-[180deg]"
            )}
          />
        </div>
      </div>
    </button>
  )
}
