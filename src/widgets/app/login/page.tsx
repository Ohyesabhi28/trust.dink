'use client';
import React, { useState } from 'react';

const COLORS = {
  bg: '#f8f9fa',
  panel: '#ffffff',
  border: '#e5e7eb',
  textPrimary: '#111111',
  textSecondary: '#555555',
  accent: '#111111',
};

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/widgets/dashboard';
  };

  const inputStyle = (isFocused: boolean) => ({
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    border: `1px solid ${isFocused ? COLORS.textPrimary : COLORS.border}`,
    borderRadius: '6px',
    outline: 'none',
    color: COLORS.textPrimary,
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box' as const,
  });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: COLORS.bg,
      fontFamily: 'Inter, system-ui, sans-serif',
      color: COLORS.textPrimary,
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: COLORS.panel,
        borderRadius: '12px',
        border: `1px solid ${COLORS.border}`,
        padding: '48px 32px',
        boxSizing: 'border-box',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            backgroundColor: '#f3f4f6', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <LockIcon />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0' }}>[ TrustMesh Authentication ]</h1>
          <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: 0, textAlign: 'center' }}>
            Enter your credentials to access the agentic payment firewall.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textPrimary }}>Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              placeholder="agent@trustmesh.ai"
              style={inputStyle(focusedInput === 'email')}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textPrimary }}>Password</label>
              <a href="#" style={{ fontSize: '11px', color: COLORS.textSecondary, textDecoration: 'none' }}>Forgot password?</a>
            </div>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              placeholder="••••••••"
              style={inputStyle(focusedInput === 'password')}
              required
            />
          </div>

          <button 
            type="submit"
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '14px',
              backgroundColor: '#111111',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.1s ease',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Secure Login <span style={{ fontSize: '16px' }}>→</span>
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: COLORS.textSecondary }}>
          Don't have an agent account? <a href="#" style={{ color: COLORS.textPrimary, fontWeight: 600, textDecoration: 'none' }}>Request Access</a>
        </div>
      </div>
    </div>
  );
}
