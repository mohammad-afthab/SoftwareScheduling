import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Users,
  BrainCircuit,
  BarChart3,
  Calendar,
  Server,
  Zap,
  LogOut,
  Cpu,
  Shield
} from 'lucide-react';

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const role = user?.role || 'PROJECT_MANAGER';

  const allNavItems = [
    { path: '/dashboard', label: 'Dashboard', subtitle: 'Overview', icon: LayoutDashboard, roles: ['ADMIN', 'PROJECT_MANAGER', 'Project Manager', 'DEVELOPER', 'Developer'] },
    { path: '/projects', label: 'Projects', subtitle: 'Projects and milestones', icon: Briefcase, roles: ['ADMIN', 'PROJECT_MANAGER', 'Project Manager', 'DEVELOPER', 'Developer'] },
    { path: '/teams', label: 'Teams', subtitle: 'Squads and team leads', icon: Users, roles: ['ADMIN', 'PROJECT_MANAGER', 'Project Manager', 'DEVELOPER', 'Developer'] },
    { path: '/developers', label: 'Members & Roles', subtitle: 'Skills and availability', icon: Users, roles: ['ADMIN', 'PROJECT_MANAGER', 'Project Manager', 'DEVELOPER', 'Developer'] },
    { path: '/tasks', label: 'Tasks', subtitle: 'Assignment and status', icon: CheckSquare, roles: ['ADMIN', 'PROJECT_MANAGER', 'Project Manager', 'DEVELOPER', 'Developer'] },
    { path: '/assignment', label: 'AI Task Assignment', subtitle: 'Core AI engine', icon: BrainCircuit, badge: 'Core', roles: ['ADMIN', 'PROJECT_MANAGER', 'Project Manager'] },
    { path: '/optimizer', label: 'Optimization Results', subtitle: 'AI benchmarks', icon: BarChart3, roles: ['ADMIN', 'PROJECT_MANAGER', 'Project Manager'] },
    { path: '/schedule', label: 'Project Schedule', subtitle: 'Gantt timeline', icon: Calendar, roles: ['ADMIN', 'PROJECT_MANAGER', 'Project Manager', 'DEVELOPER', 'Developer'] },
    { path: '/monitoring', label: 'Resource Monitoring', subtitle: 'Infrastructure & telemetry', icon: Server, roles: ['ADMIN', 'PROJECT_MANAGER', 'Project Manager'] },
    { path: '/simulator', label: 'Simulation', subtitle: 'What-if analysis', icon: Zap, badge: 'What-If', roles: ['ADMIN', 'PROJECT_MANAGER', 'Project Manager'] },
    { path: '/settings', label: 'Settings & Audit Logs', subtitle: 'System config & logs', icon: Shield, badge: 'Audit', roles: ['ADMIN', 'PROJECT_MANAGER', 'Project Manager'] }
  ];

  const filteredNavItems = allNavItems.filter(item => 
    item.roles.some(r => r.toUpperCase() === role.toUpperCase())
  );

  return (
    <aside style={{
      width: '260px',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px 14px',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
      boxShadow: '2px 0 12px rgba(15, 23, 42, 0.03)'
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 20px 8px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          padding: '8px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
        }}>
          <Cpu size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>Resource Optimizer</h1>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>AI Hybrid Platform</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
        {filteredNavItems.map((item) => {
          const Icon = item.icon || LayoutDashboard;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                color: isActive ? '#4f46e5' : '#64748b',
                background: isActive ? '#eff6ff' : 'transparent',
                border: isActive ? '1px solid #c7d2fe' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '600', lineHeight: 1.2 }}>{item.label}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.85, marginTop: '2px' }}>{item.subtitle}</div>
                </div>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.62rem',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  background: '#e0e7ff',
                  color: '#4338ca',
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div style={{
        padding: '12px',
        background: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px'
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {user?.name || 'Project Manager'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#4f46e5', fontWeight: '600' }}>
            {user?.role || 'Project Manager'}
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Logout"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#e11d48',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
