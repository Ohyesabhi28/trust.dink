import { AuditLogService } from './src/modules/trustmesh/services/audit-log.service';
import { QueryAuditLedgerTool } from './src/modules/trustmesh/tools/query-audit-ledger.tool';

async function runTest() {
  const auditLogService = new AuditLogService();
  
  // Seed a log
  auditLogService.log('verify', 'test-actor-1', { msg: 'Hello' });

  const tool = new QueryAuditLedgerTool(auditLogService);
  
  const result = await tool.queryAuditLedger({ action: 'verify' }, {
    logger: { info: console.log, warn: console.warn, error: console.error } as any
  } as any);

  console.log('Tool Result:', result);
}

runTest().catch(console.error);
