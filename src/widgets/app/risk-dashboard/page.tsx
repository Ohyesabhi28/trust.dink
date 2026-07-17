'use client';

import React from 'react';

// Design Colors
const COLORS = {
  bg: '#f8f9fa',
  panel: '#ffffff',
  border: '#e5e7eb',
  textPrimary: '#111111',
  textSecondary: '#555555',
  emerald: '#10b981',
  amber: '#f59e0b',
  crimson: '#ef4444',
};

export default function RiskDashboardWidget({ data }: { data?: any }) {
  // Pull structured assessment or fall back to generic demo
  const assessment = data || {
    transactionId: 'tx_demo_xxx',
    riskScore: 65,
    riskFactors: [
      { factor: 'Signature Check Failed', weight: 100, triggered: false },
      { factor: 'Merchant Scope Mismatch', weight: 30, triggered: true },
      { factor: 'Geographic Mismatch', weight: 20, triggered: false },
      { factor: 'Velocity Limit Exceeded', weight: 25, triggered: true }
    ],
    recommendation: 'review',
    explanation: 'Risk score elevated (65/100) due to multiple transaction anomalies: Merchant Scope Mismatch (+30) and Velocity Limit Exceeded (+25).'
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'approve': return COLORS.emerald;
      case 'review': return COLORS.amber;
      case 'block': return COLORS.crimson;
      default: return COLORS.textSecondary;
    }
  };

  const scoreColor = assessment.riskScore >= 75 ? COLORS.crimson : (assessment.riskScore >= 50 ? COLORS.amber : COLORS.emerald);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: COLORS.textPrimary,
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '24px',
      borderRadius: '12px',
      border: `1px solid ${COLORS.border}`,
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow removed for flat aesthetic */}

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: COLORS.textPrimary }}>
          [ TrustMesh Risk Intelligence ]
        </h3>
        <p style={{ fontSize: '11px', color: COLORS.textSecondary, margin: '2px 0 0 0' }}>
          Transaction Audit & Verification Engine Output
        </p>
      </div>

      {/* Main Gauge & Score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
        {/* Score Ring */}
        <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '100px', height: '100px' }}>
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={scoreColor}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - assessment.riskScore / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: scoreColor }}>{assessment.riskScore}</span>
            <span style={{ fontSize: '9px', color: COLORS.textSecondary, textTransform: 'uppercase' }}>Risk Score</span>
          </div>
        </div>

        {/* Status Label & Recommendation */}
        <div>
          <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Recommendation</div>
          <div style={{
            fontSize: '20px',
            fontWeight: 800,
            color: getRecommendationColor(assessment.recommendation),
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginTop: '2px'
          }}>
            {assessment.recommendation}
          </div>
          <div style={{ fontSize: '11px', color: COLORS.textSecondary, marginTop: '4px' }}>
            ID: <code style={{ color: '#06b6d4' }}>{assessment.transactionId}</code>
          </div>
        </div>
      </div>

      {/* Explanatory detail */}
      <div style={{
        padding: '12px',
        backgroundColor: '#ffffff',
        border: `1px solid ${COLORS.border}`,
        borderRadius: '8px',
        fontSize: '12px',
        lineHeight: '1.4',
        color: COLORS.textSecondary,
        marginBottom: '20px'
      }}>
        {assessment.explanation}
      </div>

      {/* Factor Breakdown */}
      <div>
        <h4 style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.textPrimary }}>
          Risk Factor Checklist
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {assessment.riskFactors.map((f: any, idx: number) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              padding: '6px 8px',
              borderRadius: '6px',
              backgroundColor: f.triggered ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
              border: f.triggered ? '1px solid rgba(239, 68, 68, 0.1)' : `1px solid ${COLORS.border}`
            }}>
              <span style={{ color: f.triggered ? COLORS.textPrimary : COLORS.textSecondary }}>
                {f.factor}
              </span>
              <span style={{
                fontWeight: 700,
                color: f.triggered ? COLORS.crimson : COLORS.emerald
              }}>
                {f.triggered ? `+${f.weight}` : '0'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
