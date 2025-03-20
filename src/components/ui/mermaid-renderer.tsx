"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import Panzoom from "@panzoom/panzoom";
import { Plus, Minus } from "lucide-react";

interface MermaidRendererProps {
  diagram: string;
}

export function MermaidRenderer({ diagram }: MermaidRendererProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const panzoomRef = useRef<ReturnType<typeof Panzoom> | null>(null);

  // Handle zoom events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent browser pinch zoom
    const preventBrowserZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Handle wheel zoom
    const handleWheel = (e: WheelEvent) => {
      if (panzoomRef.current && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const delta = e.deltaY;
        const scale = panzoomRef.current.getScale();
        const newScale = scale * (1 - delta * 0.01);
        panzoomRef.current.zoomToPoint(newScale, {
          clientX: e.clientX,
          clientY: e.clientY
        });
      }
    };

    // Handle touch events for pinch zoom
    let lastDistance = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        lastDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && panzoomRef.current) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const delta = distance - lastDistance;
        const scale = panzoomRef.current.getScale();
        const newScale = scale * (1 + delta * 0.01);
        
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        panzoomRef.current.zoomToPoint(newScale, {
          clientX: centerX,
          clientY: centerY
        });
        
        lastDistance = distance;
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    // Configure mermaid with a dark theme similar to Claude's artifacts
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      themeVariables: {
        // Background colors
        primaryColor: "#333842",
        primaryBorderColor: "#636D83",
        primaryTextColor: "#abb2bf",
        
        // Text colors
        secondaryColor: "#4b5263",
        tertiaryColor: "#333842",
        
        // Line colors
        lineColor: "#636D83",
        
        // Class diagram specific
        classText: "#abb2bf",
        titleColor: "#abb2bf",
        
        // Additional theme settings
        mainBkg: "#333842",
        secondaryBorderColor: "#636D83",
        tertiaryBorderColor: "#636D83",
        textColor: "#abb2bf",
        
        // Relationship line colors
        relationColor: "#636D83",
        relationLabelBackground: "#333842",
        
        // Fonts
        fontFamily: "monospace",
        fontSize: "14px"
      }
    });

    const renderDiagram = async () => {
      if (!diagram.trim()) {
        setLoading(false);
        setSvg("");
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        const uniqueId = `mermaid-${Date.now()}`;
        const { svg: renderedSvg } = await mermaid.render(uniqueId, diagram);
        setSvg(renderedSvg);

        // Initialize panzoom after SVG is rendered
        setTimeout(() => {
          if (containerRef.current) {
            const svgElement = containerRef.current.querySelector('svg');
            if (svgElement && !panzoomRef.current) {
              panzoomRef.current = Panzoom(svgElement, {
                maxScale: 5,
                minScale: 0.1,
                bounds: true,
                boundsPadding: 0.1,
                canvas: true,
                pinchSpeed: 2,
                enableTextSelection: true
              });

              // Enable pinch zooming
              const parent = svgElement.parentElement;
              if (parent) {
                parent.addEventListener('gesturestart', (e) => e.preventDefault());
                parent.addEventListener('gesturechange', (e) => e.preventDefault());
              }
            }
          }
        }, 100);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(`Failed to render diagram: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      renderDiagram();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (panzoomRef.current) {
        panzoomRef.current.destroy();
        panzoomRef.current = null;
      }
    };
  }, [diagram]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Generating diagram...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Enter Mermaid diagram code to see the visualization
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div 
        ref={containerRef}
        className="flex h-full w-full items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="absolute bottom-4 right-4 flex gap-2 bg-background/80 p-2 rounded-lg backdrop-blur-sm border border-border">
        <button
          onClick={() => {
            if (panzoomRef.current) {
              const currentScale = panzoomRef.current.getScale();
              const newScale = currentScale * 1.2;
              panzoomRef.current.zoom(newScale);
            }
          }}
          className="p-1.5 rounded-md hover:bg-accent"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            if (panzoomRef.current) {
              const currentScale = panzoomRef.current.getScale();
              const newScale = currentScale * 0.8;
              panzoomRef.current.zoom(newScale);
            }
          }}
          className="p-1.5 rounded-md hover:bg-accent"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 