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
