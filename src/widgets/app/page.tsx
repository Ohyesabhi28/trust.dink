'use client';

import React from 'react';

const GraphIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const PowerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" />
  </svg>
);

const MarketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 22 20 2 20 12 2"></polygon><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const QueueIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const COLORS = {
  bg: '#f8f9fa',
  panel: '#ffffff',
  border: '#e5e7eb',
  textPrimary: '#111111',
  textSecondary: '#555555',
  accent: '#111111',
  cyan: '#111111',
  emerald: '#10b981',
};

const widgets = [
  {
    title: 'Trust Graph',
    description: 'Interactive cryptographic mandate chain visualization. Inspect agent-signed transaction links, verify Ed25519 signatures, and trace the full trust path from user to RBI clearing.',
    href: '/widgets/trust-graph',
    icon: <GraphIcon />,
  },
  {
    title: 'Risk Dashboard',
    description: 'Explainable risk scoring engine output. View composite risk scores, triggered factor breakdown, and AI-generated recommendations (approve / review / block).',
    href: '/widgets/risk-dashboard',
    icon: <ShieldIcon />,
  },
  {
    title: 'Mandate Verifier',
    description: 'Cryptographic Ed25519 signature verification for payment mandates. Inspect real-time pass/fail checks, tamper detection, and key metadata.',
    href: '/widgets/verify-mandate',
    icon: <KeyIcon />,
  },
  {
    title: 'Kill Switch Panel',
    description: 'RBI MRM 2026-compliant human-in-the-loop override panel. Suspend or resume transacting capability of agents, mandates, and transactions.',
    href: '/widgets/kill-switch',
    icon: <PowerIcon />,
  },
  {
    title: 'Market Context',
    description: 'Live NSE BFSI sector snapshot. Market sentiment metrics used by the risk engine to calibrate dynamic transaction safety thresholds.',
    href: '/widgets/market-context',
    icon: <MarketIcon />,
  },
  {
    title: 'Audit Ledger',
    description: 'Immutable transaction and agent action logs. Inspect queries, modifications, and system events with full cryptographic hashes.',
    href: '/widgets/audit-ledger',
    icon: <ListIcon />,
  },
  {
    title: 'Revoke Agent Keys',
    description: 'Instantly revoke a compromised agent key to prevent further signatures. Records reason and actor ID to compliance logs.',
    href: '/widgets/revoke-keys',
    icon: <LockIcon />,
  },
  {
    title: 'Market Shock Simulator',
    description: 'Overrides live NSE data to test extreme volatility handling in the risk engine.',
    href: '/widgets/market-shock',
    icon: <AlertIcon />,
  },
  {
    title: 'Escalate to Review',
    description: 'Routes a borderline transaction into the human compliance queue, bypassing automated risk engine clearance.',
    href: '/widgets/escalate-review',
    icon: <QueueIcon />,
  },
];

export default function HomePage() {
  return (
    <div style={{
      backgroundColor: COLORS.bg,
      color: COLORS.textPrimary,
      fontFamily: 'Inter, system-ui, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow removed for light mode flat aesthetic */}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px', zIndex: 1 }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 900,
          margin: '0 0 8px 0',
          color: COLORS.textPrimary,
          letterSpacing: '-0.5px',
        }}>
          TrustMesh
        </h1>
        <p style={{
          fontSize: '14px',
          color: COLORS.textSecondary,
          margin: 0,
          maxWidth: '520px',
          lineHeight: '1.5',
        }}>
          Agentic Payment Trust &amp; Compliance Firewall — Cryptographic mandate verification, explainable risk scoring, and human-in-the-loop kill switch for RBI 2026 compliance.
        </p>
      </div>

      {/* Widget Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        maxWidth: '720px',
        width: '100%',
        zIndex: 1,
      }}>
        {widgets.map((widget) => (
          <a
            key={widget.title}
            href={widget.href}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              padding: '28px',
              borderRadius: '8px',
              backgroundColor: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              transition: 'border-color 0.2s ease',
              display: 'block',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = COLORS.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLORS.border;
            }}
          >
            {/* Icon & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                fontSize: '14px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}>
                {widget.icon}
              </div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 800,
                margin: 0,
              }}>
                {widget.title}
              </h2>
            </div>

            <p style={{
              fontSize: '13px',
              color: COLORS.textSecondary,
              margin: '0 0 24px 0',
              lineHeight: '1.6',
            }}>
              {widget.description}
            </p>

            {/* Solid Button */}
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#ffffff',
              backgroundColor: '#111111',
              padding: '8px 16px',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              Open Widget <span style={{ fontSize: '14px' }}>→</span>
            </div>
          </a>
        ))}
      </div>


    </div>
  );
}
