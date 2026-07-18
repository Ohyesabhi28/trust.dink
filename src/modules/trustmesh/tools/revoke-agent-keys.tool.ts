import { ToolDecorator as Tool, z, ExecutionContext, Inject, Injectable, Widget } from '@nitrostack/core';
import { KeyStoreService } from '../services/key-store.service';
import { AuditLogService } from '../services/audit-log.service';

@Injectable({ deps: [KeyStoreService, AuditLogService] })
export class RevokeAgentKeysTool {
  constructor(
    @Inject(KeyStoreService) private readonly keyStore: KeyStoreService,
    @Inject(AuditLogService) private readonly auditLog: AuditLogService
  ) {}

  @Tool({
    name: 'revoke_agent_keys',
    description: 'Permanently revokes an Ed25519 cryptographic keypair, adding it to a Key Revocation List (KRL).',
    inputSchema: z.object({
      keyId: z.string().describe('Exact ID of the key to revoke'),
      reason: z.string().describe('Mandatory justification for regulatory compliance audits'),
      actorId: z.string().describe('Compliance officer ID enacting revocation')
    })
  })
  @Widget('revoke-keys')
  async revokeAgentKeys(
    input: {
      keyId: string;
      reason: string;
      actorId: string;
    },
    ctx: ExecutionContext
  ) {
    ctx.logger.warn(`Key Revocation Requested! Actor: ${input.actorId}, Key: ${input.keyId}`);

    const revoked = this.keyStore.revokeKey(input.keyId);

    if (!revoked) {
      throw new Error(`Key ${input.keyId} not found in KeyStore.`);
    }

    const auditEntry = this.auditLog.log('revoke', input.actorId, {
      keyId: input.keyId,
      reason: input.reason
    });

    ctx.logger.info(`Key ${input.keyId} successfully revoked.`);

    return {
      revoked: true,
      auditLogEntryId: auditEntry.id,
      timestamp: new Date().toISOString()
    };
  }
}
