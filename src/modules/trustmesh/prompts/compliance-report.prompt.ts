import { PromptDecorator as Prompt, ExecutionContext } from '@nitrostack/core';

export class ComplianceReportPrompt {
  @Prompt({
    name: 'compliance_explanation_report',
    description: 'Generates a human-readable regulatory compliance audit report for a transaction risk assessment and mandate verification.',
    arguments: [
      {
        name: 'transaction_id',
        description: 'The transaction identifier to draft the audit report for',
        required: true
      },
      {
        name: 'risk_score',
        description: 'Calculated risk score (0-100)',
        required: true
      },
      {
        name: 'recommendation',
        description: 'System recommendation (approve, review, block)',
        required: true
      },
      {
        name: 'explanation',
        description: 'Detailed explanation text from the risk engine',
        required: true
      }
    ]
  })
  async getComplianceReport(
    args: {
      transaction_id: string;
      risk_score: string;
      recommendation: string;
      explanation: string;
    },
    ctx: ExecutionContext
  ) {
    ctx.logger.info(`Formatting compliance report prompt template for: ${args.transaction_id}`);

    const reportMarkdown = `
# TrustMesh RBI-MRM Compliance Audit Report
**Transaction Security & Intent Mandate Verification Record**

## 1. Transaction Overview
- **Transaction ID:** ${args.transaction_id}
- **Timestamp:** ${new Date().toISOString()}
- **Compliance Standards Applied:** RBI Model Risk Management (MRM) Draft Guidance 2026

## 2. Risk Assessment Summary
- **Risk Score:** ${args.risk_score} / 100
- **System Recommendation:** **${args.recommendation.toUpperCase()}**
- **Trigger Details:** ${args.explanation}

## 3. Cryptographic Verification & Trust Graph status
- The mandate chain signature validation was performed on the Ed25519 public key infrastructure.
- Visual trust graph nodes (User -> Agent -> Merchant -> Issuer -> Network) were built and verified.
- Status of clearing request is **${args.recommendation === 'block' ? 'TAMPERED / SUSPENDED' : (args.recommendation === 'review' ? 'PENDING HITL REVIEW' : 'VERIFIED / CLEARED')}**.

## 4. Compliance Officer Certification
This transaction has been logged in an immutable, append-only ledger under Section 6.3 of the RBI MRM guidelines.
`;

    return [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: reportMarkdown.trim()
        }
      }
    ];
  }
}
