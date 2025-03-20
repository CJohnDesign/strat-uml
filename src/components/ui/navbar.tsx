"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, Menu, X } from "lucide-react"
import { Drawer } from "./drawer"

interface NavbarProps {
  activeDiagram: string;
  onDiagramChange: (diagram: string) => void;
}

export function Navbar({ activeDiagram, onDiagramChange }: NavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const diagrams = [
    { id: 'stratia-namespaced-3-1', label: 'Stratia 3.1' },
    { id: 'stratia-2-3', label: 'Stratia 2.3' },
    { id: 'certifiable-autonomy-5-1', label: 'Autonomy 5.1' },
    { id: 'certifiable-autonomy-5-2', label: 'Autonomy 5.2' }
  ];

  const DiagramButtons = () => (
    <div className="flex flex-col lg:flex-row gap-2">
      {diagrams.map((diagram) => (
        <button
          key={diagram.id}
          onClick={() => {
            onDiagramChange(diagram.id)
            setIsDrawerOpen(false)
          }}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
            ${activeDiagram === diagram.id 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-primary/10'
            }`}
        >
          {diagram.label}
        </button>
      ))}
    </div>
  )

  return (
    <header className="w-full bg-background sticky top-0 z-50 border-b border-border/10">
      <div className="w-full h-16 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Desktop navigation */}
          <div className="hidden lg:block">
            <DiagramButtons />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden p-2 hover:bg-accent rounded-md"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <button 
          id="download-svg-button"
          className="button button-primary px-4 py-2 inline-flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download PNG</span>
        </button>
      </div>

      {/* Mobile drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        className="p-6"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-semibold text-primary">Menu</span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 hover:bg-accent rounded-md"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <DiagramButtons />
        </div>
      </Drawer>
    </header>
  )
} 