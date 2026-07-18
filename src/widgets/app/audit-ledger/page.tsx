'use client';

import React from 'react';

const COLORS = {
  bg: '#0a0a0f',
  panel: '#12121a',
  border: '#1e1e2e',
  textPrimary: '#f0f0ff',
  textSecondary: '#8b8ba8',
  accent: '#6366f1',
  cyan: '#06b6d4',
};

const DEMO_DATA = {
  totalMatches: 3,
  entries: [
    {
      id: 'log-1234',
      timestamp: new Date().toISOString(),
      action: 'verify',
      actorId: 'agent-alpha',
      details: { status: 'success' },
      entryHash: '0xabc123...',
    },
    {
      id: 'log-5678',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: 'score',
      actorId: 'risk-engine',
      details: { score: 85, decision: 'review' },
      entryHash: '0xdef456...',
    }
  ]
};

export default function AuditLedgerWidget({ data }: { data?: any }) {
  const ledgerData = data || DEMO_DATA;
  const isLive = !!data;

  return (
    <div style={{
      backgroundColor: COLORS.bg,
      color: COLORS.textPrimary,
      fontFamily: 'Inter, system-ui, sans-serif',
      minHeight: '520px',
      padding: '24px',
      borderRadius: '16px',
      border: `1px solid ${COLORS.border}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 250, height: 250,
        background: `radial-gradient(ellipse, ${COLORS.accent}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Audit Ledger</h2>
          <p style={{ fontSize: 11, color: COLORS.textSecondary, margin: '2px 0 0 0' }}>
            Immutable transaction and agent action logs
            {!isLive && <span style={{ marginLeft: 8, color: '#f59e0b' }}>(demo data)</span>}
          </p>
        </div>
        <div style={{
          padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800,
          border: `1px solid ${COLORS.accent}`, color: COLORS.accent, backgroundColor: `${COLORS.accent}15`,
        }}>
          {ledgerData.totalMatches || ledgerData.entries?.length || 0} RECORDS
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '120px 80px 100px 1fr',
          padding: '4px 10px', fontSize: 10, color: COLORS.textSecondary,
          textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          <span>Timestamp</span>
          <span>Action</span>
          <span>Actor</span>
          <span>Details</span>
        </div>

        {(ledgerData.entries || []).map((entry: any, idx: number) => (
          <div key={entry.id || idx} style={{
            display: 'grid', gridTemplateColumns: '120px 80px 100px 1fr',
            padding: '10px', borderRadius: 8,
            backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}`,
            alignItems: 'start', fontSize: 12,
          }}>
            <div style={{ color: COLORS.textSecondary, fontSize: 10 }}>
              {new Date(entry.timestamp).toLocaleString()}
            </div>
            <div style={{ fontWeight: 700, color: COLORS.cyan }}>
              {entry.action.toUpperCase()}
            </div>
            <div style={{ color: COLORS.textPrimary, fontFamily: 'monospace' }}>
              {entry.actorId || 'SYSTEM'}
            </div>
            <div style={{ color: COLORS.textSecondary, fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(entry.details)}
              <div style={{ marginTop: 4, fontSize: 9, color: '#4b4b68' }}>Hash: {entry.entryHash}</div>
            </div>
          </div>
        ))}

        {(!ledgerData.entries || ledgerData.entries.length === 0) && (
          <div style={{ padding: '20px', textAlign: 'center', color: COLORS.textSecondary, fontSize: 12 }}>
            No audit logs match the current query.
          </div>
        )}
      </div>
    </div>
  );
}
