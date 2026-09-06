import { libraryTopics } from '@/lib/library'
import { LibraryClient } from './library-client'

export function generateStaticParams() {
  return libraryTopics.map((topic) => ({ slug: topic.slug }))
}

export default async function LibraryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <LibraryClient slug={slug} />
}
