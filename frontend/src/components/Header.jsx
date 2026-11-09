import React from 'react';
import { Activity, Shield, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Header({ title, user, lastUpdated, isRefreshing, isSystemOnline = true, onRefreshData }) {
  // Extract time portion if lastUpdated is full date
  const timeOnly = lastUpdated ? (lastUpdated.includes(',') ? lastUpdated.split(',')[1]?.trim() : lastUpdated) : '12:04 AM';

  return (
    <header style={{
      height: '68px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      marginLeft: '260px',
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
    }}>
      {/* Header Title & Subtitle */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{title}</h2>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Intelligent Human & Computing Resource Allocation Engine
        </span>
      </div>

      {/* Right Header Status, Telemetry & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        
        {/* Backend Operational Health Status Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600',
          background: isSystemOnline ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${isSystemOnline ? '#a7f3d0' : '#fecaca'}`,
          color: isSystemOnline ? '#047857' : '#991b1b'
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: isSystemOnline ? '#10b981' : '#ef4444',
            boxShadow: isSystemOnline ? '0 0 8px #10b981' : '0 0 8px #ef4444',
            display: 'inline-block'
          }} />
          <span>{isSystemOnline ? 'All Systems Operational' : 'Backend System Offline'}</span>
        </div>

        {/* Last Updated Timestamp */}
        <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
          Last updated: <strong style={{ color: '#0f172a' }}>{timeOnly}</strong>
        </div>

        {/* Refresh Button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            title="Fetch live updates from API"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
              background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px',
              fontSize: '0.78rem', fontWeight: '600', color: '#334155', cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={13} className={isRefreshing ? 'spin-anim' : ''} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        )}

        {/* User Role Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          fontSize: '0.8rem'
        }}>
          <Shield size={14} color="#4f46e5" />
          <span style={{ color: '#64748b' }}>Role:</span>
          <strong style={{ color: '#0f172a' }}>{user?.role || 'Project Manager'}</strong>
        </div>
      </div>
    </header>
  );
}
