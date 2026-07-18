'use client';

import React from 'react';

const COLORS = {
  bg: '#0a0a0f',
  panel: '#12121a',
  border: '#1e1e2e',
  textPrimary: '#f0f0ff',
  textSecondary: '#8b8ba8',
  neutral: '#f59e0b',
};

export default function EscalateReviewWidget({ data }: { data?: any }) {
  const result = data;
  const isLive = !!data;

  return (
    <div style={{
      backgroundColor: COLORS.bg,
      color: COLORS.textPrimary,
      fontFamily: 'Inter, system-ui, sans-serif',
      minHeight: '320px',
      padding: '24px',
      borderRadius: '16px',
      border: `1px solid ${COLORS.border}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 250, height: 250,
        background: `radial-gradient(ellipse, ${COLORS.neutral}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: COLORS.neutral }}>Manual Review Escalation</h2>
        <p style={{ fontSize: 11, color: COLORS.textSecondary, margin: '2px 0 0 0' }}>
          Routes a borderline transaction into the human compliance queue.
        </p>
      </div>

      {!isLive ? (
        <div style={{ padding: 20, textAlign: 'center', backgroundColor: COLORS.panel, borderRadius: 8, border: `1px dashed ${COLORS.border}` }}>
          <p style={{ color: COLORS.textSecondary, fontSize: 13, margin: 0 }}>Waiting for escalation command...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            padding: '16px', borderRadius: 8,
            backgroundColor: `${COLORS.neutral}10`, border: `1px solid ${COLORS.neutral}40`,
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: COLORS.neutral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>#</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.neutral }}>ESCALATED TO QUEUE</div>
              <div style={{ fontSize: 11, color: COLORS.textSecondary }}>The mandate is now pending human review.</div>
            </div>
          </div>
          
          <div style={{ backgroundColor: COLORS.panel, padding: 16, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, fontSize: 12 }}>
              <div>
                <div style={{ color: COLORS.textSecondary, marginBottom: 4, fontSize: 10 }}>MANDATE ID</div>
                <div style={{ fontFamily: 'monospace', color: COLORS.textPrimary }}>{result?.mandateId || 'Unknown'}</div>
              </div>
              <div>
                <div style={{ color: COLORS.textSecondary, marginBottom: 4, fontSize: 10 }}>PREVIOUS STATE</div>
                <div style={{ color: COLORS.textSecondary, textTransform: 'uppercase' }}>{result?.previousState || 'Unknown'}</div>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ color: COLORS.textSecondary, marginBottom: 4, fontSize: 10 }}>ESCALATION REASON</div>
                <div style={{ color: COLORS.textPrimary }}>{result?.reason || 'No reason provided.'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
