'use client';

import React, { useState } from 'react';

const COLORS = {
  bg: '#0a0a0f',
  panel: '#12121a',
  border: '#1e1e2e',
  textPrimary: '#f0f0ff',
  textSecondary: '#8b8ba8',
  bullish: '#10b981',
  bearish: '#ef4444',
  neutral: '#f59e0b',
  accent: '#6366f1',
  cyan: '#06b6d4',
};

const TrendUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
  </svg>
);

const DEMO_DATA = {
  sentiment: 'bullish',
  sentimentScore: 0.72,
  fetchedAt: new Date().toISOString(),
  stocks: [
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 1842.35, change: 1.24, changePercent: 0.68, volume: 8234567 },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', price: 1267.80, change: -5.40, changePercent: -0.42, volume: 6123456 },
    { symbol: 'SBIN.NS', name: 'State Bank', price: 842.15, change: 8.95, changePercent: 1.07, volume: 12345678 },
    { symbol: 'AXISBANK.NS', name: 'Axis Bank', price: 1156.60, change: -3.20, changePercent: -0.28, volume: 4321098 },
    { symbol: 'PAYTM.NS', name: 'Paytm', price: 642.40, change: 12.80, changePercent: 2.03, volume: 3210987 },
  ],
  riskMultiplier: 0.88,
  macroSignal: 'BFSI sector showing moderate positive momentum. Low systemic risk indicator.',
};

export default function MarketContextWidget({ data }: { data?: any }) {
  const [activeTab, setActiveTab] = useState<'stocks' | 'macro'>('stocks');

  const market = data || DEMO_DATA;
  const isBullish = (market.sentiment || market.sectorSentiment) === 'bullish';
  const isBearish = (market.sentiment || market.sectorSentiment) === 'bearish';
  const sentimentColor = isBullish ? COLORS.bullish : isBearish ? COLORS.bearish : COLORS.neutral;

  const stocks = market.stocks || DEMO_DATA.stocks;
  const sentimentScore = market.sentimentScore ?? market.sectorSentiment ?? 0.72;
  const isLive = !!data;

  return (
    <div style={{
      backgroundColor: COLORS.bg,
      color: COLORS.textPrimary,
      fontFamily: 'Inter, system-ui, sans-serif',
      minHeight: '520px',
      padding: '24px',
      borderRadius: '16px',
      border: `1px solid ${COLORS.border}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 250, height: 250,
        background: `radial-gradient(ellipse, ${sentimentColor}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, position: 'relative' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>NSE BFSI Market Context</h2>
          <p style={{ fontSize: 11, color: COLORS.textSecondary, margin: '2px 0 0 0' }}>
            Live sector data for risk engine macro enrichment
            {!isLive && <span style={{ marginLeft: 8, color: COLORS.neutral }}>(demo data)</span>}
          </p>
        </div>
        <div style={{
          padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800,
          letterSpacing: 1, border: `1px solid ${sentimentColor}`,
          color: sentimentColor, backgroundColor: `${sentimentColor}15`,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {isBullish ? <TrendUpIcon /> : <TrendDownIcon />}
          {(market.sentiment || market.sectorSentiment || 'NEUTRAL').toUpperCase()}
        </div>
      </div>

      {/* Sentiment bar + multiplier */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap',
      }}>
        {/* Sentiment gauge */}
        <div style={{
          flex: 1, minWidth: 160,
          padding: '14px 16px', borderRadius: 10,
          backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 8 }}>SECTOR SENTIMENT</div>
          <div style={{ height: 6, borderRadius: 3, backgroundColor: '#1e1e2e', overflow: 'hidden', marginBottom: 8 }}>
            <div style={{
              height: '100%', borderRadius: 3, width: `${(sentimentScore * 100).toFixed(0)}%`,
              background: `linear-gradient(90deg, ${sentimentColor}88, ${sentimentColor})`,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: sentimentColor }}>
            {(sentimentScore * 100).toFixed(0)}
            <span style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 400 }}>/100</span>
          </div>
        </div>

        {/* Risk multiplier */}
        {market.riskMultiplier !== undefined && (
          <div style={{
            flex: 1, minWidth: 140,
            padding: '14px 16px', borderRadius: 10,
            backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}`,
          }}>
            <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 8 }}>RISK MULTIPLIER</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.cyan }}>
              ×{market.riskMultiplier.toFixed(2)}
            </div>
            <div style={{ fontSize: 10, color: COLORS.textSecondary, marginTop: 4 }}>
              Applied to threshold scoring
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {(['stocks', 'macro'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            cursor: 'pointer', border: 'none', textTransform: 'uppercase', letterSpacing: 0.5,
            backgroundColor: activeTab === tab ? COLORS.accent : COLORS.panel,
            color: activeTab === tab ? '#fff' : COLORS.textSecondary,
            transition: 'all 0.2s',
          }}>
            {tab === 'stocks' ? '📈 Stocks' : '🌐 Macro Signal'}
          </button>
        ))}
      </div>

      {activeTab === 'stocks' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Column headers */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 90px 80px 70px',
            padding: '4px 10px', fontSize: 10, color: COLORS.textSecondary,
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            <span>Symbol / Name</span>
            <span style={{ textAlign: 'right' }}>Price</span>
            <span style={{ textAlign: 'right' }}>Change</span>
            <span style={{ textAlign: 'right' }}>Vol</span>
          </div>

          {stocks.slice(0, 8).map((stock: any, idx: number) => {
            const isUp = (stock.changePercent ?? stock.change ?? 0) >= 0;
            const changeVal = stock.changePercent ?? stock.change ?? 0;
            return (
              <div key={idx} style={{
                display: 'grid', gridTemplateColumns: '1fr 90px 80px 70px',
                padding: '10px', borderRadius: 8,
                backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}`,
                alignItems: 'center',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#2e2e4e')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = COLORS.border)}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textPrimary }}>
                    {stock.symbol?.replace('.NS', '') || stock.ticker}
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.textSecondary }}>{stock.name || stock.company}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>
                  ₹{(stock.price ?? stock.lastPrice ?? 0).toFixed(2)}
                </div>
                <div style={{
                  textAlign: 'right', fontSize: 11, fontWeight: 700,
                  color: isUp ? COLORS.bullish : COLORS.bearish,
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3,
                }}>
                  {isUp ? <TrendUpIcon /> : <TrendDownIcon />}
                  {Math.abs(changeVal).toFixed(2)}%
                </div>
                <div style={{ textAlign: 'right', fontSize: 10, color: COLORS.textSecondary }}>
                  {stock.volume ? `${(stock.volume / 1e6).toFixed(1)}M` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            padding: 16, borderRadius: 10,
            backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}`,
            fontSize: 13, lineHeight: 1.7, color: COLORS.textSecondary,
          }}>
            <div style={{ color: COLORS.textPrimary, fontWeight: 600, marginBottom: 8 }}>Macro Signal</div>
            {market.macroSignal || 'No macro signal available.'}
          </div>
          {market.fetchedAt && (
            <div style={{ fontSize: 11, color: COLORS.textSecondary, textAlign: 'right' }}>
              Data fetched at: {new Date(market.fetchedAt).toLocaleTimeString()}
            </div>
          )}
          <div style={{
            padding: '10px 14px', borderRadius: 8,
            backgroundColor: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
            fontSize: 11, color: COLORS.cyan, lineHeight: 1.6,
          }}>
            📊 Market signals are sourced from Yahoo Finance (NSE) with curated static fallback for offline/demo environments.
          </div>
        </div>
      )}
    </div>
  );
}
