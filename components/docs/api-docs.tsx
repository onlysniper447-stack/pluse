'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Network, Cpu, Lock, Globe } from 'lucide-react'
import { Panel, PanelHeader, Tag } from '@/components/ui/panel'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Method = 'GET' | 'POST' | 'WS'

interface Endpoint {
  id: string
  method: Method
  path: string
  summary: string
  auth: 'public' | 'api-key' | 'siwe'
  request?: string
  response: string
}

const endpoints: Endpoint[] = [
  {
    id: 'scan',
    method: 'POST',
    path: '/api/v1/scan',
    summary: 'Run a full adversarial audit on a contract address or raw resolution logic.',
    auth: 'api-key',
    request: `{
  "target": "0x4A1f9e2B7c8D3e6F0a5B1c2D3e4F5a6B7c8D9e0F",
  "chainId": 50312,
  "depth": "full",          // "quick" | "full"
  "vectors": ["oracle", "resolution", "reentrancy", "admin"]
}`,
    response: `{
  "scanId": "scn_01J7Q9…",
  "score": 87,
  "tag": "Pass",
  "vectors": {
    "resolution": { "score": 82, "findings": 1 },
    "oracle":     { "score": 96, "findings": 0 },
    "reentrancy": { "score": 94, "findings": 0 },
    "admin":      { "score": 91, "findings": 0 }
  },
  "stream": "wss://api.pluse.xyz/v1/scan/scn_01J7Q9…/events"
}`,
  },
  {
    id: 'scan-stream',
    method: 'WS',
    path: '/v1/scan/{scanId}/events',
    summary: 'Server-push execution log — identical to what the Scanner terminal renders.',
    auth: 'api-key',
    response: `{ "ts": "11:42:07.113", "step": "oracle.parse", "status": "ok",
  "label": "Parsing Oracle Dependencies", "detail": "Found 2 feeds: Pyth, Chainlink" }
{ "ts": "11:42:08.902", "step": "resolution.adversarial", "status": "warn",
  "label": "Evaluating Adversarial Resolution Edge Cases", "detail": "14 scenarios · 1 ambiguity" }`,
  },
  {
    id: 'contracts',
    method: 'GET',
    path: '/api/v1/contracts?category=Crypto&risk=high',
    summary: 'List monitored DreamDEX event contracts with live risk classification.',
    auth: 'public',
    response: `{
  "items": [{
    "address": "0x9fA0b1C2d3E4f5A6b7C8d9E0f1A2b3C4d5E6f7A8",
    "title": "SOMI market cap > $5B",
    "category": "Crypto", "risk": "high", "score": 42,
    "tvl": 3100000, "oracle": "Single CoinGecko relay"
  }],
  "cursor": null
}`,
  },
  {
    id: 'kpis',
    method: 'GET',
    path: '/api/v1/kpis',
    summary: 'System-wide KPIs powering the Dashboard metric grid.',
    auth: 'public',
    response: `{
  "totalValueProtected": 184320000,
  "activeContracts": 1284,
  "flaggedExploits": 37,
  "safetyIndex": 92.4,
  "asOfBlock": 48213907
}`,
  },
  {
    id: 'leaderboard',
    method: 'GET',
    path: '/api/v1/leaderboard?epoch=42&type=agent',
    summary: 'Creator and agent trust rankings by clean-audit pass rate.',
    auth: 'public',
    response: `{
  "epoch": 42,
  "items": [{
    "rank": 2, "address": "0xB2c3…B0c1", "handle": "sentinel-agent-v3",
    "isAgent": true, "marketsCreated": 402, "passRate": 98.7, "grade": "A+"
  }]
}`,
  },
]

const mcpTools = [
  {
    name: 'pluse.scan_contract',
    description: 'Audit an event contract. Returns score, tag, and vector findings.',
    schema: `{ target: string; depth?: "quick" | "full" }`,
  },
  {
    name: 'pluse.get_risk',
    description: 'Fetch cached risk classification for a contract address.',
    schema: `{ address: \`0x\${string}\` }`,
  },
  {
    name: 'pluse.list_threats',
    description: 'Stream recent threat logs filtered by vector or severity.',
    schema: `{ vector?: string; severity?: "info" | "warn" | "critical"; limit?: number }`,
  },
  {
    name: 'pluse.creator_trust',
    description: 'Look up a creator or agent trust grade before interacting with their markets.',
    schema: `{ address: \`0x\${string}\` }`,
  },
]

const methodTone: Record<Method, 'emerald' | 'cyan' | 'amber'> = { GET: 'emerald', POST: 'cyan', WS: 'amber' }
const authIcon = { public: Globe, 'api-key': Lock, siwe: Cpu } as const

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="relative">
      <pre className="terminal-scroll overflow-x-auto rounded-md border border-border bg-background/80 p-3 font-mono text-[11px] leading-relaxed text-foreground/90">
        {code}
      </pre>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(code)
          setCopied(true)
          setTimeout(() => setCopied(false), 1400)
        }}
        aria-label="Copy code"
        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-sm border border-border bg-surface text-muted-foreground hover:text-primary"
      >
        {copied ? <Check className="size-3.5 text-emerald" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  )
}

export function ApiDocs() {
  const [active, setActive] = useState(endpoints[0].id)
  const ep = endpoints.find((e) => e.id === active)!

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* Endpoint index */}
      <Panel className="lg:col-span-4">
        <PanelHeader eyebrow="REST · v1" title="Endpoints" action={<Tag tone="muted">base: api.pluse.xyz</Tag>} />
        <motion.ul variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col divide-y divide-border">
          {endpoints.map((e) => (
            <motion.li key={e.id} variants={fadeUp}>
              <button
                type="button"
                onClick={() => setActive(e.id)}
                className={cn(
                  'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent',
                  active === e.id && 'bg-accent',
                )}
              >
                <Tag tone={methodTone[e.method]} className="mt-0.5 w-12 justify-center">
                  {e.method}
                </Tag>
                <div className="min-w-0">
                  <p className={cn('truncate font-mono text-xs', active === e.id ? 'text-primary' : 'text-foreground')}>
                    {e.path}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{e.summary}</p>
                </div>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </Panel>

      {/* Endpoint detail */}
      <div className="flex flex-col gap-4 lg:col-span-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={ep.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Panel>
              <PanelHeader
                eyebrow="Specification"
                title={ep.path}
                action={
                  <Tag tone={ep.auth === 'public' ? 'emerald' : 'amber'}>
                    {(() => {
                      const Icon = authIcon[ep.auth]
                      return <Icon className="size-3" />
                    })()}
                    {ep.auth}
                  </Tag>
                }
              />
              <div className="flex flex-col gap-4 p-4">
                <p className="text-sm text-muted-foreground">{ep.summary}</p>
                {ep.request && (
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Request body</span>
                    <CodeBlock code={ep.request} />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {ep.method === 'WS' ? 'Event frames' : 'Response 200'}
                  </span>
                  <CodeBlock code={ep.response} />
                </div>
              </div>
            </Panel>
          </motion.div>
        </AnimatePresence>

        {/* MCP tools */}
        <Panel>
          <PanelHeader
            eyebrow="Model Context Protocol"
            title="MCP tool surface"
            action={
              <Tag tone="cyan">
                <Network className="size-3" /> mcp.pluse.xyz/sse
              </Tag>
            }
          />
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {mcpTools.map((t) => (
              <div key={t.name} className="flex flex-col gap-1.5 bg-surface/80 p-4">
                <code className="font-mono text-xs font-semibold text-primary">{t.name}</code>
                <p className="text-xs leading-relaxed text-muted-foreground">{t.description}</p>
                <code className="mt-1 font-mono text-[11px] text-foreground/70">{t.schema}</code>
              </div>
            ))}
          </div>
          <div className="border-t border-border p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Client config</span>
            <div className="mt-1.5">
              <CodeBlock
                code={`{
  "mcpServers": {
    "pluse": {
      "url": "https://mcp.pluse.xyz/sse",
      "headers": { "Authorization": "Bearer <PLUSE_API_KEY>" }
    }
  }
}`}
              />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
