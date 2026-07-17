import { ResourceDecorator as Resource, ExecutionContext } from '@nitrostack/core';
import { FraudPattern } from '../../../types';

export class FraudPatternsResource {
  // Pre-seeded mock fraud indicators
  private patterns: FraudPattern[] = [
    {
      id: 'FP-01',
      name: 'Rapid IP/Location Rotation (Geo-velocity)',
      description: 'AI shopping agent attempts payment validations from disparate regions in short temporal bounds.',
      indicators: ['location_diff_velocity', 'non_domestic_request'],
      riskWeightIncrease: 20,
      firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      severity: 'high'
    },
    {
      id: 'FP-02',
      name: 'Mandate Scope Overwrite (Tampering)',
      description: 'Agent tries transacting with a merchant name that doesn\'t match the cryptographic Cart Mandate intent.',
      indicators: ['merchant_scope_mismatch', 'invalid_ed25519_sig'],
      riskWeightIncrease: 30,
      firstSeen: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      severity: 'critical'
    },
    {
      id: 'FP-03',
      name: 'Agent Burst Velocity',
      description: 'AI model submits a massive flurry of checkout instructions exceeding standard Human-in-the-Loop limits.',
      indicators: ['velocity_1h_threshold_crossed'],
      riskWeightIncrease: 25,
      firstSeen: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      severity: 'medium'
    }
  ];

  @Resource({
    uri: 'fraud-patterns://live',
    name: 'Live Fraud Pattern Indicators Feed',
    description: 'Active indicators of known agentic commerce compromise vectors and compliance rules violations.',
    mimeType: 'application/json'
  })
  async getLivePatterns(uri: string, ctx: ExecutionContext) {
    ctx.logger.info(`Fetching live fraud indicators feed: ${uri}`);
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(this.patterns, null, 2)
      }]
    };
  }
}
