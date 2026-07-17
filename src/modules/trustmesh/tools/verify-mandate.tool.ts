import { ToolDecorator as Tool, z, ExecutionContext, Inject, Injectable, Widget } from '@nitrostack/core';
import { CryptoService } from '../services/crypto.service';
import { StateService } from '../services/state.service';
import { AuditLogService } from '../services/audit-log.service';
import { Mandate } from '../../../types';

@Injectable({ deps: [CryptoService, StateService, AuditLogService] })
export class VerifyMandateTool {
  constructor(
    @Inject(CryptoService) private readonly cryptoService: CryptoService,
    @Inject(StateService) private readonly stateService: StateService,
    @Inject(AuditLogService) private readonly auditLog: AuditLogService
  ) {}

  @Tool({
    name: 'verify_mandate',
    description: 'Cryptographically verifies a signed payment/shopping mandate using Ed25519 signatures, checking for tampering and key trust status.',
    inputSchema: z.object({
      mandateType: z.enum(['intent', 'cart', 'payment']).describe('Type of mandate in the trust chain'),
      payload: z.record(z.any()).describe('The transaction scope details (e.g. merchant, items, amount, currency)'),
      signature: z.string().describe('Base64 encoded Ed25519 signature of the sorted, canonical payload'),
      signerPublicKeyId: z.string().describe('Key ID representing the signer public key registry entry')
    })
  })
  @Widget('verify-mandate')
  async verifyMandate(
    input: {
      mandateType: 'intent' | 'cart' | 'payment';
      payload: Record<string, unknown>;
      signature: string;
      signerPublicKeyId: string;
    },
    ctx: ExecutionContext
  ) {
    ctx.logger.info(`Starting mandate verification for type: ${input.mandateType}`, { signer: input.signerPublicKeyId });

    const mandateId = `man_${Math.random().toString(36).substring(2, 11)}`;
    const verifiedAt = new Date().toISOString();

    // 1. Check Kill Switch Registry
    const agentSuspended = this.stateService.isSuspended('agent', input.signerPublicKeyId);
    if (agentSuspended) {
      ctx.logger.warn(`Verification failed: Signer key '${input.signerPublicKeyId}' is suspended via compliance Kill Switch override.`);
      
      this.auditLog.log('verify', input.signerPublicKeyId, {
        mandateType: input.mandateType,
        payload: input.payload,
        status: 'blocked_by_kill_switch',
        mandateId
      });

      return {
        valid: false,
        signatureVerified: false,
        notExpired: true,
        scopeIssues: ['Signer entity suspended by compliance authority (Kill Switch)'],
        mandateId,
        verifiedAt,
        signerPublicKeyId: input.signerPublicKeyId,
        agentSuspended: true
      };
    }

    // 2. Cryptographic signature check
    const signatureVerified = this.cryptoService.verify(
      input.payload,
      input.signature,
      input.signerPublicKeyId
    );

    // 3. Structural checks
    const scopeIssues: string[] = [];
    if (!input.payload.merchant) {
      scopeIssues.push('Merchant field missing from mandate payload');
    }
    if (!input.payload.amount || Number(input.payload.amount) <= 0) {
      scopeIssues.push('Valid amount greater than zero missing from mandate');
    }

    const valid = signatureVerified && scopeIssues.length === 0;

    // Cache mandate in memory state to correlate during graph building and risk scoring
    const mandate: Mandate = {
      id: mandateId,
      type: input.mandateType,
      payload: input.payload,
      signature: input.signature,
      signerPublicKeyId: input.signerPublicKeyId,
      issuedAt: (input.payload.issuedAt as string) || new Date().toISOString()
    };
    this.stateService.storeMandate(mandate);

    // Log verification to audit trail
    this.auditLog.log('verify', input.signerPublicKeyId, {
      mandateType: input.mandateType,
      signatureVerified,
      scopeIssues,
      valid,
      mandateId
    });

    ctx.logger.info(`Mandate verification completed. Valid: ${valid}`, { mandateId });

    return {
      valid,
      signatureVerified,
      notExpired: true,
      scopeIssues,
      mandateId,
      verifiedAt,
      signerPublicKeyId: input.signerPublicKeyId,
      agentSuspended: false
    };
  }
}
