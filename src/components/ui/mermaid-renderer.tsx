"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
  diagram: string;
}

export function MermaidRenderer({ diagram }: MermaidRendererProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

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
        
        // Generate a unique ID for the diagram
        const uniqueId = `mermaid-${Date.now()}`;
        
        // Use mermaid API to render the diagram to SVG
        const { svg: renderedSvg } = await mermaid.render(uniqueId, diagram);
        
        // Set the SVG content
        setSvg(renderedSvg);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(`Failed to render diagram: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    // Using a small delay to ensure that the diagram is processed
    const timer = setTimeout(() => {
      renderDiagram();
    }, 100);

    return () => clearTimeout(timer);
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
    <div 
      ref={containerRef}
      className="flex h-full w-full items-center justify-center overflow-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
} 