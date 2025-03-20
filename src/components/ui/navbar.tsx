"use client"

import Link from "next/link"
import { Download } from "lucide-react"

interface NavbarProps {
  activeDiagram: string;
  onDiagramChange: (diagram: string) => void;
}

export function Navbar({ activeDiagram, onDiagramChange }: NavbarProps) {
  const diagrams = [
    { id: 'stratia-namespaced-3-1', label: 'Stratia 3.1' },
    { id: 'stratia-2-3', label: 'Stratia 2.3' },
    { id: 'certifiable-autonomy-5-1', label: 'Autonomy 5.1' },
    { id: 'certifiable-autonomy-5-2', label: 'Autonomy 5.2' }
  ];

  return (
    <header className="w-full bg-background sticky top-0 z-50">
      <div className="w-full h-16 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-primary">Stratia UML</span>
          </Link>
          
          <div className="flex gap-2">
            {diagrams.map((diagram) => (
              <button
                key={diagram.id}
                onClick={() => onDiagramChange(diagram.id)}
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
        </div>

        <button 
          id="download-svg-button"
          className="button button-primary px-4 py-2 inline-flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Download PNG</span>
        </button>
      </div>
    </header>
  )
} 