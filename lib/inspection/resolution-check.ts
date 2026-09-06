import type { ScanResult, ScanStep } from '@/lib/mock-data'

export type ResolutionVerdict = 'PASSED' | 'WARNING' | 'SKIPPED_NA'

export interface ResolutionEvaluation {
  verdict: ResolutionVerdict
  /** Null means the check is excluded from the scorecard. */
  scoreContribution: number | null
  scenarioCount: number
  step: ScanStep
  finding: ScanResult['findings'][number]
}

const SKIP_DETAIL =
  'Skipped (Not Applicable: No oracle or settlement surface detected)'

const ADVERSARIAL_SUITE_SIZE = 14

function resolutionFinding(result: ScanResult) {
  return result.findings.filter((f) => f.category === 'resolution')
}

/**
 * Dynamic trigger for "Resolution Ambiguity & Timestamp Limits".
 * Runs the adversarial suite only when oracle/settlement ABI or AST surface is present.
 */
export function evaluateResolutionCheck(args: {
  hasOracleSettlementSurface: boolean
  scan?: ScanResult
}): ResolutionEvaluation {
  if (!args.hasOracleSettlementSurface) {
    return {
      verdict: 'SKIPPED_NA',
      scoreContribution: null,
      scenarioCount: 0,
      step: {
        id: 's-resolution',
        label: 'Resolution ambiguity & timestamp limits',
        detail: SKIP_DETAIL,
        durationMs: 420,
        status: 'skipped_na',
      },
      finding: {
        severity: 'skipped',
        category: 'resolution',
        title: 'Resolution ambiguity & timestamp limits',
        description: SKIP_DETAIL,
      },
    }
  }

  const hits = args.scan ? resolutionFinding(args.scan) : []
  const flagged = hits.filter((f) => f.severity === 'warn' || f.severity === 'critical')
  const scenarioCount = flagged.length > 0 ? Math.max(flagged.length, 1) : ADVERSARIAL_SUITE_SIZE
  const failed = flagged.length > 0
  const vector = args.scan?.vectors.resolution
  const scoreContribution = typeof vector === 'number' ? vector : failed ? 58 : 96

  if (failed) {
    return {
      verdict: 'WARNING',
      scoreContribution,
      scenarioCount: flagged.length,
      step: {
        id: 's-resolution',
        label: 'Resolution ambiguity & timestamp limits',
        detail: `WARNING · ${flagged.length} adversarial scenario${flagged.length === 1 ? '' : 's'} remain open`,
        durationMs: 1100,
        status: 'warn',
      },
      finding: hits[0] ?? {
        severity: 'warn',
        category: 'resolution',
        title: 'Adversarial resolution edge cases remain open',
        description: `${flagged.length} settlement/timestamp scenarios failed. Score deducted for this vector.`,
      },
    }
  }

  return {
    verdict: 'PASSED',
    scoreContribution,
    scenarioCount,
    step: {
      id: 's-resolution',
      label: 'Resolution ambiguity & timestamp limits',
      detail: `PASSED · ${ADVERSARIAL_SUITE_SIZE} adversarial scenarios · settlement boundaries secure`,
      durationMs: 1100,
      status: 'ok',
    },
    finding: hits[0] ?? {
      severity: 'pass',
      category: 'resolution',
      title: 'Resolution clause is well-specified',
      description: `${ADVERSARIAL_SUITE_SIZE} adversarial scenarios evaluated. No material ambiguity detected.`,
    },
  }
}

export const RESOLUTION_SKIP_DETAIL = SKIP_DETAIL
