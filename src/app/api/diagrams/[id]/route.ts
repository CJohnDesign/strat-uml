import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'data/diagrams', `${params.id}.mmd`)
    const content = await fs.readFile(filePath, 'utf-8')
    return new NextResponse(content)
  } catch (error) {
    return new NextResponse('Failed to load diagram', { status: 500 })
  }
} 