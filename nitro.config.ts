export default {
  name: 'trustmesh-mcp',
  version: '1.0.0',
  description:
    'TrustMesh — Agentic Payment Trust & Compliance Firewall. ' +
    'Cryptographically verifies AI shopping-agent mandates, scores risk with explainable rules, ' +
    'and provides an RBI MRM 2026-compliant human-in-the-loop kill switch.',

  // MCP transport — Stdio for local testing, SSE for deployed cloud
  transport: 'sse',

  // Server information exposed to MCP clients
  server: {
    name: 'trustmesh-mcp',
    version: '1.0.0',
    vendor: 'TrustMesh — Amrita University MCP Hackathon 2026',
  },

  // Structured logging
  logging: {
    level: (process.env.LOG_LEVEL as any) || 'info',
    pretty: process.env.NODE_ENV !== 'production'
  },

  // Widget canvas configuration (NitroStudio)
  widgets: {
    directory: './src/widgets',
    basePath: '/widgets'
  },

  // Deployment target for `nitro deploy`
  deployment: {
    platform: 'nitrostack-cloud',
    region: 'ap-south-1', // Mumbai — lowest latency for RBI-regulated workloads
    env: ['NODE_ENV', 'LOG_LEVEL', 'RISK_BLOCK_THRESHOLD', 'RISK_REVIEW_THRESHOLD']
  }
};
