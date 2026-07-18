import { ToolDecorator as Tool, z, ExecutionContext, Inject, Injectable, Widget } from '@nitrostack/core';
import { AuditLogService } from '../services/audit-log.service';

@Injectable({ deps: [AuditLogService] })
export class QueryAuditLedgerTool {
  constructor(
    @Inject(AuditLogService) private readonly auditLog: AuditLogService
  ) {}

  @Tool({
    name: 'query_audit_ledger',
    description: 'Allows an auditing AI agent or human compliance officer to query the immutable SHA-256 chained audit logs using semantic filters (date ranges, target IDs, actions).',
    inputSchema: z.object({
      startDate: z.string().optional().describe('ISO 8601 start date'),
      endDate: z.string().optional().describe('ISO 8601 end date'),
      action: z.enum(['verify', 'score', 'kill_switch', 'trust_graph', 'escalate', 'revoke']).optional().describe('Filter by specific audit action'),
      actorId: z.string().optional().describe('Filter by specific actor ID')
    })
  })
  @Widget('audit-ledger')
  async queryAuditLedger(
    input: {
      startDate?: string;
      endDate?: string;
      action?: string;
      actorId?: string;
    },
    ctx: ExecutionContext
  ) {
    ctx.logger.info(`Querying audit ledger with filters: ${JSON.stringify(input)}`);

    let logs = this.auditLog.getLogs();

    if (input.startDate) {
      const start = new Date(input.startDate).getTime();
      logs = logs.filter(log => new Date(log.timestamp).getTime() >= start);
    }
    
    if (input.endDate) {
      const end = new Date(input.endDate).getTime();
      logs = logs.filter(log => new Date(log.timestamp).getTime() <= end);
    }

    if (input.action) {
      logs = logs.filter(log => log.action === input.action);
    }

    if (input.actorId) {
      logs = logs.filter(log => log.actorId === input.actorId);
    }

    ctx.logger.info(`Found ${logs.length} audit log entries matching criteria.`);

    return {
      totalMatches: logs.length,
      entries: logs
    };
  }
}
