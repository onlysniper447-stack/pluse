import { contracts, sampleScanResult, type FindingCategory, type ScanResult, type ScoreTag } from '@/lib/mock-data'

function tagFor(score: number): ScoreTag {
  if (score >= 80) return 'Pass'
  if (score >= 50) return 'Warning'
  return 'Adversarial Hazard'
}

function vectorsFor(score: number, oracle: string) {
  const singleFeed = /single|community|only/i.test(oracle)
  const dual = /dual|pyth\s*\/\s*chainlink|por/i.test(oracle)
  return {
    oracle: Math.max(6, Math.min(99, score + (dual ? 8 : singleFeed ? -22 : -4))),
    resolution: Math.max(8, Math.min(99, score + (dual ? 4 : singleFeed ? -12 : 0))),
    reentrancy: Math.max(12, Math.min(99, score + 6)),
    admin: Math.max(10, Math.min(99, score + (singleFeed ? -18 : 3))),
  }
}

function finding(
  severity: ScanResult['findings'][number]['severity'],
  category: FindingCategory,
  title: string,
  description: string,
): ScanResult['findings'][number] {
  return { severity, category, title, description }
}

function liquidityBook(score: number, tvl: number): Pick<ScanResult, 'oracleQuorum' | 'liquidityUsd' | 'liquidityDeployed' | 'holders'> {
  const deployed = tvl > 0
  const locked = tvl > 0 ? Math.min(tvl, score < 50 ? 184_500 : Math.round(tvl * 0.015)) : 0
  const top = score < 50 ? 72.4 : score < 80 ? 41.2 : 28.6
  const second = score < 50 ? 16.1 : 28.6
  const third = Math.max(4, 100 - top - second - 11.3)
  const usd = (share: number) => Math.round((locked * share) / 100)
  return {
    oracleQuorum: score >= 80 ? 'PASSED' : 'WARNING',
    liquidityUsd: locked || 184_500,
    liquidityDeployed: deployed,
    holders: [
      { address: '0x7dC5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3', tag: 'Pool Creator', share: top, usd: usd(top) },
      { address: '0x4A1f9e2B7c8D3e6F0a5B1c2D3e4F5a6B7c8D9e0F', tag: 'Public Pool', share: second, usd: usd(second) },
      { address: '0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1', tag: 'Big Wallet', share: Number(third.toFixed(1)), usd: usd(third) },
    ],
  }
}

export function resolveScan(input: string): ScanResult {
  const trimmed = input.trim()
  const known = contracts.find((c) => c.address.toLowerCase() === trimmed.toLowerCase())

  if (known) {
    const tag = tagFor(known.score)
    const vectors = vectorsFor(known.score, known.oracle)
    const findings: ScanResult['findings'] = []

    if (known.score >= 80) {
      findings.push(finding('pass', 'oracle', `Oracle path: ${known.oracle}`, 'Feed topology and deviation guards satisfy the institutional threshold.'))
    } else if (/single|community/i.test(known.oracle)) {
      findings.push(finding('critical', 'oracle', 'Centralized resolution authority', `${known.oracle} is a single point of failure. A captured feed or key set can settle against the market.`))
    } else {
      findings.push(finding('warn', 'oracle', `Oracle: ${known.oracle}`, 'Secondary attestation is weak. Recommend a dual-feed with a hard divergence revert.'))
    }

    if (known.risk === 'critical' || known.risk === 'high') {
      findings.push(finding('critical', 'resolution', 'Adversarial resolution edge cases remain open', `Market “${known.title}” does not pin timezone, data vintage, or dispute windows tightly enough.`))
    } else if (known.score < 90) {
      findings.push(finding('warn', 'resolution', 'Residual ambiguity in settlement text', 'One or more edge cases (revision windows, delayed prints) are not explicitly covered.'))
    } else {
      findings.push(finding('pass', 'resolution', 'Resolution clause is well-specified', '14 adversarial scenarios evaluated. No material ambiguity detected.'))
    }

    findings.push(
      finding(
        known.score >= 70 ? 'pass' : 'warn',
        'reentrancy',
        known.score >= 70 ? 'Settlement is non-reentrant' : 'Reentrancy guard not proven',
        known.score >= 70
          ? 'settle() is mutex-gated; no external callback can re-enter payout.'
          : 'Could not prove a reentrancy mutex around settlement. Treat as residual risk.',
      ),
    )

    findings.push(
      finding(
        /community|single/i.test(known.oracle) ? 'critical' : 'pass',
        'admin',
        /community|single/i.test(known.oracle) ? 'Admin key concentration' : 'Timelocked admin path',
        /community|single/i.test(known.oracle)
          ? 'Resolution authority keys are concentrated with the market creator.'
          : 'Admin functions sit behind a public timelock. No EOA can settle unilaterally.',
      ),
    )

    return { score: known.score, tag, vectors, findings, ...liquidityBook(known.score, known.tvl) }
  }

  if (trimmed.startsWith('0x') && trimmed.length === 42) {
    return {
      score: 61,
      tag: 'Warning',
      vectors: { oracle: 70, resolution: 58, reentrancy: 66, admin: 55 },
      ...liquidityBook(61, 3100000),
      findings: [
        finding('warn', 'oracle', 'Oracle graph incomplete', 'Could not resolve feed addresses from unverified bytecode. Treat score as a lower bound.'),
        finding('warn', 'resolution', 'Unindexed contract', 'Address is not in the DreamDEX watchlist. Ran a bytecode-only pass; source verification failed.'),
        finding('pass', 'reentrancy', 'No known reentrancy signature', '0 matches against 1,842 catalogued event-contract vectors.'),
        finding('warn', 'admin', 'Privilege map unverified', 'Owner / timelock slots could not be decoded from unverified bytecode.'),
      ],
    }
  }

  return sampleScanResult
}
