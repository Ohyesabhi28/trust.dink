'use client';

import React from 'react';

const COLORS = {
  bg: '#0a0a0f',
  panel: '#12121a',
  border: '#1e1e2e',
  textPrimary: '#f0f0ff',
  textSecondary: '#8b8ba8',
  bearish: '#ef4444',
};

export default function RevokeKeysWidget({ data }: { data?: any }) {
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
        background: `radial-gradient(ellipse, ${COLORS.bearish}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: COLORS.bearish }}>Agent Key Revocation</h2>
        <p style={{ fontSize: 11, color: COLORS.textSecondary, margin: '2px 0 0 0' }}>
          Instantly revokes a compromised agent key to prevent further signatures.
        </p>
      </div>

      {!isLive ? (
        <div style={{ padding: 20, textAlign: 'center', backgroundColor: COLORS.panel, borderRadius: 8, border: `1px dashed ${COLORS.border}` }}>
          <p style={{ color: COLORS.textSecondary, fontSize: 13, margin: 0 }}>Waiting for key revocation command...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            padding: '16px', borderRadius: 8,
            backgroundColor: `${COLORS.bearish}10`, border: `1px solid ${COLORS.bearish}40`,
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: COLORS.bearish, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>!</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.bearish }}>KEY REVOKED SUCCESSFULLY</div>
              <div style={{ fontSize: 11, color: COLORS.textSecondary }}>The key is no longer trusted by the network.</div>
            </div>
          </div>
          
          <div style={{ backgroundColor: COLORS.panel, padding: 16, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
              <div>
                <div style={{ color: COLORS.textSecondary, marginBottom: 4, fontSize: 10 }}>TARGET KEY ID</div>
                <div style={{ fontFamily: 'monospace', color: COLORS.textPrimary }}>{result?.keyId || 'Unknown'}</div>
              </div>
              <div>
                <div style={{ color: COLORS.textSecondary, marginBottom: 4, fontSize: 10 }}>ACTOR ID</div>
                <div style={{ fontFamily: 'monospace', color: COLORS.textPrimary }}>{result?.actorId || 'Unknown'}</div>
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                <div style={{ color: COLORS.textSecondary, marginBottom: 4, fontSize: 10 }}>REASON</div>
                <div style={{ color: COLORS.textPrimary }}>{result?.reason || 'No reason provided.'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
