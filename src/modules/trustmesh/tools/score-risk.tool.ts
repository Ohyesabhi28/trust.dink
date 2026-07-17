import { ToolDecorator as Tool, z, ExecutionContext, Inject, Injectable } from '@nitrostack/core';
import { RiskEngineService } from '../services/risk-engine.service';
import { AuditLogService } from '../services/audit-log.service';

@Injectable({ deps: [RiskEngineService, AuditLogService] })
export class ScoreRiskTool {
  constructor(
    @Inject(RiskEngineService) private readonly riskEngine: RiskEngineService,
    @Inject(AuditLogService) private readonly auditLog: AuditLogService
  ) {}

  @Tool({
    name: 'score_transaction_risk',
    description: 'Calculates transaction risk using clear, rule-weighted heuristics satisfying RBI transparency and explainability standards.',
    inputSchema: z.object({
      mandateId: z.string().describe('Mandate identifier to query scope parameters'),
      amount: z.number().describe('Transaction clearing amount'),
      merchantCategory: z.string().describe('The name or category of the clearing merchant'),
      agentId: z.string().describe('Identifier of the shopping agent requestor'),
      requestGeo: z.string().describe('Geographic code of the agent request origin'),
      userHomeGeo: z.string().describe('Registered domestic home geographic region of the user'),
      transactionVelocity1h: z.number().optional().describe('Optional override velocity count. If omitted, uses historical data.'),
      signatureInvalid: z.boolean().optional().describe('Pre-evaluated signature verification flag (true if invalid)')
    })
  })
  async scoreTransaction(
    input: {
      mandateId: string;
      amount: number;
      merchantCategory: string;
      agentId: string;
      requestGeo: string;
      userHomeGeo: string;
      transactionVelocity1h?: number;
      signatureInvalid?: boolean;
    },
    ctx: ExecutionContext
  ) {
    ctx.logger.info(`Evaluating transaction risk score for mandate: ${input.mandateId}`, { agent: input.agentId });

    const assessment = this.riskEngine.scoreTransaction(input);

    // Audit score result
    this.auditLog.log('score', input.agentId, {
      mandateId: input.mandateId,
      amount: input.amount,
      riskScore: assessment.riskScore,
      recommendation: assessment.recommendation,
      factorsTriggered: assessment.riskFactors.filter(f => f.triggered).map(f => f.factor)
    });

    ctx.logger.info(`Risk scoring complete. Composite Score: ${assessment.riskScore}, Recommendation: ${assessment.recommendation.toUpperCase()}`);

    return assessment;
  }
}
