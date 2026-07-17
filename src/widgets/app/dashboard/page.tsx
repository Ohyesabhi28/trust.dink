'use client';
import React, { useState } from 'react';
import TrustGraphWidget from '../trust-graph/page';
import RiskDashboardWidget from '../risk-dashboard/page';

const COLORS = {
  bg: '#f8f9fa',
  sidebar: '#ffffff',
  panel: '#ffffff',
  border: '#e5e7eb',
  textPrimary: '#111111',
  textSecondary: '#555555',
  accent: '#111111',
};

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: COLORS.bg,
      fontFamily: 'Inter, system-ui, sans-serif',
      color: COLORS.textPrimary,
    }}>
      {/* Sidebar */}
      <div style={{
        width: '240px',
        backgroundColor: COLORS.sidebar,
        borderRight: `1px solid ${COLORS.border}`,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${COLORS.border}`,
          fontWeight: 900,
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#111', borderRadius: '2px' }} />
          TrustMesh
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          <div 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
              backgroundColor: activeMenu === 'dashboard' ? '#f3f4f6' : 'transparent', 
              borderRadius: '6px', cursor: 'pointer',
              fontWeight: activeMenu === 'dashboard' ? 700 : 500,
              color: activeMenu === 'dashboard' ? '#111' : COLORS.textSecondary
            }}
            onClick={() => setActiveMenu('dashboard')}
          >
            <DashboardIcon /> Dashboard
          </div>
          <div 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
              backgroundColor: activeMenu === 'settings' ? '#f3f4f6' : 'transparent', 
              borderRadius: '6px', cursor: 'pointer',
              fontWeight: activeMenu === 'settings' ? 700 : 500,
              color: activeMenu === 'settings' ? '#111' : COLORS.textSecondary
            }}
            onClick={() => setActiveMenu('settings')}
          >
            <SettingsIcon /> Settings
          </div>
        </div>
        <div style={{ padding: '24px', borderTop: `1px solid ${COLORS.border}`, fontSize: '12px', color: COLORS.textSecondary }}>
          v1.0.0 (Agentic Firewall)
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Top Header */}
        <div style={{
          height: '64px',
          backgroundColor: '#fff',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}>
          <div style={{ fontWeight: 600, color: COLORS.textSecondary, fontSize: '14px' }}>
            <span style={{ color: '#111' }}>Workspace</span> / Intelligence Dashboard
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600 }}>Active Agent</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
              AI
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '32px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Header section */}
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 800 }}>[ Intelligence Dashboard ]</h1>
              <p style={{ margin: 0, color: COLORS.textSecondary, fontSize: '14px' }}>
                Real-time cryptographic verification and risk analysis.
              </p>
            </div>

            {/* Grid layout for Widgets */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
              
              {/* Left Column: Trust Graph */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minWidth: 0 }}>
                <TrustGraphWidget />
              </div>

              {/* Right Column: Risk Dashboard */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minWidth: 0 }}>
                <RiskDashboardWidget />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
