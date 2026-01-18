import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

// Mock data - in production, this would come from your database
const mockData = [
  {
    id: '1',
    date: '2024-01-15T08:30:00',
    plantId: 'VINE-001',
    status: 'healthy',
    confidence: 0.95,
    location: 'Area A - Plot 1'
  },
  {
    id: '2',
    date: '2024-01-15T09:15:00',
    plantId: 'VINE-002',
    status: 'diseased',
    confidence: 0.87,
    location: 'Area B - Plot 2'
  },
  {
    id: '3',
    date: '2024-01-15T10:00:00',
    plantId: 'VINE-003',
    status: 'pest',
    confidence: 0.92,
    location: 'Area A - Plot 3'
  },
  {
    id: '4',
    date: '2024-01-15T10:45:00',
    plantId: 'VINE-004',
    status: 'nutrient_deficient',
    confidence: 0.83,
    location: 'Area C - Plot 1'
  },
  {
    id: '5',
    date: '2024-01-14T14:20:00',
    plantId: 'VINE-005',
    status: 'healthy',
    confidence: 0.96,
    location: 'Area B - Plot 1'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    
    if (format === 'excel') {
      // Create Excel workbook
      const ws = XLSX.utils.json_to_sheet(mockData.map(item => ({
        'ID': item.id,
        'Tanggal': new Date(item.date).toLocaleString('id-ID'),
        'ID Tanaman': item.plantId,
        'Status': item.status,
        'Confidence': `${(item.confidence * 100).toFixed(1)}%`,
        'Lokasi': item.location
      })))
      
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Leaf Data')
      
      // Generate buffer
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
      
      // Return Excel file
      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="leaf_data.xlsx"'
        }
      })
    } else {
      // Create CSV
      const headers = ['ID', 'Tanggal', 'ID Tanaman', 'Status', 'Confidence', 'Lokasi']
      const csvContent = [
        headers.join(','),
        ...mockData.map(item => [
          item.id,
          new Date(item.date).toLocaleString('id-ID'),
          item.plantId,
          item.status,
          `${(item.confidence * 100).toFixed(1)}%`,
          item.location
        ].join(','))
      ].join('\n')
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="leaf_data.csv"'
        }
      })
    }
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}