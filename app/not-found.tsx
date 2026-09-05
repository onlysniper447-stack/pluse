import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">404 · SIGNAL LOST</p>
      <h1 className="text-2xl font-semibold text-foreground">Workspace not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        That route is not on the PLUSE terminal. Return to the scanner to continue auditing DreamDEX event contracts.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow-cyan"
      >
        Open Scanner
      </Link>
    </div>
  )
}
