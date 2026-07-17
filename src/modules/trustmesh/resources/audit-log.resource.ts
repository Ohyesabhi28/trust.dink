import { ResourceDecorator as Resource, ExecutionContext, Inject, Injectable } from '@nitrostack/core';
import { AuditLogService } from '../services/audit-log.service';

@Injectable()
export class AuditLogResource {
  constructor(
    @Inject(AuditLogService) private readonly auditLog: AuditLogService
  ) {}

  @Resource({
    uri: 'audit-log://transactions',
    name: 'Tamper-Evident Transaction Validation Audit Log',
    description: 'Chained transaction verification, override, and compliance action trail ensuring complete operational auditability.',
    mimeType: 'application/json'
  })
  async getAuditLog(uri: string, ctx: ExecutionContext) {
    ctx.logger.info(`Reading transaction audit log feed: ${uri}`);
    
    const logs = this.auditLog.getLogs();
    
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(logs, null, 2)
      }]
    };
  }
}
