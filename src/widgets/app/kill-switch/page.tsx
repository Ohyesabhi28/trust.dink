'use client';

import React, { useState } from 'react';

const COLORS = {
  bg: '#0a0a0f',
  panel: '#12121a',
  border: '#1e1e2e',
  textPrimary: '#f0f0ff',
  textSecondary: '#8b8ba8',
  suspended: '#ef4444',
  resumed: '#10b981',
  amber: '#f59e0b',
  accent: '#6366f1',
};

const PowerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    <line x1="12" y1="2" x2="12" y2="12" />
  </svg>
);

const TargetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

export default function KillSwitchWidget({ data }: { data?: any }) {
  const [activeTab, setActiveTab] = useState<'status' | 'history'>('status');

  const result = data || null;
  const action = result?.action;
  const isSuspend = action === 'suspend';
  const isResume = action === 'resume';
  const isQuery = action === 'query';

  const getStatusColor = () => {
    if (!result) return COLORS.accent;
    if (isSuspend) return COLORS.suspended;
    if (isResume) return COLORS.resumed;
    return COLORS.amber;
  };

  const getStatusLabel = () => {
    if (!result) return 'STANDBY';
    if (isSuspend) return 'SUSPENDED';
    if (isResume) return 'RESUMED';
    return 'QUERIED';
  };

  return (
    <div style={{
      backgroundColor: COLORS.bg,
      color: COLORS.textPrimary,
      fontFamily: 'Inter, system-ui, sans-serif',
      minHeight: '480px',
      padding: '24px',
      borderRadius: '16px',
      border: `1px solid ${COLORS.border}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated glow background */}
      <div style={{
        position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 300,
        background: `radial-gradient(ellipse, ${getStatusColor()}22 0%, transparent 70%)`,
        pointerEvents: 'none', transition: 'background 0.5s ease',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, position: 'relative' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          backgroundColor: `${getStatusColor()}22`,
          border: `1px solid ${getStatusColor()}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: getStatusColor(),
          boxShadow: `0 0 16px ${getStatusColor()}33`,
          transition: 'all 0.4s ease',
        }}>
          <PowerIcon />
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Kill Switch Panel</h2>
          <p style={{ fontSize: 11, color: COLORS.textSecondary, margin: '2px 0 0 0' }}>
            RBI MRM 2026 — Human-in-the-Loop Override
          </p>
        </div>
        <div style={{
          marginLeft: 'auto',
          padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800,
          letterSpacing: 1.5, border: `1px solid ${getStatusColor()}`,
          color: getStatusColor(), backgroundColor: `${getStatusColor()}15`,
          boxShadow: result ? `0 0 12px ${getStatusColor()}33` : 'none',
          transition: 'all 0.4s',
        }}>
          {getStatusLabel()}
        </div>
      </div>

      {!result ? (
        /* Empty state */
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 320, gap: 20, textAlign: 'center',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            border: `3px solid ${COLORS.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: COLORS.textSecondary, opacity: 0.4,
          }}>
            <PowerIcon />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textSecondary, marginBottom: 8 }}>
              No override active
            </div>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, maxWidth: 280, lineHeight: 1.7 }}>
              Call <code style={{ color: COLORS.accent }}>kill_switch_override</code> to suspend or resume an agent, mandate, or transaction.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 280 }}>
            {[
              { action: 'suspend', target: 'agent', example: 'key-agent-shopping-1', color: COLORS.suspended },
              { action: 'resume', target: 'mandate', example: 'mandate-cart-amazon', color: COLORS.resumed },
              { action: 'query', target: 'transaction', example: 'tx-amazon-cart-001', color: COLORS.amber },
            ].map(ex => (
              <div key={ex.action} style={{
                padding: '8px 12px', borderRadius: 8, backgroundColor: COLORS.panel,
                border: `1px solid ${COLORS.border}`, fontSize: 11, textAlign: 'left',
                display: 'flex', gap: 8, alignItems: 'center',
              }}>
                <span style={{ color: ex.color, fontWeight: 700, minWidth: 56 }}>{ex.action}</span>
                <span style={{ color: COLORS.textSecondary }}>
                  {ex.target}: <code style={{ color: COLORS.accent }}>{ex.example}</code>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
            {(['status', 'history'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', border: 'none', textTransform: 'uppercase', letterSpacing: 0.5,
                backgroundColor: activeTab === tab ? COLORS.accent : COLORS.panel,
                color: activeTab === tab ? '#fff' : COLORS.textSecondary,
                transition: 'all 0.2s',
              }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'status' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Action card */}
              <div style={{
                padding: 16, borderRadius: 12,
                backgroundColor: `${getStatusColor()}10`,
                border: `1px solid ${getStatusColor()}33`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Action Executed
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: getStatusColor(), letterSpacing: 1 }}>
                    {(result.action || '').toUpperCase()}
                  </span>
                </div>
                {[
                  { label: 'Target Type', value: result.targetType },
                  { label: 'Target ID', value: result.targetId, code: true },
                  { label: 'Operator', value: result.operator || 'system' },
                  { label: 'Reason', value: result.reason || '—' },
                ].map(({ label, value, code }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 12, padding: '4px 0',
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}>
                    <span style={{ color: COLORS.textSecondary }}>{label}</span>
                    {code
                      ? <code style={{ color: '#06b6d4', fontSize: 11 }}>{value}</code>
                      : <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>{value}</span>}
                  </div>
                ))}
              </div>

              {/* Current status */}
              {result.currentStatus !== undefined && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8,
                  backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Current Status</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 12,
                    backgroundColor: result.currentStatus === 'suspended'
                      ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                    color: result.currentStatus === 'suspended' ? COLORS.suspended : COLORS.resumed,
                  }}>
                    {(result.currentStatus || 'active').toUpperCase()}
                  </span>
                </div>
              )}

              {/* Timestamp */}
              {result.executedAt && (
                <div style={{ fontSize: 11, color: COLORS.textSecondary, textAlign: 'right', marginTop: 4 }}>
                  Executed at: {new Date(result.executedAt).toLocaleTimeString()}
                </div>
              )}

              {/* Compliance note */}
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginTop: 4,
                backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                fontSize: 11, color: COLORS.amber, lineHeight: 1.6,
              }}>
                ⚠ This override is logged in the tamper-evident audit trail per RBI MRM 2026 requirements.
              </div>
            </div>
          ) : (
            <pre style={{
              backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}`,
              borderRadius: 8, padding: 16, fontSize: 11, color: '#a5f3fc',
              overflow: 'auto', maxHeight: 300, lineHeight: 1.6,
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </>
      )}
    </div>
  );
}
