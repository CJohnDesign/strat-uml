"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Drawer({ isOpen, onClose, children, className }: DrawerProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-drawer"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-background border-r border-border z-drawer transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {children}
      </div>
    </>
  )
} 