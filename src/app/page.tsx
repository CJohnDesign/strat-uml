"use client"

import { useState, useEffect, useRef } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Textarea } from "@/components/ui/textarea"
import { ChangeEvent } from "react"
import { MermaidRenderer } from "@/components/ui/mermaid-renderer"
import { Navbar } from "@/components/ui/navbar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as htmlToImage from 'html-to-image'

// Add custom style to hide the divider completely
import "./resizable-custom.css"

// Stratia system architecture diagram
const sampleMermaidDiagram = `classDiagram
    class ParryLabsAnd3PHW {
        Parry Labs and 3P HW
    }

    class HypervisorType2 {
        Hypervisor (Type 2)
    }
    ParryLabsAnd3PHW *-- HypervisorType2

    class UbuntuJetpack {
        Ubuntu 22.0+ / Jetpack
    }
    HypervisorType2 *-- UbuntuJetpack

    class GPUAccelerated {
        GPU Accelerated
    }
    class VideoTranscode {
        Video Transcode
    }
    GPUAccelerated *-- VideoTranscode
    UbuntuJetpack *-- GPUAccelerated

    class HypervisorType1 {
        Hypervisor (Type 1)
    }
    ParryLabsAnd3PHW *-- HypervisorType1

    class UbuntuPlus {
        Ubuntu 22.0+
    }
    HypervisorType1 *-- UbuntuPlus

    class GCIACore {
        GCIA Core
    }
    class GCIA {
        GCIA
    }
    class Cyber {
        Cyber
    }
    GCIACore *-- GCIA
    GCIACore *-- Cyber
    UbuntuPlus *-- GCIACore

    class IO {
        I/O
    }
    class IOPs {
        IOPs
    }
    class ROS {
        ROS
    }
    IO *-- IOPs
    IO *-- ROS
    UbuntuPlus *-- IO

    class CoP {
        CoP
    }
    class Map {
        Map
    }
    class TAK {
        TAK
    }
    class UVC {
        UVC
    }
    CoP *-- Map
    CoP *-- TAK
    CoP *-- UVC
    UbuntuPlus *-- CoP

    class VoIP {
        VoIP
    }
    class VoIP_TBD {
        TBD
    }
    VoIP *-- VoIP_TBD
    UbuntuPlus *-- VoIP

    class SensorFusion {
        Sensor Fusion
    }
    class SF_TBD {
        TBD
    }
    SensorFusion *-- SF_TBD
    UbuntuPlus *-- SensorFusion

    class Docs {
        Docs
    }
    class ManualRepo {
        Manual Repo
    }
    Docs *-- ManualRepo
    UbuntuPlus *-- Docs

    class RadioControl {
        Radio Control
    }
    class MLCPRM {
        MLCP-RM
    }
    RadioControl *-- MLCPRM
    UbuntuPlus *-- RadioControl

    class UnlimitedAccess {
        Unlimited Access
    }
    class Logger {
        Logger
    }
    UnlimitedAccess *-- Logger
    UbuntuPlus *-- UnlimitedAccess

    class SmartRouting {
        Smart Routing
    }
    class ModRF {
        ModRF
    }
    class Velocio {
        Velocio
    }
    class Other {
        Other
    }
    SmartRouting *-- ModRF
    SmartRouting *-- Velocio
    SmartRouting *-- Other
    UbuntuPlus *-- SmartRouting`;

export default function Home() {
  const [activeDiagram, setActiveDiagram] = useState('stratia-namespaced-3-1')
  const [umlText, setUmlText] = useState('')
  const svgContainerRef = useRef<HTMLDivElement>(null)

  // Load initial diagram content
  useEffect(() => {
    handleDiagramChange('stratia-namespaced-3-1')
  }, [])

  // Download diagram using html-to-image library with high resolution
  const downloadDiagram = () => {
    if (!svgContainerRef.current) {
      console.error('SVG container not found');
      return;
    }
    
    // Use html-to-image to capture the diagram
    htmlToImage.toPng(svgContainerRef.current, {
      backgroundColor: '#13151B', // Dark navy background
      quality: 1,
      pixelRatio: 4 // 4x resolution for higher quality export
    })
    .then(function (dataUrl) {
      // Create download link
      const link = document.createElement('a');
      link.download = 'stratia-diagram.png';
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error) {
      console.error('Error capturing diagram:', error);
      alert('Failed to download diagram. Please try again.');
    });
  };

  // Set up download button event listener
  useEffect(() => {
    const downloadButton = document.getElementById('download-svg-button')
    
    if (downloadButton) {
      downloadButton.addEventListener('click', downloadDiagram)
      
      return () => {
        downloadButton.removeEventListener('click', downloadDiagram)
      }
    }
  }, [])

  const handleDiagramChange = async (diagramId: string) => {
    try {
      const response = await fetch(`/api/diagrams/${diagramId}`)
      const data = await response.text()
      setUmlText(data)
      setActiveDiagram(diagramId)
    } catch (error) {
      console.error('Failed to load diagram:', error)
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <Navbar 
        activeDiagram={activeDiagram} 
        onDiagramChange={handleDiagramChange} 
      />
      <main className="flex-1 w-full relative">
        <ResizablePanelGroup
          direction="vertical"
          className="h-full w-full lg:flex-row [&[data-panel-group-direction=vertical]]:flex-col lg:[&[data-panel-group-direction=vertical]]:flex-row"
        >
          <ResizablePanel 
            defaultSize={30} 
            minSize={20}
            maxSize={50}
            className="order-2 lg:order-1"
          >
            <div className="flex flex-col h-full">
              <div className="flex flex-1 items-center justify-center p-4">
                <Textarea
                  className="h-full w-full font-mono resize-none border-0 focus-visible:ring-0"
                  placeholder="Enter your Mermaid diagram code here..."
                  value={umlText}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setUmlText(e.target.value)}
                />
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle className="no-divider" />
          
          <ResizablePanel 
            defaultSize={70}
            className="order-1 lg:order-2"
          >
            <div className="flex h-full items-center justify-center p-4">
              <div ref={svgContainerRef} className="h-full w-full overflow-auto">
                <MermaidRenderer diagram={umlText} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
