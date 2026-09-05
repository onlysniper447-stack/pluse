export interface LibraryTopic {
  slug: string
  section: 'guides' | 'services' | 'insights'
  titleKey: string
  body: string
}

export const libraryTopics: LibraryTopic[] = [
  {
    slug: 'how-to-audit',
    section: 'guides',
    titleKey: 'guide.audit',
    body: `1. Copy the contract address (it starts with 0x).\n2. Paste it into the search box on the home page.\n3. Press Run Inspection.\n4. Read the three cards: Overall Safety, Price Verification, Rule Clarity.\n5. Check Who controls the money — if one wallet holds more than half the funds, be careful.\n6. If anything is marked DANGER or WARNING, do not deposit until you understand why.`,
  },
  {
    slug: 'risk-scores',
    section: 'guides',
    titleKey: 'guide.scores',
    body: 'The score is from 0 to 100. 80–100 is SAFE: prices and rules look sound. 50–79 is WARNING: something is unclear or thin. Below 50 is DANGER: a single person or a weak price feed could move the result. The number is a first look, not a promise.',
  },
  {
    slug: 'safe-rules',
    section: 'guides',
    titleKey: 'guide.rules',
    body: 'A safe market says exactly when it ends, which price it uses, and what happens in a tie. Dates should include a timezone. “When the season ends” is not enough. If the wording can mean two things, someone can argue the outcome later.',
  },
  {
    slug: 'code-review',
    section: 'services',
    titleKey: 'svc.review',
    body: 'Need a human to read the full code? Request a full code review. We walk through how money moves, who can pause the pool, and whether the written rules match the code. You get a plain-language report you can share with your team.',
  },
  {
    slug: 'watchdog',
    section: 'services',
    titleKey: 'svc.watch',
    body: 'The 24/7 pool watchdog watches live pools after you deposit. If one wallet suddenly owns most of the money, or a price feed goes stale, you get an alert. You can then pause or exit before prices move against you.',
  },
  {
    slug: 'blocked-threats',
    section: 'insights',
    titleKey: 'ins.threats',
    body: 'This list shows recent pools we flagged before people lost money: single-source prices, unclear end dates, and wallets that held more than half the funds. It updates as new pools appear on Somnia.',
  },
  {
    slug: 'price-alerts',
    section: 'insights',
    titleKey: 'ins.feeds',
    body: 'Live price feed alerts tell you when two trusted sources disagree by more than a small band. If they split, settlement should wait. A single source moving alone is a warning, not a green light.',
  },
]

export function getTopic(slug: string) {
  return libraryTopics.find((t) => t.slug === slug)
}
