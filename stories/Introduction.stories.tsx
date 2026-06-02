import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Introduction',
  parameters: {
    docs: { description: { component: 'Stellar Dev Dashboard — Component Catalog' } },
  },
};
export default meta;

export const Overview: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 680, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', lineHeight: 1.6 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        ✦ Stellar Dev Dashboard — Component Catalog
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
        A real-time, open-source developer dashboard for the Stellar network.
      </p>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Component Groups</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 24 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '6px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Group</th>
            <th style={{ textAlign: 'left', padding: '6px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Components</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Dashboard', 'Card, StatCard, CopyableValue'],
            ['Layout', 'ThemeToggle, NetworkIndicator, OfflineBanner, ResponsiveContainer'],
            ['Errors', 'NetworkError, RetryButton'],
            ['Notifications', 'NotificationItem, ScreenReaderAnnouncer'],
            ['Accessibility', 'AccessibilitySettings, KeyboardNavigation'],
            ['Mobile', 'BottomSheet'],
            ['Dashboard/Utilities', 'PriceTicker, Faucet, RealTimeLedger, ExplorerEmbed'],
            ['Charts', 'NetworkMetricsChart, BalanceHistoryChart, AccountActivityChart'],
          ].map(([group, components]) => (
            <tr key={group} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--cyan)', whiteSpace: 'nowrap' }}>{group}</td>
              <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{components}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Features</h2>
      <ul style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <li>🌗 <strong>Theme toolbar</strong> — switch Dark / Light on every story</li>
        <li>📱 <strong>Viewport toolbar</strong> — test Mobile (375px), Tablet (768px), Desktop (1280px)</li>
        <li>♿ <strong>Accessibility panel</strong> — axe-core checks run automatically on every story</li>
      </ul>
    </div>
  ),
  parameters: { layout: 'padded' },
};
