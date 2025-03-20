import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  try {
    // Get diagram ID from the URL search params
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing diagram ID' }, { status: 400 })
    }
    
    // Get the diagram file based on the id parameter
    const filePath = path.join(process.cwd(), 'data/diagrams', `${id}.mmd`)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Return the content
    return NextResponse.json({ content })
  } catch (err) {
    console.error('Error loading diagram:', err)
    return NextResponse.json({ error: 'Failed to load diagram' }, { status: 500 })
  }
} 