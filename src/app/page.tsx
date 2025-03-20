"use client"

import { useState, useEffect } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Textarea } from "@/components/ui/textarea"
import { ChangeEvent } from "react"
import { MermaidRenderer } from "@/components/ui/mermaid-renderer"

// Initial sample Mermaid class diagram
const sampleMermaidDiagram = `classDiagram
    namespace Application {
        class User {
            -String id
            -String username
            -String email
            -String password
            +getProfile() Profile
            +updateCredentials(username, email) bool
            +validatePassword(password) bool
        }

        class Profile {
            -String userId
            -String fullName
            -Date birthDate
            -Address address
            +updatePersonalInfo(fullName, birthDate) void
            +setAddress(address) void
        }

        class Address {
            -String street
            -String city
            -String state
            -String zipCode
            -String country
            +formatAddress() String
        }
    }

    namespace Authentication {
        class AuthService {
            -UserRepository userRepo
            +login(username, password) Token
            +logout(token) void
            +register(userInfo) User
            +validateToken(token) bool
        }

        class Token {
            -String value
            -Date expirationDate
            -String userId
            +isExpired() bool
            +refresh() Token
        }
    }

    User "1" --> "1" Profile : has
    Profile "1" --> "1" Address : contains
    AuthService --> User : manages
    AuthService --> Token : generates`;

export default function Home() {
  const [umlText, setUmlText] = useState(sampleMermaidDiagram)

  return (
    <main className="h-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen"
      >
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="flex h-full items-center justify-center p-6">
            <Textarea
              className="h-full w-full font-mono resize-none"
              placeholder="Enter your Mermaid diagram code here..."
              value={umlText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setUmlText(e.target.value)}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <div className="flex h-full items-center justify-center p-6">
            <div className="rounded border h-full w-full p-4 overflow-auto">
              <MermaidRenderer diagram={umlText} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}
