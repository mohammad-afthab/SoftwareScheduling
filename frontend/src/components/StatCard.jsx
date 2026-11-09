import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  color = '#4f46e5',
  actionText,
  onClick,
  isActive = false
}) {
  return (
    <div
      onClick={onClick}
      className={`glass-card ${onClick ? 'interactive-card' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        borderRadius: '12px',
        border: isActive ? `2px solid ${color}` : '1px solid #e2e8f0',
        background: isActive ? '#f8fafc' : '#ffffff',
        boxShadow: isActive ? '0 8px 20px rgba(79, 70, 229, 0.12)' : '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isActive ? 'translateY(-2px)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(79, 70, 229, 0.12)';
          e.currentTarget.style.borderColor = color || '#818cf8';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = isActive ? 'translateY(-2px)' : 'none';
          e.currentTarget.style.boxShadow = isActive ? '0 8px 20px rgba(79, 70, 229, 0.12)' : '0 1px 3px 0 rgba(15, 23, 42, 0.05)';
          e.currentTarget.style.borderColor = isActive ? color : '#e2e8f0';
        }
      }}
    >
      {/* Top Header Row: Title & Icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            background: isActive ? '#e0e7ff' : '#f1f5f9',
            border: '1px solid #e2e8f0',
            padding: '9px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}>
            <Icon size={20} color={color} />
          </div>
        )}
      </div>

      {/* Middle Value & Subtext */}
      <div style={{ margin: '14px 0 16px 0' }}>
        <h3 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '0 0 4px 0', color: '#0f172a', letterSpacing: '-0.02em' }}>
          {value}
        </h3>
        {subtext && (
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '500' }}>
            {subtext}
          </span>
        )}
      </div>

      {/* Bottom Row: View Details Link */}
      {actionText && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          color: color,
          fontSize: '0.82rem',
          fontWeight: '700',
          transition: 'gap 0.2s ease'
        }}>
          <span>{actionText}</span>
          <ArrowRight size={14} color={color} />
        </div>
      )}
    </div>
  );
}
