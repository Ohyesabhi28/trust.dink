import { Module } from '@nitrostack/core';

// Services
import { KeyStoreService } from './services/key-store.service';
import { CryptoService } from './services/crypto.service';
import { StateService } from './services/state.service';
import { RiskEngineService } from './services/risk-engine.service';
import { GraphBuilderService } from './services/graph-builder.service';
import { AuditLogService } from './services/audit-log.service';
import { MarketDataService } from './services/market-data.service';
import { ExchangeRateService } from './services/exchange-rate.service';

// Tools
import { VerifyMandateTool } from './tools/verify-mandate.tool';
import { ScoreRiskTool } from './tools/score-risk.tool';
import { BuildTrustGraphTool } from './tools/build-trust-graph.tool';
import { KillSwitchTool } from './tools/kill-switch.tool';
import { MarketContextTool } from './tools/market-context.tool';

// Resources
import { ComplianceRulesResource } from './resources/compliance-rules.resource';
import { FraudPatternsResource } from './resources/fraud-patterns.resource';
import { AuditLogResource } from './resources/audit-log.resource';
import { MarketDataResource } from './resources/market-data.resource';

// Prompts
import { ComplianceReportPrompt } from './prompts/compliance-report.prompt';
import { IncidentBriefPrompt } from './prompts/incident-brief.prompt';

@Module({
  name: 'trustmesh',
  description:
    'TrustMesh Payment Compliance Firewall — cryptographic mandate verification, ' +
    'explainable risk scoring with live NSE/BFSI macro enrichment, interactive trust graph, ' +
    'and RBI MRM 2026-compliant human-in-the-loop kill switch.',
  controllers: [
    // ── Tools ──────────────────────────────────────────────
    VerifyMandateTool,
    ScoreRiskTool,
    BuildTrustGraphTool,
    KillSwitchTool,
    MarketContextTool,
    // ── Resources ──────────────────────────────────────────
    ComplianceRulesResource,
    FraudPatternsResource,
    AuditLogResource,
    MarketDataResource,
    // ── Prompts ────────────────────────────────────────────
    ComplianceReportPrompt,
    IncidentBriefPrompt
  ],
  providers: [
    KeyStoreService,
    CryptoService,
    StateService,
    RiskEngineService,
    GraphBuilderService,
    AuditLogService,
    MarketDataService,
    ExchangeRateService
  ],
  exports: [
    KeyStoreService,
    CryptoService,
    StateService,
    RiskEngineService,
    GraphBuilderService,
    AuditLogService,
    MarketDataService,
    ExchangeRateService
  ]
})
export class TrustMeshModule {}
