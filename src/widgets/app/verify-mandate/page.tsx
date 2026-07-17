'use client';

import React, { useState } from 'react';

const COLORS = {
  bg: '#0a0a0f',
  panel: '#12121a',
  border: '#1e1e2e',
  borderHover: '#3b82f6',
  textPrimary: '#f0f0ff',
  textSecondary: '#8b8ba8',
  verified: '#10b981',
  failed: '#ef4444',
  pending: '#3b82f6',
  accent: '#6366f1',
};

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function VerifyMandateWidget({ data }: { data?: any }) {
  const [activeTab, setActiveTab] = useState<'result' | 'payload'>('result');

  const result = data || {
    valid: null,
    signatureVerified: null,
    notExpired: null,
    scopeIssues: [],
    mandateId: null,
    verifiedAt: null,
    signerPublicKeyId: null,
    agentSuspended: null,
  };

  const hasResult = result.valid !== null;
  const isValid = result.valid === true;

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
      {/* Glow */}
      <div style={{
        position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 200,
        background: hasResult
          ? (isValid ? 'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(239,68,68,0.12) 0%, transparent 70%)')
          : 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, position: 'relative' }}>
        <div style={{ color: hasResult ? (isValid ? COLORS.verified : COLORS.failed) : COLORS.accent }}>
          {hasResult && !isValid ? <AlertIcon /> : <ShieldIcon />}
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: COLORS.textPrimary }}>
            Mandate Verifier
          </h2>
          <p style={{ fontSize: 11, color: COLORS.textSecondary, margin: '2px 0 0 0' }}>
            Ed25519 Cryptographic Signature Verification
          </p>
        </div>
        {hasResult && (
          <div style={{
            marginLeft: 'auto',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            backgroundColor: isValid ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: isValid ? COLORS.verified : COLORS.failed,
            border: `1px solid ${isValid ? COLORS.verified : COLORS.failed}`,
          }}>
            {isValid ? '✓ VERIFIED' : '✗ INVALID'}
          </div>
        )}
      </div>

      {!hasResult ? (
        /* Empty state */
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 320, gap: 16, color: COLORS.textSecondary, textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, opacity: 0.3 }}>🔐</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No verification result yet</div>
            <div style={{ fontSize: 12, maxWidth: 280, lineHeight: 1.6 }}>
              Call <code style={{ color: COLORS.accent }}>verify_mandate</code> in NitroStudio with a mandate payload and signature to see the result here.
            </div>
          </div>
          <div style={{
            padding: '12px 16px', borderRadius: 8, backgroundColor: COLORS.panel,
            border: `1px solid ${COLORS.border}`, fontSize: 11, textAlign: 'left', lineHeight: 1.8,
          }}>
            <div style={{ color: COLORS.textSecondary, marginBottom: 4 }}>Example mandate types:</div>
            {['intent', 'cart', 'payment'].map(t => (
              <div key={t}>
                <code style={{ color: COLORS.accent }}>mandateType: &quot;{t}&quot;</code>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
            {(['result', 'payload'] as const).map(tab => (
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

          {activeTab === 'result' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Checks grid */}
              {[
                { label: 'Signature Valid', value: result.signatureVerified, key: 'signatureVerified' },
                { label: 'Not Expired', value: result.notExpired, key: 'notExpired' },
                { label: 'Agent Suspended', value: result.agentSuspended, inverted: true, key: 'agentSuspended' },
                { label: 'Scope Issues', value: (result.scopeIssues?.length ?? 0) === 0, key: 'scopeIssues' },
              ].map(({ label, value, inverted }) => {
                const pass = inverted ? !value : value;
                return (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', borderRadius: 8,
                    backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}`,
                  }}>
                    <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{label}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 12,
                      backgroundColor: pass ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      color: pass ? COLORS.verified : COLORS.failed,
                    }}>
                      {pass ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                );
              })}

              {/* Mandate ID */}
              {result.mandateId && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8,
                  backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}`,
                }}>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 }}>Mandate ID</div>
                  <code style={{ fontSize: 12, color: COLORS.accent }}>{result.mandateId}</code>
                </div>
              )}

              {/* Signer */}
              {result.signerPublicKeyId && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8,
                  backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}`,
                }}>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 }}>Signer Key ID</div>
                  <code style={{ fontSize: 12, color: '#06b6d4' }}>{result.signerPublicKeyId}</code>
                </div>
              )}

              {/* Verified At */}
              {result.verifiedAt && (
                <div style={{ fontSize: 11, color: COLORS.textSecondary, textAlign: 'right', marginTop: 4 }}>
                  Verified at: {new Date(result.verifiedAt).toLocaleTimeString()}
                </div>
              )}
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
