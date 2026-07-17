import { PromptDecorator as Prompt, ExecutionContext, Injectable } from '@nitrostack/core';

@Injectable()
export class IncidentBriefPrompt {
  @Prompt({
    name: 'incident_response_brief',
    description: 'Generates a structured incident brief for compliance officers detailing a recent kill switch block action.',
    arguments: [
      {
        name: 'target_type',
        description: 'The entity type affected by the override (agent, mandate, transaction)',
        required: true
      },
      {
        name: 'target_id',
        description: 'Identifier of the targeted entity',
        required: true
      },
      {
        name: 'action',
        description: 'Action taken (suspend, block, resume)',
        required: true
      },
      {
        name: 'reason',
        description: 'Compliance justification for the override',
        required: true
      },
      {
        name: 'actor_id',
        description: 'Compliance officer who triggered the override',
        required: true
      }
    ]
  })
  async getIncidentBrief(
    args: {
      target_type: string;
      target_id: string;
      action: string;
      reason: string;
      actor_id: string;
    },
    ctx: ExecutionContext
  ) {
    ctx.logger.warn(`Compiling incident response brief for compliance target: ${args.target_type}:${args.target_id}`);

    const briefMarkdown = `
# TrustMesh Operational Override & Incident Brief
**Compliance Kill Switch Event Notification**

## Action details
- **Target Entity Type:** ${args.target_type.toUpperCase()}
- **Target Identifier:** \`${args.target_id}\`
- **Action Enforced:** **${args.action.toUpperCase()}**
- **Enacted By:** Compliance Officer (\`${args.actor_id}\`)
- **Execution Timestamp:** ${new Date().toISOString()}

## Compliance Justification
The manual kill switch override was enacted under **RBI MRM Section 4.2(a)**.
- **Incident Description:** ${args.reason}
- **System Impact:** Subsequent verification and risk scoring checks matching this target will be automatically blocked, and transactions from this agent will be routed directly to the review queue.

## Next Steps
1. Inform the engineering operations team to inspect the shopping agent's integration endpoints.
2. Maintain active status logs in the audit trail until resolution.
3. Review key registries for rotation if compromise is confirmed.
`;

    return [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: briefMarkdown.trim()
        }
      }
    ];
  }
}
