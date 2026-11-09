import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Plus,
  UserCheck,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Edit2,
  Clock,
  Code,
  Send,
  LayoutGrid,
  Activity,
  Award,
  Calendar,
  Scale,
  BrainCircuit,
  Sparkles,
  GitPullRequest,
  CheckSquare,
  AlertTriangle,
  FolderKanban,
  TrendingUp,
  Search,
  Filter,
  BarChart2,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Cpu,
  Layers,
  Sliders
} from 'lucide-react';

export default function Teams({
  user,
  teams = [],
  projects = [],
  tasks = [],
  developers = [],
  onAddTeam,
  onUpdateTeam,
  onDeleteTeam,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAssignTask,
  onUpdateDeveloper
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected Team & Active Tab State
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Modal States
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedMemberForUpgrade, setSelectedMemberForUpgrade] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Task Filter & Search inside Tasks Tab
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('ALL');

  // AI Rebalance Notification Toast State
  const [aiToastMessage, setAiToastMessage] = useState(null);

  // Form State for Create Team
  const [newTeamName, setNewTeamName] = useState('');
  const [newProjectName, setNewProjectName] = useState(projects[0]?.name || 'Enterprise E-Commerce Platform V2');
  const [newTeamLead, setNewTeamLead] = useState('Rahul Kumar');
  const [newTeamDescription, setNewTeamDescription] = useState('Product engineering squad responsible for core deliverables.');
  const [newTeamStatus, setNewTeamStatus] = useState('Active');

  // Form State for Add Task
  const [taskFormName, setTaskFormName] = useState('');
  const [taskFormPriority, setTaskFormPriority] = useState('HIGH');
  const [taskFormComplexity, setTaskFormComplexity] = useState(6);
  const [taskFormDuration, setTaskFormDuration] = useState(4);
  const [taskFormDeadline, setTaskFormDeadline] = useState('2026-10-15');
  const [taskFormSkills, setTaskFormSkills] = useState('Java, Spring Boot');
  const [taskFormAssignedDev, setTaskFormAssignedDev] = useState('');

  // Capacity Planning Slider State
  const [targetSprintPoints, setTargetSprintPoints] = useState(45);

  const isManager = !user || user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER' || user.role === 'Project Manager';

  // Synchronize Tab and Selected Team based on URL Query Parameters or Location State
  useEffect(() => {
    const queryTab = searchParams.get('tab') || location.state?.tab;
    const queryStatus = searchParams.get('status') || location.state?.statusFilter;
    const teamNameParam = searchParams.get('team') || location.state?.selectedTeamName;

    if (queryStatus) {
      setTaskStatusFilter(queryStatus.toUpperCase());
    }

    if (location.state?.searchTask) {
      setTaskSearchQuery(location.state.searchTask);
    }

    if (teamNameParam && teams.length > 0) {
      const match = teams.find(t => t.name.toLowerCase().includes(teamNameParam.toLowerCase()));
      if (match) setSelectedTeam(match);
    }

    if (queryTab) {
      if (queryTab === 'management') {
        setSelectedTeam(null);
      } else {
        setActiveTab(queryTab);
        // If navigating to a specific tab without a selected team, pick first team
        if (!selectedTeam && teams.length > 0) {
          setSelectedTeam(teams[0]);
        }
      }
    }
  }, [searchParams, location.state, teams]);

  // Helper to retrieve all tasks belonging to a specific team
  const getTeamTasks = (team) => {
    if (!team) return [];
    const teamMemberNames = (team.members || []).map(m => (m.name || '').toLowerCase());
    const currentTeamName = (team.name || '').toLowerCase();
    const teamProjectName = (team.projectName || '').toLowerCase();

    return tasks.filter(t => {
      const tTeam = (t.teamName || '').toLowerCase();
      if (tTeam && tTeam === currentTeamName) return true;

      const devName = (t.assignedDeveloper?.name || t.assignedDev || '').toLowerCase();
      if (devName && teamMemberNames.includes(devName)) return true;

      if (team.tasks && team.tasks.some(st => st.id === t.id || (st.name && st.name.toLowerCase() === (t.name || '').toLowerCase()))) {
        return true;
      }

      if (!tTeam && t.projectName && t.projectName.toLowerCase() === teamProjectName) {
        return true;
      }

      return false;
    });
  };

  // Helper to compute team metrics
  const getTeamMetrics = (team) => {
    const squadTasks = getTeamTasks(team);
    const completed = squadTasks.filter(t => (t.status || '').toUpperCase() === 'COMPLETED').length;
    const active = squadTasks.filter(t => ['IN_PROGRESS', 'TESTING', 'UNDER REVIEW', 'UNDER_REVIEW', 'ASSIGNED'].includes((t.status || '').toUpperCase())).length;
    const pending = squadTasks.filter(t => ['NOT_STARTED', 'BLOCKED', ''].includes((t.status || '').toUpperCase())).length;
    const capacity = team.capacity || Math.min(96, Math.max(50, Math.round(squadTasks.length * 14 + (team.members?.length || 5) * 8)));
    const performance = team.performance || (completed > 0 ? Math.min(98, 86 + completed * 4) : 92);

    return {
      totalTasks: squadTasks.length,
      completedTasks: completed,
      activeTasks: active,
      pendingTasks: pending,
      capacity,
      performance,
      tasks: squadTasks
    };
  };

  // Capacity styling helper
  const getCapacityColor = (cap) => {
    if (cap >= 80) return { bg: '#fff1f2', border: '#fecdd3', text: '#e11d48', bar: '#e11d48', status: 'High Risk' };
    if (cap >= 65) return { bg: '#fffbeb', border: '#fde68a', text: '#b45309', bar: '#d97706', status: 'Moderate Load' };
    return { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857', bar: '#059669', status: 'Optimal' };
  };

  const getRoleBadge = (role) => {
    if (!role) return 'badge-purple';
    if (role.includes('Lead') || role.includes('Manager')) return 'badge-purple';
    if (role.includes('Backend')) return 'badge-blue';
    if (role.includes('Frontend') || role.includes('UI')) return 'badge-amber';
    if (role.includes('QA') || role.includes('Testing') || role.includes('Automation')) return 'badge-emerald';
    return 'badge-rose';
  };

  const getPriorityBadge = (p) => {
    switch ((p || '').toUpperCase()) {
      case 'CRITICAL':
      case 'VERY_HIGH': return 'badge-rose';
      case 'HIGH': return 'badge-amber';
      case 'MEDIUM': return 'badge-blue';
      default: return 'badge-purple';
    }
  };

  const normalizeStatus = (status) => {
    const s = (status || '').toUpperCase().replace(/\s+/g, '_');
    if (s.includes('NOT_STARTED') || s === 'PENDING') return 'NOT_STARTED';
    if (s.includes('ASSIGNED')) return 'ASSIGNED';
    if (s.includes('IN_PROGRESS') || s === 'DEVELOPMENT' || s === 'ACTIVE') return 'IN_PROGRESS';
    if (s.includes('TESTING') || s === 'QA') return 'TESTING';
    if (s.includes('REVIEW') || s.includes('UNDER_REVIEW')) return 'UNDER_REVIEW';
    if (s.includes('COMPLETED') || s === 'DONE') return 'COMPLETED';
    if (s.includes('BLOCKED')) return 'BLOCKED';
    return 'NOT_STARTED';
  };

  // Handlers
  const handleOpenTeamWorkspace = (team, tab = 'overview') => {
    setSelectedTeam(team);
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const handleBackToAllTeams = () => {
    setSelectedTeam(null);
    setSearchParams({ tab: 'management' });
  };

  const handleCreateTeamSubmit = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const newTeamObj = {
      name: newTeamName.trim(),
      projectName: newProjectName,
      teamLead: newTeamLead,
      capacity: 65,
      status: newTeamStatus,
      description: newTeamDescription,
      members: [
        { id: Date.now() + 1, name: newTeamLead, role: 'Team Lead', workload: 55, status: 'Available', email: `${newTeamLead.toLowerCase().replace(/\s+/g, '')}@company.com`, skills: ['Management', 'Architecture'] },
        { id: Date.now() + 2, name: 'Priyanshu Sharma', role: 'Backend Developer', workload: 70, status: 'Available', email: 'priyanshu@company.com', skills: ['Java', 'Spring Boot'] },
        { id: Date.now() + 3, name: 'Arjun Kumar', role: 'Frontend Developer', workload: 60, status: 'Available', email: 'arjun@company.com', skills: ['React', 'CSS'] }
      ],
      tasks: []
    };

    if (onAddTeam) onAddTeam(newTeamObj);
    setNewTeamName('');
    setShowCreateTeamModal(false);
  };

  const handleCreateTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskFormName.trim()) return;

    const newTaskObj = {
      name: taskFormName.trim(),
      priority: taskFormPriority.toUpperCase(),
      complexity: parseInt(taskFormComplexity, 10),
      estimatedDurationDays: parseInt(taskFormDuration, 10),
      deadline: taskFormDeadline,
      status: taskFormAssignedDev ? 'IN_PROGRESS' : 'NOT_STARTED',
      teamName: selectedTeam?.name || 'E-Commerce Squad',
      projectName: selectedTeam?.projectName || 'Enterprise E-Commerce Platform V2',
      assignedDev: taskFormAssignedDev || '',
      assignedDeveloper: taskFormAssignedDev ? { name: taskFormAssignedDev } : null,
      requiredSkills: taskFormSkills.split(',').map(s => s.trim()).filter(Boolean).map(s => ({ name: s }))
    };

    if (onAddTask) {
      onAddTask(newTaskObj);
    }

    setTaskFormName('');
    setTaskFormAssignedDev('');
    setShowAddTaskModal(false);
  };

  // Drag and Drop for Kanban Board
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskIdStr = e.dataTransfer.getData('text/plain');
    const taskId = parseInt(taskIdStr, 10);
    if (!taskId) return;

    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask && onUpdateTask) {
      onUpdateTask(taskId, { ...targetTask, status: targetStatus });
    }
  };

  // Quick move step for Kanban
  const kanbanColumns = [
    { key: 'NOT_STARTED', label: 'Not Started', color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
    { key: 'ASSIGNED', label: 'Assigned', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
    { key: 'IN_PROGRESS', label: 'In Progress', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    { key: 'TESTING', label: 'Testing', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    { key: 'UNDER_REVIEW', label: 'Under Review', color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff' },
    { key: 'COMPLETED', label: 'Completed', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
    { key: 'BLOCKED', label: 'Blocked', color: '#e11d48', bg: '#fff1f2', border: '#fecdd3' }
  ];

  const handleMoveKanban = (task, direction) => {
    const currentNormalized = normalizeStatus(task.status);
    const currentIndex = kanbanColumns.findIndex(c => c.key === currentNormalized);
    if (currentIndex === -1) return;

    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < kanbanColumns.length) {
      const nextStatus = kanbanColumns[nextIndex].key;
      if (onUpdateTask) {
        onUpdateTask(task.id, { ...task, status: nextStatus });
      }
    }
  };

  // AI Workload Rebalancing Engine
  const handleApplyAiRebalance = () => {
    if (!selectedTeam) return;

    const members = selectedTeam.members || [];
    if (members.length < 2) return;

    const overloadedMember = members.find(m => (m.workload || 0) >= 75) || members[0];
    const availableMember = members.find(m => (m.workload || 0) < 65 && m.name !== overloadedMember.name) || members[members.length - 1];

    const currentSquadTasks = getTeamTasks(selectedTeam);
    const taskToMove = currentSquadTasks.find(t => {
      const devName = t.assignedDeveloper?.name || t.assignedDev;
      return devName === overloadedMember.name && (t.status || '').toUpperCase() !== 'COMPLETED';
    });

    if (taskToMove && onAssignTask) {
      onAssignTask(taskToMove.id, availableMember.name);
      setAiToastMessage(`AI Rebalance Executed: Reallocated "${taskToMove.name}" from ${overloadedMember.name} to ${availableMember.name}. Squad capacity variance reduced by 18%!`);
      setTimeout(() => setAiToastMessage(null), 5000);
    } else {
      setAiToastMessage('AI Rebalance Analysis: Squad workloads are currently balanced within acceptable operational variance.');
      setTimeout(() => setAiToastMessage(null), 4000);
    }
  };

  // Upgrade Member Skills
  const handleSaveSkillUpgrade = () => {
    if (!newSkillInput.trim() || !selectedMemberForUpgrade) return;

    const skillToAdd = newSkillInput.trim();
    if (selectedTeam) {
      const updatedMembers = (selectedTeam.members || []).map(m => {
        if (m.name === selectedMemberForUpgrade.name) {
          const currentSkills = m.skills || [];
          return {
            ...m,
            skills: currentSkills.includes(skillToAdd) ? currentSkills : [...currentSkills, skillToAdd]
          };
        }
        return m;
      });

      if (onUpdateTeam) {
        onUpdateTeam(selectedTeam.id, { ...selectedTeam, members: updatedMembers });
      }
    }

    setShowUpgradeModal(false);
    setNewSkillInput('');
    setSelectedMemberForUpgrade(null);
  };

  // =========================================================================
  // RENDER VIEW 1: CENTRAL WORKSPACE (ALL TEAMS CARDS GRID)
  // =========================================================================
  if (!selectedTeam) {
    const totalSquads = teams.length;
    const totalSquadMembers = teams.reduce((acc, t) => acc + (t.members?.length || 0), 0);
    const totalSquadTasks = tasks.length;
    const avgSquadCapacity = teams.length ? Math.round(teams.reduce((acc, t) => acc + (t.capacity || 70), 0) / teams.length) : 72;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: '#1749B8', padding: '8px', borderRadius: '8px', color: '#ffffff' }}>
                <Users size={22} />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Enterprise Teams & Squad Operations
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginTop: '4px' }}>
              Centralized workspace for squad management, role allocation, team workload, and integrated sprint task execution.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {isManager && (
              <button
                className="btn-primary"
                onClick={() => setShowCreateTeamModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: '#1749B8' }}
              >
                <Plus size={16} /> Create Team Squad
              </button>
            )}
          </div>
        </div>

        {/* Global Summary KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Active Squads</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1749B8', marginTop: '4px' }}>{totalSquads} Teams</div>
            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px', fontWeight: '600' }}>● All 100% Operational</div>
          </div>

          <div className="glass-card" style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Team Members</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{totalSquadMembers} Specialists</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Engineers, QA, DevOps & Leads</div>
          </div>

          <div className="glass-card" style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Team Tasks</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#4f46e5', marginTop: '4px' }}>{totalSquadTasks} Tasks</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Integrated across all squad backlogs</div>
          </div>

          <div className="glass-card" style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Average Capacity Load</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: avgSquadCapacity >= 80 ? '#e11d48' : '#059669', marginTop: '4px' }}>{avgSquadCapacity}%</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Headroom: {100 - avgSquadCapacity}% available</div>
          </div>
        </div>

        {/* TEAM CARDS GRID */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Enterprise Project Squads ({teams.length})
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Click any squad card or "View Team" to open its dedicated workspace.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '22px' }}>
            {teams.map((team) => {
              const metrics = getTeamMetrics(team);
              const capStyle = getCapacityColor(metrics.capacity);
              const memberCount = team.members ? team.members.length : 5;

              return (
                <div
                  key={team.id || team.name}
                  className="glass-card interactive-card"
                  onClick={() => handleOpenTeamWorkspace(team, 'overview')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <div>
                    {/* Header: Squad Name & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '10px', color: '#1749B8' }}>
                          <Users size={22} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.12rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                            {team.name}
                          </h3>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            Lead: <strong style={{ color: '#0f172a' }}>{team.teamLead || 'Rahul Kumar'}</strong>
                          </div>
                        </div>
                      </div>
                      <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                        ● {team.status || 'Active'}
                      </span>
                    </div>

                    {/* Assigned Project */}
                    <div style={{ padding: '9px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', marginBottom: '14px', fontSize: '0.82rem' }}>
                      <span style={{ color: '#64748b' }}>Assigned Project:</span>{' '}
                      <strong style={{ color: '#1749B8' }}>{team.projectName || 'Enterprise E-Commerce Platform V2'}</strong>
                    </div>

                    {/* 4 Task & Member Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Members</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{memberCount}</div>
                      </div>
                      <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #dbeafe' }}>
                        <div style={{ fontSize: '0.68rem', color: '#1d4ed8', fontWeight: '700', textTransform: 'uppercase' }}>Active</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1d4ed8', marginTop: '2px' }}>{metrics.activeTasks}</div>
                      </div>
                      <div style={{ background: '#ecfdf5', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #a7f3d0' }}>
                        <div style={{ fontSize: '0.68rem', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>Completed</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#047857', marginTop: '2px' }}>{metrics.completedTasks}</div>
                      </div>
                      <div style={{ background: '#faf5ff', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #e9d5ff' }}>
                        <div style={{ fontSize: '0.68rem', color: '#7e22ce', fontWeight: '700', textTransform: 'uppercase' }}>Pending</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#7e22ce', marginTop: '2px' }}>{metrics.pendingTasks}</div>
                      </div>
                    </div>

                    {/* Team Capacity Bar with Color Thresholds */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                        <span style={{ color: '#64748b', fontWeight: '500' }}>Team Capacity Utilization</span>
                        <strong style={{ color: capStyle.text }}>{metrics.capacity}% ({capStyle.status})</strong>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${metrics.capacity}%`, height: '100%', background: capStyle.bar, transition: 'width 0.4s ease' }} />
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', textAlign: 'right' }}>
                        Headroom: {100 - metrics.capacity}% capacity remaining
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Overall Performance + View Team Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={16} color="#d97706" />
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>
                        {metrics.performance}% Performance
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTeamWorkspace(team, 'overview');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        background: '#1749B8',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(23, 73, 184, 0.25)'
                      }}
                    >
                      <span>View Team</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CREATE TEAM MODAL */}
        {showCreateTeamModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px'
          }}>
            <div className="glass-card" style={{ width: '520px', maxWidth: '95vw', background: '#ffffff', borderRadius: '14px', padding: '26px', boxShadow: '0 20px 40px rgba(0,0,0,0.18)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Create Project Squad</h3>
                <button onClick={() => setShowCreateTeamModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: '#64748b' }}>×</button>
              </div>

              <form onSubmit={handleCreateTeamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Squad / Team Name</label>
                  <input
                    type="text"
                    required
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g. Core API Squad"
                    style={{ width: '100%', padding: '10px 12px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Assigned Project</label>
                  <select
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Team Lead</label>
                  <input
                    type="text"
                    required
                    value={newTeamLead}
                    onChange={(e) => setNewTeamLead(e.target.value)}
                    placeholder="Rahul Kumar"
                    style={{ width: '100%', padding: '10px 12px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Squad Mission & Description</label>
                  <textarea
                    rows="3"
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowCreateTeamModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ background: '#1749B8' }}>Create Squad</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // RENDER VIEW 2: DEDICATED INDIVIDUAL TEAM WORKSPACE
  // =========================================================================
  const teamMetrics = getTeamMetrics(selectedTeam);
  const teamTasksList = teamMetrics.tasks;
  const capacityStyle = getCapacityColor(teamMetrics.capacity);

  // Filter tasks in Tab 3 (Tasks)
  const filteredTasks = teamTasksList.filter(t => {
    const taskStatus = (t.status || '').toUpperCase();
    const matchStatus = (taskStatusFilter === 'ALL') || (taskStatus === taskStatusFilter);
    const q = taskSearchQuery.toLowerCase().trim();
    const matchSearch = !q || (t.name || '').toLowerCase().includes(q) || (t.assignedDev || '').toLowerCase().includes(q) || (t.assignedDeveloper?.name || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification Banner */}
      {aiToastMessage && (
        <div style={{
          padding: '12px 18px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#1e40af',
          fontSize: '0.85rem',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#2563eb" />
            <span>{aiToastMessage}</span>
          </div>
          <button onClick={() => setAiToastMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e40af', fontWeight: 'bold' }}>×</button>
        </div>
      )}

      {/* Top Workspace Header & Squad Switcher Bar */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px 22px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleBackToAllTeams}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={14} /> All Teams
              </button>

              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {selectedTeam.name}
              </h2>

              <span className="badge badge-emerald">
                ● {selectedTeam.status || 'Active'}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span>Project: <strong style={{ color: '#1749B8' }}>{selectedTeam.projectName || 'Enterprise E-Commerce Platform V2'}</strong></span>
              <span>Lead: <strong style={{ color: '#0f172a' }}>{selectedTeam.teamLead || 'Rahul Kumar'}</strong></span>
              <span>Capacity: <strong style={{ color: capacityStyle.text }}>{teamMetrics.capacity}% ({capacityStyle.status})</strong></span>
              <span>Performance: <strong style={{ color: '#059669' }}>★ {teamMetrics.performance}%</strong></span>
            </div>
          </div>

          {/* Squad Switcher Dropdown & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>Switch Squad:</span>
              <select
                value={selectedTeam.id || selectedTeam.name}
                onChange={(e) => {
                  const target = teams.find(t => (t.id || t.name).toString() === e.target.value.toString());
                  if (target) setSelectedTeam(target);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  background: '#ffffff'
                }}
              >
                {teams.map(t => (
                  <option key={t.id || t.name} value={t.id || t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            {isManager && (
              <button
                onClick={() => setShowAddTaskModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#1749B8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Plus size={15} /> Add Squad Task
              </button>
            )}
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS (Covers All 11 Submenu Direct Access Views) */}
        <div style={{ display: 'flex', gap: '4px', borderTop: '1px solid #f1f5f9', paddingTop: '12px', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'members', label: `Members (${selectedTeam.members?.length || 0})`, icon: UserCheck },
            { id: 'roles', label: 'Roles & Skills', icon: ShieldCheck },
            { id: 'tasks', label: `Team Tasks (${teamTasksList.length})`, icon: CheckSquare },
            { id: 'board', label: 'Task Board (Kanban)', icon: FolderKanban },
            { id: 'assignment', label: 'Task Assignment', icon: GitPullRequest },
            { id: 'dependencies', label: 'Dependencies', icon: Activity },
            { id: 'approvals', label: 'Approvals', icon: Award },
            { id: 'workload', label: 'Workload Balance', icon: Scale },
            { id: 'capacity', label: 'Capacity Planning', icon: Calendar },
            { id: 'performance', label: 'Performance', icon: TrendingUp }
          ].map(tab => {
            const TabIcon = tab.icon;
            const isTabActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  border: 'none',
                  borderRadius: '8px',
                  background: isTabActive ? '#eff6ff' : 'transparent',
                  color: isTabActive ? '#1749B8' : '#64748b',
                  fontSize: '0.82rem',
                  fontWeight: isTabActive ? '700' : '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  borderBottom: isTabActive ? '2px solid #1749B8' : '2px solid transparent'
                }}
              >
                <TabIcon size={15} color={isTabActive ? '#1749B8' : '#64748b'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: OVERVIEW */}
      {/* ===================================================================== */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="glass-card" style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Squad Members</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{selectedTeam.members?.length || 6} Engineers</div>
              <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px' }}>1 Lead, {((selectedTeam.members?.length || 6) - 1)} Developers/QA</div>
            </div>

            <div className="glass-card" style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Active Sprint Tasks</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1749B8', marginTop: '2px' }}>{teamMetrics.activeTasks} In Progress</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{teamMetrics.completedTasks} Completed, {teamMetrics.pendingTasks} Pending</div>
            </div>

            <div className="glass-card" style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Capacity Utilization</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: capacityStyle.text, marginTop: '2px' }}>{teamMetrics.capacity}%</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{100 - teamMetrics.capacity}% available headroom</div>
            </div>

            <div className="glass-card" style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Efficiency Rating</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669', marginTop: '2px' }}>★ {teamMetrics.performance}%</div>
              <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px' }}>High Delivery Velocity</div>
            </div>
          </div>

          {/* Squad Details & Associated Project */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            <div className="glass-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#1749B8" /> Squad Mission & Information
              </h4>
              <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                {selectedTeam.description || 'Specialized development squad responsible for core product features, microservices, and end-to-end sprint deliverables.'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Team Lead</div>
                  <strong style={{ color: '#0f172a' }}>{selectedTeam.teamLead || 'Rahul Kumar'}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Status</div>
                  <strong style={{ color: '#059669' }}>● {selectedTeam.status || 'Active'}</strong>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={16} color="#4f46e5" /> Associated Project
              </h4>
              <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', marginBottom: '14px' }}>
                <div style={{ fontWeight: '700', color: '#1749B8', fontSize: '0.95rem' }}>
                  {selectedTeam.projectName || 'Enterprise E-Commerce Platform V2'}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '2px' }}>
                  Delivery target: 30 Sep 2026 • Budget: ₹15,20,000
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => handleTabChange('board')}
                  style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', color: '#334155' }}
                >
                  Open Kanban Board →
                </button>
                <button
                  onClick={handleApplyAiRebalance}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', color: '#047857' }}
                >
                  <Sparkles size={14} /> AI Workload Balance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2 & 4: MEMBERS & ROLES */}
      {/* ===================================================================== */}
      {(activeTab === 'members' || activeTab === 'roles') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Squad Members & Role Responsibilities ({selectedTeam.members?.length || 0})
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '2px' }}>
                Monitor individual workload meters, skill sets, and capability upgrades.
              </p>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(15,23,42,0.03)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Specialist & Email</th>
                  <th style={{ padding: '12px 16px' }}>Squad Role</th>
                  <th style={{ padding: '12px 16px' }}>Technical Skills</th>
                  <th style={{ padding: '12px 16px' }}>Workload %</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(selectedTeam.members || []).map((m, idx) => {
                  const mWorkload = m.workload || 50;
                  const isOverloaded = mWorkload >= 75;

                  return (
                    <tr key={m.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{m.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{m.email}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${getRoleBadge(m.role)}`}>
                          {m.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {(m.skills || ['Java', 'React']).map((sk, sIdx) => (
                            <span key={sIdx} style={{ fontSize: '0.7rem', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', color: '#334155' }}>
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '70px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${mWorkload}%`, height: '100%', background: isOverloaded ? '#e11d48' : (mWorkload >= 60 ? '#d97706' : '#059669') }} />
                          </div>
                          <strong style={{ fontSize: '0.8rem', color: isOverloaded ? '#e11d48' : '#334155' }}>{mWorkload}%</strong>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: m.status === 'Overloaded' ? '#e11d48' : (m.status === 'Busy' ? '#d97706' : '#059669') }}>
                          ● {m.status || 'Available'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setSelectedMemberForUpgrade(m);
                              setShowUpgradeModal(true);
                            }}
                            style={{ padding: '4px 8px', fontSize: '0.72rem', background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            + Upgrade Skills
                          </button>
                          <button
                            onClick={() => {
                              setTaskFormAssignedDev(m.name);
                              setShowAddTaskModal(true);
                            }}
                            style={{ padding: '4px 8px', fontSize: '0.72rem', background: '#eff6ff', color: '#1749B8', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}
                          >
                            Assign Task
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: TEAM TASKS */}
      {/* ===================================================================== */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Controls: Search, Status Filter, Add Task */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '240px' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search squad tasks..."
                  value={taskSearchQuery}
                  onChange={(e) => setTaskSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: '600', color: '#334155' }}
              >
                <option value="ALL">All Statuses ({teamTasksList.length})</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="TESTING">Testing</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddTaskModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: '#1749B8',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Plus size={15} /> Add Task to Squad
            </button>
          </div>

          {/* Tasks Table */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(15,23,42,0.03)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Task Name</th>
                  <th style={{ padding: '12px 16px' }}>Priority</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Specialist</th>
                  <th style={{ padding: '12px 16px' }}>Status Updater</th>
                  <th style={{ padding: '12px 16px' }}>Deadline</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                      No tasks match current filter. Click "+ Add Task to Squad" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => {
                    const assignedDevName = task.assignedDeveloper?.name || task.assignedDev || '';
                    const assignedMemberObj = (selectedTeam.members || []).find(m => m.name === assignedDevName);

                    return (
                      <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{task.name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            Complexity: {task.complexity || 5}/10 • Duration: {task.estimatedDurationDays || task.duration || 3}d
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`badge ${getPriorityBadge(task.priority)}`}>
                            {task.priority || 'MEDIUM'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <select
                            value={assignedDevName}
                            onChange={(e) => {
                              const newDev = e.target.value;
                              if (onAssignTask) {
                                onAssignTask(task.id, newDev);
                              }
                            }}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              color: assignedDevName ? '#0f172a' : '#94a3b8',
                              background: '#ffffff'
                            }}
                          >
                            <option value="">-- Unassigned --</option>
                            {(selectedTeam.members || []).map(m => (
                              <option key={m.id || m.name} value={m.name}>
                                {m.name} ({m.workload}% cap)
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <select
                            value={normalizeStatus(task.status)}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              if (onUpdateTask) {
                                onUpdateTask(task.id, { ...task, status: newStatus });
                              }
                            }}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              color: task.status === 'COMPLETED' ? '#047857' : (task.status === 'IN_PROGRESS' ? '#1d4ed8' : '#6b21a8')
                            }}
                          >
                            <option value="NOT_STARTED">NOT_STARTED</option>
                            <option value="ASSIGNED">ASSIGNED</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="TESTING">TESTING</option>
                            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="BLOCKED">BLOCKED</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.8rem' }}>
                          {task.deadline || '30 Sep 2026'}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete task "${task.name}" from MySQL database?`)) {
                                if (onDeleteTask) onDeleteTask(task.id);
                              }
                            }}
                            style={{ padding: '4px 8px', border: 'none', background: '#fff1f2', color: '#e11d48', borderRadius: '6px', cursor: 'pointer' }}
                            title="Delete Task"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: TASK BOARD (7-COLUMN KANBAN BOARD) */}
      {/* ===================================================================== */}
      {activeTab === 'board' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Squad Sprint Kanban Board (7 Columns)
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
                Drag tasks between workflow columns or use arrow shortcuts to advance deliverables.
              </p>
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#1749B8', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Card
            </button>
          </div>

          {/* 7 Horizontal Kanban Columns with Horizontal Scroll */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(260px, 1fr))',
              gap: '14px',
              overflowX: 'auto',
              paddingBottom: '14px'
            }}
          >
            {kanbanColumns.map(col => {
              const colTasks = teamTasksList.filter(t => normalizeStatus(t.status) === col.key);

              return (
                <div
                  key={col.key}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.key)}
                  style={{
                    background: col.bg,
                    border: `1px solid ${col.border}`,
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '480px'
                  }}
                >
                  {/* Column Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                      <strong style={{ fontSize: '0.85rem', color: col.color }}>{col.label}</strong>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: '800', color: col.color, border: `1px solid ${col.border}` }}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Task Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    {colTasks.length === 0 ? (
                      <div style={{ padding: '24px 10px', textAlign: 'center', fontSize: '0.76rem', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                        Drag tasks here
                      </div>
                    ) : (
                      colTasks.map(t => {
                        const devName = t.assignedDeveloper?.name || t.assignedDev || 'Unassigned';

                        return (
                          <div
                            key={t.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, t.id)}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              padding: '12px',
                              boxShadow: '0 2px 6px rgba(15,23,42,0.05)',
                              cursor: 'grab',
                              transition: 'transform 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                              <span className={`badge ${getPriorityBadge(t.priority)}`} style={{ fontSize: '0.66rem' }}>
                                {t.priority || 'MEDIUM'}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                                #{t.id}
                              </span>
                            </div>

                            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a', marginBottom: '8px' }}>
                              {t.name}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#eff6ff', color: '#1749B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800' }}>
                                  {devName[0]}
                                </div>
                                <span style={{ fontWeight: '600', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {devName}
                                </span>
                              </div>

                              {/* Move Left / Right Step Buttons */}
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  onClick={() => handleMoveKanban(t, 'prev')}
                                  style={{ padding: '2px 4px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc', cursor: 'pointer' }}
                                  title="Move to previous status"
                                >
                                  <ChevronLeft size={12} />
                                </button>
                                <button
                                  onClick={() => handleMoveKanban(t, 'next')}
                                  style={{ padding: '2px 4px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc', cursor: 'pointer' }}
                                  title="Move to next status"
                                >
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: TASK ASSIGNMENT (Direct Squad Allocation + AI Suitability) */}
      {/* ===================================================================== */}
      {activeTab === 'assignment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Squad Task Assignment Matrix
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '2px' }}>
              Assign tasks directly to squad members with real-time capacity checks and AI suitability recommendations.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {teamTasksList.map(task => {
                const assignedDev = task.assignedDeveloper?.name || task.assignedDev || '';

                return (
                  <div key={task.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span className={`badge ${getPriorityBadge(task.priority)}`}>
                        {task.priority || 'MEDIUM'}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: '700' }}>
                        ● {task.status || 'NOT_STARTED'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>
                      {task.name}
                    </h4>

                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
                      Estimated: {task.estimatedDurationDays || 3} days • Complexity: {task.complexity || 5}/10
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Assign to Squad Specialist:
                      </label>
                      <select
                        value={assignedDev}
                        onChange={(e) => {
                          const targetDev = e.target.value;
                          if (onAssignTask) onAssignTask(task.id, targetDev);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.82rem',
                          fontWeight: '600'
                        }}
                      >
                        <option value="">-- Choose Member --</option>
                        {(selectedTeam.members || []).map(m => (
                          <option key={m.id || m.name} value={m.name}>
                            {m.name} — {m.role} (Capacity: {m.workload}%)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 8: TASK DEPENDENCIES */}
      {/* ===================================================================== */}
      {activeTab === 'dependencies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Squad Task Dependencies & Critical Path
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '2px' }}>
              Prerequisite sequence and milestone dependencies across deliverables.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { phase: 'Phase 1: Architecture & Data Schema', task: 'Database Migration Pipeline', role: 'Backend Developer', status: 'COMPLETED', next: 'Phase 2' },
                { phase: 'Phase 2: Core Microservices & APIs', task: 'Payment Gateway API', role: 'Backend Developer', status: 'IN_PROGRESS', next: 'Phase 3' },
                { phase: 'Phase 3: Integration & Frontend UI', task: 'Checkout UI Flow', role: 'Frontend Developer', status: 'NOT_STARTED', next: 'Phase 4' },
                { phase: 'Phase 4: Verification & QA Testing', task: 'Payment Testing & Automation Suite', role: 'QA Engineer', status: 'NOT_STARTED', next: 'Production' }
              ].map((dep, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: dep.status === 'COMPLETED' ? '#ecfdf5' : '#eff6ff', color: dep.status === 'COMPLETED' ? '#059669' : '#1749B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>{dep.phase}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>{dep.task}</div>
                    <div style={{ fontSize: '0.75rem', color: '#4f46e5' }}>Responsible Role: {dep.role}</div>
                  </div>
                  <div>
                    <span className={`badge ${dep.status === 'COMPLETED' ? 'badge-emerald' : (dep.status === 'IN_PROGRESS' ? 'badge-blue' : 'badge-purple')}`}>
                      {dep.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 9: TASK APPROVALS */}
      {/* ===================================================================== */}
      {activeTab === 'approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Squad Task Approvals & Sign-off Queue
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '2px' }}>
              Review completed deliverables, code review approvals, and QA sign-offs before production merging.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Payment Gateway Security Sign-off', dev: 'Priyanshu Sharma', type: 'Security Review', date: 'Today, 2:30 PM' },
                { title: 'Checkout Responsive Layout PR #42', dev: 'Arjun Kumar', type: 'Code Review', date: 'Yesterday' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      Submitted by: <strong>{item.dev}</strong> • {item.type} • {item.date}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setAiToastMessage(`Sign-off Approved: "${item.title}" successfully approved.`);
                        setTimeout(() => setAiToastMessage(null), 3500);
                      }}
                      style={{ padding: '6px 14px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                    >
                      ✓ Approve Sign-off
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 10: WORKLOAD DISTRIBUTION & AI REBALANCING */}
      {/* ===================================================================== */}
      {activeTab === 'workload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Squad Workload Distribution & Balancing
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '2px' }}>
                Capacity breakdown per squad member with automated AI load redistribution.
              </p>
            </div>

            <button
              onClick={handleApplyAiRebalance}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
              }}
            >
              <Sparkles size={16} /> Run AI Workload Rebalance
            </button>
          </div>

          {/* Overload Alert Callout if any member >= 75% */}
          {(selectedTeam.members || []).some(m => (m.workload || 0) >= 75) && (
            <div style={{ padding: '14px 18px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={20} color="#e11d48" />
              <div style={{ fontSize: '0.82rem', color: '#9f1239' }}>
                <strong>Capacity Alert:</strong> One or more squad members have exceeded 75% capacity load. Click <strong>Run AI Workload Rebalance</strong> above to automatically redistribute tasks and restore optimal delivery velocity.
              </div>
            </div>
          )}

          {/* Member Workload Bars Grid */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(selectedTeam.members || []).map(m => {
                const wl = m.workload || 50;
                const isOver = wl >= 75;

                return (
                  <div key={m.id || m.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div>
                        <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{m.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '8px' }}>({m.role})</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', color: isOver ? '#e11d48' : (wl >= 60 ? '#d97706' : '#059669') }}>
                        {wl}% Capacity
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${wl}%`, height: '100%', background: isOver ? '#e11d48' : (wl >= 60 ? '#d97706' : '#059669'), transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 11: TEAM CAPACITY PLANNING */}
      {/* ===================================================================== */}
      {activeTab === 'capacity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Sprint Capacity Planning & Headroom Forecaster
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '2px' }}>
              Forecast squad engineering headroom vs sprint story points commitment.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                Planned Sprint Story Points: <strong>{targetSprintPoints} pts</strong>
              </label>
              <input
                type="range"
                min="20"
                max="80"
                value={targetSprintPoints}
                onChange={(e) => setTargetSprintPoints(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#1749B8' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>Available Engineering Hours</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                  {((selectedTeam.members?.length || 5) * 35)} hrs
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>Committed Demand</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1749B8', marginTop: '4px' }}>
                  {targetSprintPoints * 4} hrs
                </div>
              </div>
              <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '0.72rem', color: '#047857', fontWeight: '700' }}>Forecasted Headroom</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#047857', marginTop: '4px' }}>
                  {Math.max(0, ((selectedTeam.members?.length || 5) * 35) - (targetSprintPoints * 4))} hrs buffer
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: PERFORMANCE */}
      {/* ===================================================================== */}
      {activeTab === 'performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Squad Historical Performance & Velocity
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '2px' }}>
              Delivery efficiency, task completion velocity, and sprint health metrics.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Overall Performance Score</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#059669', marginTop: '4px' }}>
                ★ {teamMetrics.performance}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px' }}>Top tier productivity</div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Sprint Velocity</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1749B8', marginTop: '4px' }}>
                44 pts / sprint
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Consistent delivery cadence</div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Code Review Turnaround</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#7e22ce', marginTop: '4px' }}>
                2.1 Hours
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Peer review compliance</div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: ADD TASK TO SQUAD */}
      {/* ===================================================================== */}
      {showAddTaskModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '540px', maxWidth: '95vw', background: '#ffffff', borderRadius: '14px', padding: '26px', boxShadow: '0 20px 40px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Add Task to Squad</h3>
                <div style={{ fontSize: '0.78rem', color: '#1749B8', fontWeight: '600' }}>{selectedTeam?.name} • {selectedTeam?.projectName}</div>
              </div>
              <button onClick={() => setShowAddTaskModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: '#64748b' }}>×</button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Task Name</label>
                <input
                  type="text"
                  required
                  value={taskFormName}
                  onChange={(e) => setTaskFormName(e.target.value)}
                  placeholder="e.g. Stripe Payment Integration"
                  style={{ width: '100%', padding: '9px 12px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Priority</label>
                  <select
                    value={taskFormPriority}
                    onChange={(e) => setTaskFormPriority(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Assign Squad Member</label>
                  <select
                    value={taskFormAssignedDev}
                    onChange={(e) => setTaskFormAssignedDev(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  >
                    <option value="">-- Unassigned --</option>
                    {(selectedTeam.members || []).map(m => (
                      <option key={m.id || m.name} value={m.name}>
                        {m.name} ({m.workload}% load)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={taskFormDuration}
                    onChange={(e) => setTaskFormDuration(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Deadline</label>
                  <input
                    type="date"
                    value={taskFormDeadline}
                    onChange={(e) => setTaskFormDeadline(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={taskFormSkills}
                  onChange={(e) => setTaskFormSkills(e.target.value)}
                  placeholder="Java, Spring Boot, Security"
                  style={{ width: '100%', padding: '9px 12px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ background: '#1749B8' }}>Save Squad Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: UPGRADE MEMBER SKILLS */}
      {/* ===================================================================== */}
      {showUpgradeModal && selectedMemberForUpgrade && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '440px', maxWidth: '90vw', background: '#ffffff', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
              Upgrade Specialist Skills
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '16px' }}>
              Member: <strong>{selectedMemberForUpgrade.name}</strong> ({selectedMemberForUpgrade.role})
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Current Capabilities:</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {(selectedMemberForUpgrade.skills || []).map((sk, i) => (
                  <span key={i} className="badge badge-blue">{sk}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Add New Technical Skill</label>
              <input
                type="text"
                placeholder="e.g. Kubernetes, GraphQL, AWS"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowUpgradeModal(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={handleSaveSkillUpgrade} style={{ background: '#1749B8' }}>
                Add Capability
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
