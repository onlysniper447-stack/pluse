'use client'

import Link from 'next/link'
import { getTopic } from '@/lib/library'
import { useI18n } from '@/lib/i18n'
import { Panel } from '@/components/ui/panel'

export function LibraryClient({ slug }: { slug: string }) {
  const { t } = useI18n()
  const topic = getTopic(slug)

  if (!topic) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">Topic not found.</p>
        <Link href="/" className="mt-3 inline-block text-sm text-emerald">
          {t('nav.scanner')}
        </Link>
      </div>
    )
  }

  const sectionLabel =
    topic.section === 'services' ? t('shell.services') : topic.section === 'insights' ? t('shell.insights') : t('shell.guides')

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">{sectionLabel}</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">{t(topic.titleKey)}</h1>
      <Panel className="mt-5 whitespace-pre-line border-slate-800 p-5 text-sm leading-relaxed text-slate-300">{topic.body}</Panel>
    </div>
  )
}
