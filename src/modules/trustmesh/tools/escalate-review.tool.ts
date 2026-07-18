import { ToolDecorator as Tool, z, ExecutionContext, Inject, Injectable, Widget } from '@nitrostack/core';
import { StateService } from '../services/state.service';
import { AuditLogService } from '../services/audit-log.service';

@Injectable({ deps: [StateService, AuditLogService] })
export class EscalateReviewTool {
  constructor(
    @Inject(StateService) private readonly stateService: StateService,
    @Inject(AuditLogService) private readonly auditLog: AuditLogService
  ) {}

  @Tool({
    name: 'escalate_to_manual_review',
    description: 'Explicitly routes a borderline transaction into a human compliance queue, rather than auto-approving or auto-blocking.',
    inputSchema: z.object({
      mandateId: z.string().describe('Exact ID of the mandate to escalate'),
      reason: z.string().describe('Mandatory reason for manual review routing')
    })
  })
  @Widget('escalate-review')
  async escalateToManualReview(
    input: {
      mandateId: string;
      reason: string;
    },
    ctx: ExecutionContext
  ) {
    ctx.logger.warn(`Escalation Requested for Mandate: ${input.mandateId}`);

    const mandate = this.stateService.getMandate(input.mandateId);
    if (!mandate) {
      throw new Error(`Mandate ${input.mandateId} not found in state registry.`);
    }

    this.stateService.escalateToReview(input.mandateId, input.reason);

    const auditEntry = this.auditLog.log('escalate', mandate.signerPublicKeyId, {
      mandateId: input.mandateId,
      reason: input.reason
    });

    ctx.logger.info(`Mandate ${input.mandateId} escalated to manual review queue.`);

    return {
      escalated: true,
      reviewQueueCount: this.stateService.getReviewQueue().length,
      auditLogEntryId: auditEntry.id,
      timestamp: new Date().toISOString()
    };
  }
}
