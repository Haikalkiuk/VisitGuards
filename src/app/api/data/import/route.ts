import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let data: any[] = []

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // Parse Excel file
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      data = XLSX.utils.sheet_to_json(worksheet)
    } else if (file.name.endsWith('.csv')) {
      // Parse CSV file
      const csvText = buffer.toString('utf-8')
      const lines = csvText.split('\n')
      const headers = lines[0].split(',')
      
      data = lines.slice(1).map(line => {
        const values = line.split(',')
        const obj: any = {}
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim()
        })
        return obj
      }).filter(row => Object.keys(row).length > 1)
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload CSV or Excel files.' },
        { status: 400 }
      )
    }

    // Process and validate data
    const processedData = data.map((row, index) => {
      // Map CSV headers to database fields
      return {
        id: row['ID'] || `imported-${Date.now()}-${index}`,
        date: new Date(row['Tanggal'] || row['Date'] || Date.now()).toISOString(),
        plantId: row['ID Tanaman'] || row['Plant ID'] || '',
        status: row['Status'] || 'unknown',
        confidence: parseFloat(row['Confidence']?.replace('%', '') || '0') / 100,
        location: row['Lokasi'] || row['Location'] || ''
      }
    }).filter(item => item.plantId) // Filter out empty rows

    // In production, save to database here
    console.log('Processed data:', processedData)

    return NextResponse.json({
      message: 'Data imported successfully',
      imported: processedData.length,
      data: processedData
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to import data: ' + (error as Error).message },
      { status: 500 }
    )
  }
}