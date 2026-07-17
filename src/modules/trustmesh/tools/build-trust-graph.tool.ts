import { ToolDecorator as Tool, z, ExecutionContext, Inject, Injectable, Widget } from '@nitrostack/core';
import { GraphBuilderService } from '../services/graph-builder.service';
import { AuditLogService } from '../services/audit-log.service';

@Injectable({ deps: [GraphBuilderService, AuditLogService] })
export class BuildTrustGraphTool {
  constructor(
    @Inject(GraphBuilderService) private readonly graphBuilder: GraphBuilderService,
    @Inject(AuditLogService) private readonly auditLog: AuditLogService
  ) {}

  @Tool({
    name: 'build_trust_graph',
    description: 'Constructs the cryptographic and structural mandate trust graph, returning node/edge statuses for visual widget rendering.',
    inputSchema: z.object({
      transactionId: z.string().describe('The transaction identifier to build trust validation sequence for')
    })
  })
  @Widget('trust-graph')
  async buildTrustGraph(
    input: { transactionId: string },
    ctx: ExecutionContext
  ) {
    ctx.logger.info(`Constructing mandate trust graph for tx: ${input.transactionId}`);

    const graph = this.graphBuilder.build(input.transactionId);

    // Audit log this graph fetch
    this.auditLog.log('trust_graph', 'system', {
      transactionId: input.transactionId,
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length,
      overallStatus: graph.overallStatus
    });

    ctx.logger.info(`Mandate trust graph compiled successfully for tx: ${input.transactionId}`);
    return graph;
  }
}
