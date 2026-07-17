/**
 * TrustMesh — Shared TypeScript Interfaces
 *
 * These types implement the data model described in the TrustMesh build spec
 * and align with Google AP2 / Mastercard Agent Pay / Visa Trusted Agent mandate schemas.
 */

// ─────────────────────────────────────────────────────────────
// Mandate Chain
// ─────────────────────────────────────────────────────────────

/** AP2-style transaction mandate types (Intent → Cart → Payment) */
export type MandateType = 'intent' | 'cart' | 'payment';

/** A signed mandate object as submitted to verify_mandate */
export interface Mandate {
  /** Unique mandate identifier */
  id: string;
  /** Mandate type in the payment chain */
  type: MandateType;
  /** Arbitrary mandate payload (merchant, amount, items, etc.) */
  payload: Record<string, unknown>;
  /** Base64-encoded Ed25519 signature over the canonical JSON payload */
  signature: string;
  /** Key ID used to look up the issuer's public key in the key store */
  signerPublicKeyId: string;
  /** ISO 8601 timestamp of mandate issuance */
  issuedAt: string;
  /** Optional expiry timestamp */
  expiresAt?: string;
}

/** Result of cryptographic mandate verification */
export interface MandateVerificationResult {
  /** Whether the mandate passed all checks */
  valid: boolean;
  /** Whether the Ed25519 signature cryptographically verified */
  signatureVerified: boolean;
  /** Whether the mandate is within its validity window */
  notExpired: boolean;
  /** Scope/permission violations found in the payload */
  scopeIssues: string[];
  /** Unique ID assigned to this verification event */
  mandateId: string;
  /** ISO 8601 timestamp of verification */
  verifiedAt: string;
  /** Key ID that was used for verification */
  signerPublicKeyId: string;
  /** Whether the mandate's agent is currently suspended (kill switch) */
  agentSuspended: boolean;
}

// ─────────────────────────────────────────────────────────────
// Risk Assessment
// ─────────────────────────────────────────────────────────────

/** A single factor in the transparent risk scoring model */
export interface RiskFactor {
  /** Human-readable factor name */
  factor: string;
  /** Maximum weight this factor contributes to the score */
  weight: number;
  /** Whether this factor was triggered for this transaction */
  triggered: boolean;
  /** Optional detail explaining why the factor triggered */
  detail?: string;
}

/** Risk assessment recommendation */
export type RiskRecommendation = 'approve' | 'review' | 'block';

/** Full risk assessment output for a transaction */
export interface RiskAssessment {
  /** Transaction ID this assessment belongs to */
  transactionId: string;
  /** Composite risk score (0-100). 0 = no risk, 100 = definite fraud */
  riskScore: number;
  /** Ordered list of evaluated risk factors with their weights and trigger status */
  riskFactors: RiskFactor[];
  /** Compliance recommendation derived from the score */
  recommendation: RiskRecommendation;
  /** ISO 8601 timestamp of assessment */
  assessedAt: string;
  /** Human-readable explanation for audit/compliance reports */
  explanation: string;
}

// ─────────────────────────────────────────────────────────────
// Trust Graph
// ─────────────────────────────────────────────────────────────

/** Node types in the trust graph */
export type TrustNodeType = 'user' | 'agent' | 'merchant' | 'issuer' | 'network';

/** A node in the mandate chain trust graph */
export interface TrustNode {
  /** Unique node identifier */
  id: string;
  /** Node type determines icon and color in the widget */
  type: TrustNodeType;
  /** Human-readable label */
  label: string;
  /** Optional metadata for tooltip display */
  metadata?: Record<string, string>;
}

/** Edge trust status — drives visual rendering in the widget */
export type EdgeStatus = 'verified' | 'unverified' | 'tampered' | 'expired' | 'suspended';

/** A directed edge representing a mandate in the trust chain */
export interface TrustEdge {
  /** Source node ID */
  source: string;
  /** Target node ID */
  target: string;
  /** Mandate ID this edge represents */
  mandateId: string;
  /** Trust status — drives edge color (green=verified, red=tampered) */
  status: EdgeStatus;
  /** ISO 8601 timestamp of the mandate */
  timestamp: string;
  /** The signer's key ID */
  signerKeyId: string;
  /** Transaction amount if applicable */
  amount?: number;
  /** Currency code */
  currency?: string;
}

/** Complete trust graph for a transaction */
export interface TrustGraph {
  /** Unique transaction ID this graph represents */
  transactionId: string;
  /** All nodes in the mandate chain */
  nodes: TrustNode[];
  /** All edges representing mandates between nodes */
  edges: TrustEdge[];
  /** Overall trust status of the chain */
  overallStatus: EdgeStatus;
  /** ISO 8601 timestamp */
  generatedAt: string;
}

// ─────────────────────────────────────────────────────────────
// Audit Log
// ─────────────────────────────────────────────────────────────

/** Actions that create audit log entries */
export type AuditAction = 'verify' | 'score' | 'kill_switch' | 'trust_graph' | 'revoke' | 'escalate';

/** An immutable audit log entry — append-only, never modified */
export interface AuditLogEntry {
  /** Unique audit entry ID */
  id: string;
  /** ISO 8601 timestamp of the action */
  timestamp: string;
  /** Type of action that created this entry */
  action: AuditAction;
  /** Actor who performed the action (agent ID or officer ID) */
  actorId: string;
  /** Action-specific details */
  details: Record<string, unknown>;
  /** Cryptographic hash of the previous entry for chain integrity */
  previousEntryHash?: string;
  /** Hash of this entry's content */
  entryHash: string;
}

// ─────────────────────────────────────────────────────────────
// Kill Switch
// ─────────────────────────────────────────────────────────────

/** Target types for kill switch operations */
export type KillSwitchTargetType = 'agent' | 'mandate' | 'transaction';

/** Kill switch actions */
export type KillSwitchAction = 'suspend' | 'resume' | 'block';

/** A kill switch registry entry */
export interface KillSwitchEntry {
  targetType: KillSwitchTargetType;
  targetId: string;
  action: KillSwitchAction;
  reason: string;
  actorId: string;
  appliedAt: string;
  auditLogEntryId: string;
}

// ─────────────────────────────────────────────────────────────
// Key Store
// ─────────────────────────────────────────────────────────────

/** A registered issuer/agent public key */
export interface PublicKeyRecord {
  keyId: string;
  /** Entity type (issuer = payment network, agent = shopping agent) */
  entityType: 'issuer' | 'agent' | 'merchant';
  /** Human-readable entity name */
  entityName: string;
  /** PEM-encoded Ed25519 public key */
  publicKeyPem: string;
  /** Whether this key is currently trusted */
  trusted: boolean;
  /** ISO 8601 registration date */
  registeredAt: string;
}

// ─────────────────────────────────────────────────────────────
// RBI Compliance Rules
// ─────────────────────────────────────────────────────────────

/** A single RBI MRM compliance requirement */
export interface ComplianceRule {
  id: string;
  category: string;
  requirement: string;
  description: string;
  howTrustMeshSatisfies: string;
  rbiSection: string;
}

/** The full RBI-SEBI compliance rules resource */
export interface ComplianceRulesResource {
  source: string;
  version: string;
  effectiveDate: string;
  rules: ComplianceRule[];
}

// ─────────────────────────────────────────────────────────────
// Fraud Patterns
// ─────────────────────────────────────────────────────────────

export interface FraudPattern {
  id: string;
  name: string;
  description: string;
  indicators: string[];
  riskWeightIncrease: number;
  firstSeen: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
