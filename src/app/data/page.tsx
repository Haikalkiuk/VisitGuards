'use client'

import React, { Suspense } from 'react'
import { Layout } from '@/components/layout'
import DataPageContent from './data-content'

export default function DataPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <DataPageContent />
      </Suspense>
    </Layout>
  )
}
