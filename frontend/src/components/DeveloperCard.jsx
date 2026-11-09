import React from 'react';
import { Star, CheckCircle, AlertTriangle, Trash2, TrendingUp, Zap } from 'lucide-react';

export default function DeveloperCard({ user, developer, onDeleteDeveloper, onIncreaseCapability }) {
  const isManager = !user || user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER' || user.role === 'Project Manager';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return 'badge-emerald';
      case 'Busy': return 'badge-amber';
      case 'Overloaded': return 'badge-rose';
      default: return 'badge-purple';
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{developer.name}</h3>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{developer.email}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className={`badge ${getStatusBadge(developer.status)}`}>
            {developer.status || 'Available'}
          </span>
          {isManager && (
            <button
              title="Delete Developer"
              onClick={() => onDeleteDeveloper && onDeleteDeveloper(developer.id)}
              style={{ padding: '4px 6px', fontSize: '0.72rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: '6px', cursor: 'pointer' }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Skills */}
      <div>
        <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Skills & Capability</span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
          {developer.skills?.map((skill, idx) => (
            <span key={idx} style={{
              background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '500'
            }}>
              {typeof skill === 'object' ? skill.name : skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience & Workload */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
        background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontSize: '0.82rem'
      }}>
        <div>
          <div style={{ color: '#64748b' }}>Experience</div>
          <strong style={{ color: '#0f172a' }}>{developer.yearsExperience} Years</strong>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Hourly Rate</div>
          <strong style={{ color: '#0f172a' }}>${developer.hourlyRate}/hr</strong>
        </div>
      </div>

      {/* Workload Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
          <span style={{ color: '#64748b' }}>Workload Capacity</span>
          <strong style={{ color: (developer.workload ?? developer.currentWorkload ?? 0) > 75 ? '#e11d48' : '#059669' }}>{developer.workload ?? developer.currentWorkload ?? 0}%</strong>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${developer.workload ?? developer.currentWorkload ?? 0}%`, height: '100%',
            background: (developer.workload ?? developer.currentWorkload ?? 0) > 75 ? 'linear-gradient(90deg, #f59e0b, #e11d48)' : 'linear-gradient(90deg, #4f46e5, #059669)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Manager Capability Upgrade Action */}
      {isManager && (
        <button
          onClick={() => onIncreaseCapability && onIncreaseCapability(developer)}
          style={{
            marginTop: '4px', padding: '6px 12px', fontSize: '0.78rem', background: '#eff6ff', color: '#4f46e5',
            border: '1px solid #c7d2fe', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}
        >
          <TrendingUp size={14} /> Upgrade Developer Capability / Rate
        </button>
      )}
    </div>
  );
}
