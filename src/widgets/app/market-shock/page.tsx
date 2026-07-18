'use client';

import React from 'react';

const COLORS = {
  bg: '#0a0a0f',
  panel: '#12121a',
  border: '#1e1e2e',
  textPrimary: '#f0f0ff',
  textSecondary: '#8b8ba8',
  bullish: '#10b981',
  bearish: '#ef4444',
};

export default function MarketShockWidget({ data }: { data?: any }) {
  const result = data;
  const isLive = !!data;
  
  // Try to parse boolean or fallback
  const isShockActive = result?.shockEnabled === true || result?.shockEnabled === 'true';

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
        background: `radial-gradient(ellipse, ${isShockActive ? COLORS.bearish : COLORS.bullish}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: isShockActive ? COLORS.bearish : COLORS.textPrimary }}>Market Shock Simulator</h2>
        <p style={{ fontSize: 11, color: COLORS.textSecondary, margin: '2px 0 0 0' }}>
          Overrides live NSE data to test extreme volatility handling in the risk engine.
        </p>
      </div>

      {!isLive ? (
        <div style={{ padding: 20, textAlign: 'center', backgroundColor: COLORS.panel, borderRadius: 8, border: `1px dashed ${COLORS.border}` }}>
          <p style={{ color: COLORS.textSecondary, fontSize: 13, margin: 0 }}>Waiting for simulator command...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            padding: '20px', borderRadius: 8,
            backgroundColor: isShockActive ? `${COLORS.bearish}10` : `${COLORS.bullish}10`, 
            border: `1px solid ${isShockActive ? COLORS.bearish : COLORS.bullish}40`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 48 }}>
              {isShockActive ? '📉' : '📈'}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: isShockActive ? COLORS.bearish : COLORS.bullish }}>
                SHOCK STATE: {isShockActive ? 'ACTIVE' : 'INACTIVE'}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>
                {isShockActive 
                  ? 'All subsequent risk scores will be processed under extreme market volatility assumptions.' 
                  : 'System restored to live market context.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
