import type { Metadata } from 'next'
import { ApiDocs } from '@/components/docs/api-docs'
import { PageHeader } from '@/components/shell/page-header'

export const metadata: Metadata = {
  title: 'API & MCP Docs — PLUSE',
  description: 'Developer security API for the PLUSE agent.',
}

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Developer Security API"
        description="Endpoints you can call from another app or agent."
      />
      <ApiDocs />
    </div>
  )
}
