import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  LayoutDashboard,
  BarChart3,
  Briefcase,
  FolderKanban,
  Flag,
  Users,
  Network,
  Activity,
  UserCheck,
  Award,
  Clock,
  Server,
  CheckSquare,
  GitPullRequest,
  AlertTriangle,
  BrainCircuit,
  Sparkles,
  Scale,
  Zap,
  Calendar,
  Sliders,
  ShieldCheck,
  Settings as SettingsIcon,
  FileText,
  RefreshCw,
  LogOut,
  Menu,
  X,
  Shield,
  Cpu
} from 'lucide-react';

export default function TopNavbar({
  user,
  onLogout,
  lastUpdated,
  isRefreshing,
  isSystemOnline = true,
  onRefreshData
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navStructure = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      items: [
        {
          label: 'Executive Overview',
          desc: 'Real-time KPIs & portfolio summary',
          path: '/dashboard',
          icon: LayoutDashboard
        },
        {
          label: 'System Analytics',
          desc: 'Resource metrics & optimization trends',
          path: '/dashboard',
          state: { view: 'analytics' },
          icon: BarChart3
        }
      ]
    },
    {
      id: 'projects',
      label: 'Projects',
      items: [
        {
          label: 'All Projects',
          desc: 'Software projects directory & budgets',
          path: '/projects',
          icon: Briefcase
        },
        {
          label: 'Project Portfolio',
          desc: 'Active projects & progress tracking',
          path: '/projects',
          state: { filterStatus: 'In Progress' },
          icon: FolderKanban
        },
        {
          label: 'Milestones',
          desc: 'Key delivery targets & Gantt milestones',
          path: '/schedule',
          icon: Flag
        }
      ]
    },
    {
      id: 'teams',
      label: 'Teams',
      items: [
        {
          label: 'Team Overview',
          desc: 'Squad directory & portfolio overview',
          path: '/teams',
          state: { tab: 'overview' },
          icon: Users
        },
        {
          label: 'Team Management',
          desc: 'Squad configuration & team leads',
          path: '/teams',
          state: { tab: 'management' },
          icon: Network
        },
        {
          label: 'Team Members',
          desc: 'Roster, availability & member allocation',
          path: '/teams',
          state: { tab: 'members' },
          icon: UserCheck
        },
        {
          label: 'Team Roles & Responsibilities',
          desc: 'Role definitions, skills & squad hierarchy',
          path: '/teams',
          state: { tab: 'roles' },
          icon: ShieldCheck
        },
        {
          label: 'Team Tasks',
          desc: 'Active sprint backlog & deliverable tracking',
          path: '/teams',
          state: { tab: 'tasks' },
          icon: CheckSquare
        },
        {
          label: 'Task Assignment',
          desc: 'Direct & AI-assisted squad allocation',
          path: '/teams',
          state: { tab: 'assignment' },
          icon: GitPullRequest
        },
        {
          label: 'Task Board',
          desc: '7-column Kanban status & workflow board',
          path: '/teams',
          state: { tab: 'board' },
          icon: FolderKanban
        },
        {
          label: 'Task Dependencies',
          desc: 'Precedent tasks & critical path tracking',
          path: '/teams',
          state: { tab: 'dependencies' },
          icon: Activity
        },
        {
          label: 'Task Approvals',
          desc: 'Code reviews, PRs & completion sign-offs',
          path: '/teams',
          state: { tab: 'approvals' },
          icon: Award
        },
        {
          label: 'Workload Distribution',
          desc: 'Capacity balance & overload risk meters',
          path: '/teams',
          state: { tab: 'workload' },
          icon: Scale
        },
        {
          label: 'Team Capacity Planning',
          desc: 'Velocity forecasting & headroom analysis',
          path: '/teams',
          state: { tab: 'capacity' },
          icon: Calendar
        }
      ]
    },
    {
      id: 'resources',
      label: 'Resources',
      items: [
        {
          label: 'Team Members',
          desc: 'Individual developer specialists',
          path: '/developers',
          icon: UserCheck
        },
        {
          label: 'Roles & Skills',
          desc: 'Technical capabilities & upgrade matrix',
          path: '/developers',
          state: { tab: 'roles' },
          icon: Award
        },
        {
          label: 'Resource Availability',
          desc: 'Real-time developer working status',
          path: '/developers',
          state: { tab: 'availability' },
          icon: Clock
        },
        {
          label: 'Infrastructure Resources',
          desc: 'Server nodes & telemetry metrics',
          path: '/monitoring',
          icon: Server
        }
      ]
    },
    {
      id: 'ai-optimization',
      label: 'AI Optimization',
      badge: 'AI',
      items: [
        {
          label: 'AI Task Assignment',
          desc: 'Two-level intelligent squad & dev engine',
          path: '/assignment',
          icon: BrainCircuit
        },
        {
          label: 'Optimization Results',
          desc: 'Q-Learning, GA & heuristic benchmarks',
          path: '/optimization',
          icon: Sparkles
        },
        {
          label: 'Workload Balancing',
          desc: 'Automated developer load redistribution',
          path: '/optimization',
          state: { tab: 'balancing' },
          icon: Scale
        },
        {
          label: 'AI Recommendations',
          desc: 'Live allocation matrix & suggestions',
          path: '/assignment',
          state: { recommendDev: 'Developer D', recommendTask: 'Payment Gateway API' },
          icon: Zap
        }
      ]
    },
    {
      id: 'planning-monitoring',
      label: 'Planning & Monitoring',
      items: [
        {
          label: 'Project Schedule',
          desc: 'Interactive Gantt timeline & dependencies',
          path: '/schedule',
          icon: Calendar
        },
        {
          label: 'Resource Monitoring',
          desc: 'CPU, memory & server telemetry',
          path: '/monitoring',
          icon: Activity
        },
        {
          label: 'What-if Simulation',
          desc: 'Disruption & stress test sandbox',
          path: '/simulator',
          icon: Sliders
        }
      ]
    },
    {
      id: 'administration',
      label: 'Administration',
      items: [
        {
          label: 'User Management',
          desc: 'Role access control & permissions',
          path: '/settings',
          state: { tab: 'roles' },
          icon: ShieldCheck
        },
        {
          label: 'Settings',
          desc: 'AI parameters & capacity thresholds',
          path: '/settings',
          state: { tab: 'config' },
          icon: SettingsIcon
        },
        {
          label: 'Audit Logs',
          desc: 'Security event history & tracking',
          path: '/settings',
          state: { tab: 'audit' },
          icon: FileText
        }
      ]
    }
  ];

  // Helper to determine if a top-level menu corresponds to the active route
  const isMenuActive = (menu) => {
    const currentPath = location.pathname;
    return menu.items.some(item => {
      const itemBase = item.path.split('?')[0];
      if (itemBase === '/dashboard' && currentPath === '/dashboard') return true;
      if (itemBase !== '/dashboard' && currentPath.startsWith(itemBase)) return true;
      return false;
    });
  };

  const handleMenuClick = (menuId) => {
    setUserMenuOpen(false);
    setActiveDropdown(prev => (prev === menuId ? null : menuId));
  };

  const handleSubItemClick = (path, state) => {
    let targetPath = path;
    if (state?.tab && !path.includes('?')) {
      targetPath = `${path}?tab=${state.tab}`;
    }
    navigate(targetPath, { state });
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const timeOnly = lastUpdated
    ? (lastUpdated.includes(',') ? lastUpdated.split(',')[1]?.trim() : lastUpdated)
    : '12:04 AM';

  const userInitial = user?.name ? user.name[0].toUpperCase() : 'U';

  return (
    <header
      ref={navRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        background: '#1749B8',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.15)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Top Main Navigation Bar */}
      <div
        style={{
          height: '62px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          maxWidth: '1800px',
          margin: '0 auto'
        }}
      >
        {/* Left: Brand Logo & Title */}
        <div
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0
          }}
        >
          {/* Smartsheet-style clean white badge */}
          <div
            style={{
              width: '32px',
              height: '32px',
              background: '#ffffff',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          >
            <Cpu size={20} color="#1749B8" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                color: '#ffffff',
                fontSize: '1.05rem',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap'
              }}
            >
              Resource Optimizer
            </span>
            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: '800',
                background: 'rgba(255, 255, 255, 0.22)',
                color: '#ffffff',
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              AI
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Menus (8 Menus) */}
        <nav
          className="top-navbar-menus"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            margin: '0 20px',
            flex: 1,
            justifyContent: 'center'
          }}
        >
          {navStructure.map(menu => {
            const isOpen = activeDropdown === menu.id;
            const isActive = isMenuActive(menu);

            return (
              <div key={menu.id} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => handleMenuClick(menu.id)}
                  aria-expanded={isOpen}
                  style={{
                    background: isOpen
                      ? 'rgba(255, 255, 255, 0.24)'
                      : isActive
                      ? 'rgba(255, 255, 255, 0.16)'
                      : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: isActive || isOpen ? '600' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.18s ease-in-out',
                    whiteSpace: 'nowrap',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isOpen && !isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isOpen && !isActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span>{menu.label}</span>
                  <ChevronDown
                    size={13}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      opacity: 0.85
                    }}
                  />
                  {menu.badge && (
                    <span
                      style={{
                        fontSize: '0.6rem',
                        fontWeight: '800',
                        background: '#38bdf8',
                        color: '#0c4a6e',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        marginLeft: '2px'
                      }}
                    >
                      {menu.badge}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu Box */}
                {isOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      minWidth: menu.items.length > 6 ? '580px' : '270px',
                      maxWidth: 'calc(100vw - 32px)',
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '10px',
                      boxShadow: '0 16px 36px -4px rgba(15, 23, 42, 0.2), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
                      border: '1px solid #e2e8f0',
                      zIndex: 1050,
                      animation: 'dropdownFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {/* Tiny Top Arrow */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(45deg)',
                        width: '12px',
                        height: '12px',
                        background: '#ffffff',
                        borderTop: '1px solid #e2e8f0',
                        borderLeft: '1px solid #e2e8f0'
                      }}
                    />

                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'grid',
                        gridTemplateColumns: menu.items.length > 6 ? 'repeat(2, minmax(260px, 1fr))' : '1fr',
                        gap: '4px'
                      }}
                    >
                      {menu.items.map(subItem => {
                        const SubIcon = subItem.icon;
                        const searchTab = new URLSearchParams(location.search).get('tab');
                        const isSubActive =
                          location.pathname === subItem.path.split('?')[0] &&
                          (!subItem.state?.tab || subItem.state.tab === location.state?.tab || subItem.state.tab === searchTab);

                        return (
                          <div
                            key={subItem.label}
                            onClick={() => handleSubItemClick(subItem.path, subItem.state)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              background: isSubActive ? '#eff6ff' : 'transparent',
                              transition: 'all 0.15s ease',
                              borderLeft: isSubActive ? '3px solid #1749B8' : '3px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSubActive) e.currentTarget.style.background = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSubActive) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: isSubActive ? '#1749B8' : '#eff6ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              <SubIcon size={16} color={isSubActive ? '#ffffff' : '#1749B8'} />
                            </div>

                            <div>
                              <div
                                style={{
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  color: isSubActive ? '#1749B8' : '#0f172a',
                                  lineHeight: 1.2
                                }}
                              >
                                {subItem.label}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.72rem',
                                  color: '#64748b',
                                  marginTop: '2px',
                                  lineHeight: 1.2
                                }}
                              >
                                {subItem.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Operational Status, Refresh Action, User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Live Operational Status Pill */}
          <div
            title={isSystemOnline ? 'Spring Boot REST backend & MySQL are live' : 'Backend is unreachable'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: '600',
              background: isSystemOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${isSystemOnline ? 'rgba(52, 211, 153, 0.4)' : 'rgba(248, 113, 113, 0.4)'}`,
              color: '#ffffff'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isSystemOnline ? '#34d399' : '#f87171',
                boxShadow: isSystemOnline ? '0 0 8px #34d399' : '0 0 8px #f87171'
              }}
            />
            <span style={{ display: 'none', md: 'inline' }} className="status-text">
              {isSystemOnline ? 'Operational' : 'Offline'}
            </span>
          </div>

          {/* Quick Refresh Button */}
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              title={`Fetch live updates from database (Last: ${timeOnly})`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: '600',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)'; }}
            >
              <RefreshCw
                size={13}
                style={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                }}
              />
              <span className="refresh-text">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}

          {/* User Profile Pill & Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setActiveDropdown(null);
                setUserMenuOpen(prev => !prev);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px 4px 5px',
                background: userMenuOpen ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '9999px',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                if (!userMenuOpen) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                if (!userMenuOpen) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              }}
            >
              {/* Avatar circle */}
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#1749B8',
                  fontWeight: '700',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {userInitial}
              </div>

              <div style={{ textAlign: 'left', lineHeight: 1.1, display: 'none', lg: 'block' }} className="user-text-pill">
                <div style={{ fontSize: '0.8rem', fontWeight: '600', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || 'Project Manager'}
                </div>
                <div style={{ fontSize: '0.64rem', opacity: 0.85, textTransform: 'uppercase' }}>
                  {user?.role || 'PM'}
                </div>
              </div>

              <ChevronDown size={12} style={{ opacity: 0.8 }} />
            </button>

            {/* Account Details Dropdown */}
            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  background: '#ffffff',
                  borderRadius: '10px',
                  padding: '12px',
                  boxShadow: '0 16px 36px -4px rgba(15, 23, 42, 0.2), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
                  border: '1px solid #e2e8f0',
                  zIndex: 1050,
                  animation: 'dropdownFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>
                    {user?.name || 'Authorized User'}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                    {user?.email || 'user@company.com'}
                  </div>
                  <div style={{ marginTop: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        color: '#1749B8',
                        background: '#eff6ff',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid #bfdbfe'
                      }}
                    >
                      Role: {user?.role || 'Project Manager'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/settings', { state: { tab: 'roles' } });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      color: '#334155',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                  >
                    <ShieldCheck size={14} color="#1749B8" />
                    <span>Role Access Matrix</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/settings', { state: { tab: 'config' } });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      color: '#334155',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                  >
                    <SettingsIcon size={14} color="#1749B8" />
                    <span>System Settings</span>
                  </button>

                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '4px' }}>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        color: '#e11d48',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#fff1f2'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                    >
                      <LogOut size={14} color="#e11d48" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Visible on smaller viewports when mobileMenuOpen is true) */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#0f3cae',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            maxHeight: 'calc(100vh - 62px)',
            overflowY: 'auto',
            padding: '16px 20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}
        >
          {navStructure.map(menu => (
            <div key={menu.id} style={{ marginBottom: '14px' }}>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{menu.label}</span>
                {menu.badge && (
                  <span
                    style={{
                      fontSize: '0.58rem',
                      fontWeight: '800',
                      background: '#38bdf8',
                      color: '#0c4a6e',
                      padding: '1px 5px',
                      borderRadius: '4px'
                    }}
                  >
                    {menu.badge}
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}>
                {menu.items.map(subItem => {
                  const SubIcon = subItem.icon;
                  return (
                    <button
                      key={subItem.label}
                      onClick={() => handleSubItemClick(subItem.path, subItem.state)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <SubIcon size={16} color="#ffffff" style={{ opacity: 0.9 }} />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{subItem.label}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)' }}>{subItem.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '12px', marginTop: '16px' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: '#e11d48',
                color: '#ffffff',
                border: 'none',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out ({user?.name || 'User'})</span>
            </button>
          </div>
        </div>
      )}

      {/* Global CSS for TopNavbar Dropdown Animation and Responsive Breakpoints */}
      <style>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -6px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1180px) {
          .top-navbar-menus {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: flex !important;
          }
          .user-text-pill, .status-text, .refresh-text {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
