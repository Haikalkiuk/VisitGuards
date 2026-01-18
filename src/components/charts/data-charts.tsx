'use client'

import React from 'react'
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts'

interface DataChartsProps {
  type: 'line' | 'bar' | 'pie'
  data: any[]
  xAxisKey?: string
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#f97316']

export function DataCharts({ type, data, xAxisKey = 'date' }: DataChartsProps) {
  try {
    if (type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="healthy" stroke="#10b981" name="Sehat" strokeWidth={2} />
            <Line type="monotone" dataKey="diseased" stroke="#ef4444" name="Sakit" strokeWidth={2} />
            <Line type="monotone" dataKey="pest" stroke="#f59e0b" name="Hama" strokeWidth={2} />
            <Line type="monotone" dataKey="nutrient_deficient" stroke="#f97316" name="Kekurangan Nutrisi" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    if (type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="healthy" fill="#10b981" name="Sehat" />
            <Bar dataKey="diseased" fill="#ef4444" name="Sakit" />
            <Bar dataKey="pest" fill="#f59e0b" name="Hama" />
            <Bar dataKey="nutrient_deficient" fill="#f97316" name="Kekurangan Nutrisi" />
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )
    }

    return <div>Unknown chart type</div>
  } catch (error) {
    console.error('Chart rendering error:', error)
    return (
      <div className="h-64 flex items-center justify-center bg-red-50 rounded-lg">
        <p className="text-red-600">Gagal memuat grafik</p>
      </div>
    )
  }
}