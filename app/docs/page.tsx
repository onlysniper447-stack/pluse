import type { Metadata } from 'next'
import { ApiDocs } from '@/components/docs/api-docs'
import { PageHeader } from '@/components/shell/page-header'

export const metadata: Metadata = {
  title: 'API & MCP Docs — PLUSE',
  description: 'Agent-to-agent endpoint specifications and MCP tool definitions for the PLUSE security agent.',
}

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Agent API / MCP"
        description="Agent-to-agent endpoint specs. Every capability in this UI is exposed as a REST route and an MCP tool."
      />
      <ApiDocs />
    </div>
  )
}
