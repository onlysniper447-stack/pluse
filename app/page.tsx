import { Suspense } from 'react'
import { ScannerWorkspace } from '@/components/scanner/scanner-workspace'

export default function ScannerPage() {
  return (
    <Suspense fallback={null}>
      <ScannerWorkspace />
    </Suspense>
  )
}
