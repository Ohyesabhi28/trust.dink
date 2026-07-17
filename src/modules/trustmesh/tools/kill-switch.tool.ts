import { ToolDecorator as Tool, z, ExecutionContext, Inject } from '@nitrostack/core';
import { StateService } from '../services/state.service';
import { AuditLogService } from '../services/audit-log.service';
import { KillSwitchEntry, KillSwitchAction, KillSwitchTargetType } from '../../../types';

export class KillSwitchTool {
  constructor(
    @Inject(StateService) private readonly stateService: StateService,
    @Inject(AuditLogService) private readonly auditLog: AuditLogService
  ) {}

  @Tool({
    name: 'kill_switch_override',
    description: 'Enforces human-in-the-loop kill switches to instantly block/suspend/resume transacting capabilities of agents, mandates or transactions in compliance with RBI MRM guidelines.',
    inputSchema: z.object({
      targetType: z.enum(['agent', 'mandate', 'transaction']).describe('Entity type to modify control level'),
      targetId: z.string().describe('Exact ID of the targeted agent, mandate, or transaction'),
      action: z.enum(['suspend', 'resume', 'block']).describe('Action override to enforce'),
      reason: z.string().describe('Mandatory justification for regulatory compliance audits'),
      actorId: z.string().describe('Compliance officer ID enacting override')
    })
  })
  async killSwitchOverride(
    input: {
      targetType: KillSwitchTargetType;
      targetId: string;
      action: KillSwitchAction;
      reason: string;
      actorId: string;
    },
    ctx: ExecutionContext
  ) {
    ctx.logger.warn(`Compliance Override Requested! Actor: ${input.actorId}, Target: ${input.targetType}:${input.targetId}, Action: ${input.action.toUpperCase()}`);

    // 1. Log to immutable audit log first
    const auditEntry = this.auditLog.log('kill_switch', input.actorId, {
      targetType: input.targetType,
      targetId: input.targetId,
      action: input.action,
      reason: input.reason
    });

    // 2. Persist in state registry
    const entry: KillSwitchEntry = {
      targetType: input.targetType,
      targetId: input.targetId,
      action: input.action,
      reason: input.reason,
      actorId: input.actorId,
      appliedAt: new Date().toISOString(),
      auditLogEntryId: auditEntry.id
    };

    this.stateService.applyKillSwitch(entry);

    ctx.logger.info(`Kill Switch successfully updated for: ${input.targetType}:${input.targetId}. Action: ${input.action}`);

    return {
      confirmed: true,
      auditLogEntryId: auditEntry.id,
      timestamp: entry.appliedAt
    };
  }
}
