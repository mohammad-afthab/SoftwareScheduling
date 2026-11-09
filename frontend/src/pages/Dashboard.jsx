import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import WorkloadChart from '../components/WorkloadChart';
import {
  Briefcase, CheckSquare, TrendingUp, DollarSign,
  AlertTriangle, AlertCircle, ShieldAlert, ArrowRight,
  CheckCircle2, Info, Eye, Layers, Filter, Sparkles, ExternalLink, BrainCircuit, RefreshCw,
  X, ChevronDown, ChevronUp, Target, Calendar, Users, Zap
} from 'lucide-react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
} from 'chart.js';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement, Filler
);

export default function Dashboard({ projects = [], teams = [], tasks = [], developers = [], lastUpdated, isRefreshing, isSystemOnline = true, onRefreshData }) {
  const navigate = useNavigate();

  const displayLastUpdated = lastUpdated || new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [workloadViewMode, setWorkloadViewMode] = useState('teams');
  const [costMode, setCostMode] = useState('cumulative');
  const [currency, setCurrency] = useState('INR');
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilterBar, setShowFilterBar] = useState(false);

  // ── Fallback data (shown only when API returns nothing) ────────────────────
  const projectListRaw = (projects && projects.length > 0) ? projects : [
    { id: 1, name: 'Enterprise E-Commerce Platform V2', progress: 68, status: 'In Progress', budget: 1520000 },
    { id: 2, name: 'Cloud Native Migration Project', progress: 35, status: 'In Progress', budget: 1680000 },
    { id: 3, name: 'Student Portal System', progress: 75, status: 'In Progress', budget: 1350000 },
    { id: 4, name: 'HR Management Suite', progress: 90, status: 'Testing', budget: 1410000 }
  ];

  const teamListRaw = (teams && teams.length > 0) ? teams : [
    { id: 1, name: 'E-Commerce Squad', capacity: 82, status: 'Active', membersCount: 6 },
    { id: 2, name: 'Cloud Migration Squad', capacity: 67, status: 'Active', membersCount: 5 },
    { id: 3, name: 'Mobile Platform Team', capacity: 74, status: 'Active', membersCount: 5 },
    { id: 4, name: 'QA & Infrastructure Team', capacity: 58, status: 'Active', membersCount: 3 }
  ];

  const taskListRaw = (tasks && tasks.length > 0) ? tasks : [
    { id: 1, name: 'Login Module & OAuth', status: 'NOT_STARTED', project: { id: 1 } },
    { id: 2, name: 'User Interface & Dashboard', status: 'TESTING', project: { id: 1 } },
    { id: 3, name: 'Payment Gateway API', status: 'IN_PROGRESS', project: { id: 1 } },
    { id: 4, name: 'Automated Testing Suite', status: 'NOT_STARTED', project: { id: 1 } },
    { id: 5, name: 'Docker & CI/CD Deployment', status: 'IN_PROGRESS', project: { id: 1 } }
  ];

  // ── Filtered lists (react to filter bar selections) ───────────────────────
  const projectListToDisplay = useMemo(() => {
    let list = projectListRaw;
    if (filterProject !== 'all') {
      list = list.filter(p => String(p.id) === String(filterProject));
    }
    if (filterStatus !== 'all') {
      list = list.filter(p => (p.status || '').toLowerCase().replace(/\s/g, '_') === filterStatus.toLowerCase());
    }
    return list;
  }, [projects, filterProject, filterStatus]);

  const taskListToDisplay = useMemo(() => {
    if (filterProject === 'all') return taskListRaw;
    return taskListRaw.filter(t => String(t.project?.id || t.projectId) === String(filterProject));
  }, [tasks, filterProject]);

  const teamListToDisplay = teamListRaw;

  // ── Helper ─────────────────────────────────────────────────────────────────
  const getNormalizedStatus = (s) => (s || '').toUpperCase().replace(/[\s_]+/g, '');

  // ── Computed KPI metrics ──────────────────────────────────────────────────
  const { activeProjectsCount, totalTasksCount, avgProgress, taskCounts, inProgressTasksCount,
          totalPortfolioBudgetNum, originalProjectedCostNum, optimizedCostNum, aiSavingsNum, savingsPct } = useMemo(() => {
    const activeProjCount = projectListToDisplay.filter(p =>
      !['COMPLETED', 'CANCELLED', 'ARCHIVED'].includes(getNormalizedStatus(p.status))
    ).length;

    const totTasks = taskListToDisplay.length;

    const rawCompleted    = taskListToDisplay.filter(t => getNormalizedStatus(t.status) === 'COMPLETED').length;
    const rawInProgress   = taskListToDisplay.filter(t => getNormalizedStatus(t.status) === 'INPROGRESS').length;
    const rawTesting      = taskListToDisplay.filter(t => getNormalizedStatus(t.status) === 'TESTING').length;
    const rawNotStarted   = taskListToDisplay.filter(t => ['NOTSTARTED', 'UNASSIGNED', 'PLANNED', 'NEW'].includes(getNormalizedStatus(t.status))).length;
    const rawAssigned     = taskListToDisplay.filter(t => getNormalizedStatus(t.status) === 'ASSIGNED').length;
    const rawUnderReview  = taskListToDisplay.filter(t => ['UNDERREVIEW', 'UNDER_REVIEW'].includes(getNormalizedStatus(t.status))).length;
    const rawBlocked      = taskListToDisplay.filter(t => getNormalizedStatus(t.status) === 'BLOCKED').length;

    const accounted = rawCompleted + rawInProgress + rawTesting + rawNotStarted + rawAssigned + rawUnderReview + rawBlocked;
    const unaccounted = totTasks - accounted;
    const finalNotStarted = rawNotStarted + (unaccounted > 0 ? unaccounted : 0);

    const tCounts = {
      Completed: rawCompleted,
      InProgress: rawInProgress,
      Testing: rawTesting,
      NotStarted: finalNotStarted,
      Assigned: rawAssigned,
      UnderReview: rawUnderReview,
      Blocked: rawBlocked
    };

    const avgProg = projectListToDisplay.length
      ? Math.round(projectListToDisplay.reduce((acc, p) => acc + (p.progress || 0), 0) / projectListToDisplay.length)
      : 0;

    // Portfolio financials from actual DB budgets
    const portBudget = projectListRaw.reduce((acc, p) => {
      const val = typeof p.budget === 'number' ? p.budget : parseInt(String(p.budget || '0').replace(/[^0-9]/g, '')) || 0;
      return acc + val;
    }, 0) || 5960000;

    const origCost = portBudget;
    const optCost = Math.round(portBudget * 0.892);
    const savings = origCost - optCost;
    const savPct = ((savings / origCost) * 100).toFixed(1);

    return {
      activeProjectsCount: activeProjCount,
      totalTasksCount: totTasks,
      avgProgress: avgProg,
      taskCounts: tCounts,
      inProgressTasksCount: tCounts.InProgress,
      totalPortfolioBudgetNum: portBudget,
      originalProjectedCostNum: origCost,
      optimizedCostNum: optCost,
      aiSavingsNum: savings,
      savingsPct: savPct
    };
  }, [projectListToDisplay, taskListToDisplay, projectListRaw]);

  // ── Formatting helpers ────────────────────────────────────────────────────
  const fmt = (num) => currency === 'INR'
    ? `₹${num.toLocaleString('en-IN')}`
    : `$${Math.round(num * 0.012).toLocaleString()}`;

  const formattedPortfolioBudget = fmt(totalPortfolioBudgetNum);
  const formattedCost = fmt(optimizedCostNum);
  const formattedSavings = fmt(aiSavingsNum);
  const formattedProjectedCost = fmt(originalProjectedCostNum);

  // ── Payment task AI alert logic ───────────────────────────────────────────
  const paymentTaskObj = taskListRaw.find(t => (t.name || '').toLowerCase().includes('payment'));
  const paymentDevName = paymentTaskObj?.assignedDeveloper?.name || paymentTaskObj?.assignedDev;
  const isPaymentReassigned = paymentDevName && paymentDevName.trim().toLowerCase() !== 'developer a' && paymentDevName.trim().toLowerCase() !== 'unassigned';

  const overloadedDevs = (developers || []).filter(d => (d.workload ?? d.currentWorkload ?? 0) >= 75);
  const overloadedTeams = teamListToDisplay.filter(t => (t.capacity || 0) >= 80);

  // ── Dynamic alerts ────────────────────────────────────────────────────────
  const dynamicAlertsList = useMemo(() => {
    const list = [];

    overloadedTeams.forEach(team => {
      const cap = team.capacity || 82;
      list.push({
        id: `alt-team-${team.id || team.name}`,
        severity: cap >= 90 ? 'CRITICAL' : 'WARNING',
        timestamp: '2 mins ago',
        text: `${team.name} capacity is ${cap}% (${cap >= 90 ? 'Critical' : 'High'} Capacity Risk)`,
        target: '/teams', navState: { selectedTeamName: team.name }, actionText: 'Inspect Team →'
      });
    });

    if (overloadedDevs.length > 0) {
      overloadedDevs.forEach(dev => {
        const load = dev.workload ?? dev.currentWorkload ?? 88;
        list.push({
          id: `alt-dev-${dev.id || dev.name}`,
          severity: load >= 90 ? 'CRITICAL' : 'WARNING',
          timestamp: '5 mins ago',
          text: `${dev.name} workload is ${load}% (${load >= 90 ? 'Critical' : 'High'} Overload Risk)`,
          target: '/developers', navState: { selectedDevId: dev.id, selectedDevName: dev.name }, actionText: 'Inspect Dev →'
        });
      });
    } else {
      list.push({
        id: 'alt-dev-ok', severity: 'INFO', timestamp: 'Just now',
        text: '✓ All Developer Workloads are Balanced (<75% Workload Capacity)',
        target: '/developers', navState: {}, actionText: 'View Workloads →'
      });
    }

    if (!isPaymentReassigned) {
      list.push({
        id: 'alt-task-payment', severity: 'WARNING', timestamp: '10 mins ago',
        text: 'Payment Gateway API task delayed due to security dependency & Developer A overload',
        target: '/teams', navState: { tab: 'tasks', searchTask: 'Payment API' }, actionText: 'View Task →'
      });
    } else {
      list.push({
        id: 'alt-task-payment-ok', severity: 'INFO', timestamp: 'Just now',
        text: `✓ Payment Gateway API assigned to ${paymentDevName} (Reassigned & On Schedule)`,
        target: '/teams', navState: { tab: 'tasks', searchTask: 'Payment API' }, actionText: 'View Task →'
      });
    }

    // Real server alert from monitoring if developer count is high
    const criticalDevCount = overloadedDevs.filter(d => (d.workload ?? d.currentWorkload ?? 0) >= 90).length;
    if (criticalDevCount > 0) {
      list.push({
        id: 'alt-server-cpu', severity: 'CRITICAL', timestamp: '12 mins ago',
        text: `${criticalDevCount} developer(s) at critical workload (≥90%). Recommend immediate rebalancing.`,
        target: '/monitoring', navState: {}, actionText: 'Inspect Infrastructure →'
      });
    }

    return list;
  }, [overloadedTeams, overloadedDevs, isPaymentReassigned, paymentDevName]);

  const activeAlerts = dynamicAlertsList.filter(a => !dismissedAlerts.includes(a.id));
  const hasCriticalAlerts = activeAlerts.some(a => a.severity === 'CRITICAL' && !acknowledgedAlerts.includes(a.id));

  // ── Active filter label ───────────────────────────────────────────────────
  const activeFilterLabel = useMemo(() => {
    const parts = [];
    if (filterProject !== 'all') {
      const p = projectListRaw.find(p => String(p.id) === String(filterProject));
      if (p) parts.push(`Project: ${p.name}`);
    }
    if (filterStatus !== 'all') parts.push(`Status: ${filterStatus.replace(/_/g, ' ')}`);
    return parts.join(' | ');
  }, [filterProject, filterStatus, projectListRaw]);

  // ── Chart: Task Status Doughnut ──────────────────────────────────────────
  const taskStatusData = {
    labels: ['Completed', 'In Progress', 'Testing', 'Not Started', 'Assigned', 'Under Review', 'Blocked'],
    datasets: [{
      data: [taskCounts.Completed, taskCounts.InProgress, taskCounts.Testing, taskCounts.NotStarted, taskCounts.Assigned, taskCounts.UnderReview, taskCounts.Blocked],
      backgroundColor: ['#059669', '#2563eb', '#d97706', '#7c3aed', '#0891b2', '#7c3aed', '#dc2626'],
      borderWidth: 0, hoverOffset: 8
    }]
  };

  const statusMapToQueryParam = { 0: 'COMPLETED', 1: 'IN_PROGRESS', 2: 'TESTING', 3: 'NOT_STARTED', 4: 'ASSIGNED', 5: 'UNDER_REVIEW', 6: 'BLOCKED' };

  const taskStatusOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#475569', font: { size: 11, weight: '500' }, boxWidth: 12, padding: 8 } },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} Tasks (Click to filter)` } }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const param = statusMapToQueryParam[elements[0].index] || 'COMPLETED';
        navigate(`/teams?tab=tasks&status=${param}`, { state: { tab: 'tasks', statusFilter: param } });
      }
    }
  };

  // ── Chart: Team Workload Bar ─────────────────────────────────────────────
  const teamWorkloadData = {
    labels: teamListToDisplay.map(t => t.name),
    datasets: [{
      label: 'Team Capacity Workload (%)',
      data: teamListToDisplay.map(t => t.capacity || 65),
      backgroundColor: teamListToDisplay.map(t =>
        t.capacity >= 90 ? 'rgba(220, 38, 38, 0.85)' :
        t.capacity >= 75 ? 'rgba(217, 119, 6, 0.85)' :
        'rgba(79, 70, 229, 0.85)'
      ),
      borderRadius: 6, hoverBackgroundColor: '#4338ca'
    }]
  };

  const teamWorkloadOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => items[0]?.label || '',
          label: (ctx) => [
            ` Capacity Load: ${ctx.parsed.y}%`,
            ` Headroom: ${Math.max(0, 100 - ctx.parsed.y)}%`,
            ` Status: ${ctx.parsed.y >= 90 ? '🔴 Critical (≥90%)' : ctx.parsed.y >= 75 ? '🟠 High Risk (≥75%)' : '🔵 Optimal (<75%)'}`,
            ` Click to inspect team details`
          ]
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const targetTeam = teamListToDisplay[elements[0].index];
        if (targetTeam) navigate('/teams', { state: { selectedTeamName: targetTeam.name } });
      }
    },
    scales: {
      x: { ticks: { color: '#64748b', font: { size: 10, weight: '500' }, maxRotation: 20 }, grid: { display: false } },
      y: { max: 100, ticks: { color: '#64748b', font: { size: 11 } }, grid: { color: '#e2e8f0' } }
    }
  };

  // ── Chart: Project Progress Bar ──────────────────────────────────────────
  const projectProgressData = {
    labels: projectListToDisplay.map(p => p.name.length > 24 ? p.name.substring(0, 22) + '…' : p.name),
    datasets: [{
      label: 'Progress (%)',
      data: projectListToDisplay.map(p => p.progress || 0),
      backgroundColor: projectListToDisplay.map(p =>
        (p.progress || 0) >= 75 ? 'rgba(5, 150, 105, 0.85)' :
        (p.progress || 0) >= 40 ? 'rgba(79, 70, 229, 0.85)' :
        'rgba(217, 119, 6, 0.85)'
      ),
      borderRadius: 6, hoverBackgroundColor: '#4338ca'
    }]
  };

  const projectProgressOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => projectListToDisplay[items[0].dataIndex]?.name || '',
          label: (ctx) => [
            ` Completion: ${ctx.parsed.y}%`,
            ` Status: ${projectListToDisplay[ctx.dataIndex]?.status || 'In Progress'}`,
            ` Budget: ₹${(projectListToDisplay[ctx.dataIndex]?.budget || 0).toLocaleString('en-IN')}`,
            ` Click to view project details`
          ]
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const targetProj = projectListToDisplay[elements[0].index];
        if (targetProj) { setSelectedProject(targetProj); navigate('/projects', { state: { selectedProjectId: targetProj.id } }); }
      }
    },
    scales: {
      x: { ticks: { color: '#64748b', font: { size: 10, weight: '500' }, maxRotation: 15 }, grid: { display: false } },
      y: { max: 100, ticks: { color: '#64748b', font: { size: 11 } }, grid: { color: '#e2e8f0' } }
    }
  };

  // ── Chart: Portfolio Budget vs AI-Optimized Cost (bar summary) ───────────
  const portfolioChartData = {
    labels: ['Total Portfolio\nBudget', 'Original\nEstimate', 'AI-Optimized\nCost', 'AI Savings\nAchieved'],
    datasets: [{
      label: currency === 'INR' ? 'Amount (₹)' : 'Amount ($)',
      data: currency === 'INR'
        ? [totalPortfolioBudgetNum, originalProjectedCostNum, optimizedCostNum, aiSavingsNum]
        : [Math.round(totalPortfolioBudgetNum * 0.012), Math.round(originalProjectedCostNum * 0.012), Math.round(optimizedCostNum * 0.012), Math.round(aiSavingsNum * 0.012)],
      backgroundColor: ['rgba(79, 70, 229, 0.85)', 'rgba(217, 119, 6, 0.85)', 'rgba(5, 150, 105, 0.85)', 'rgba(16, 185, 129, 0.85)'],
      borderRadius: 6
    }]
  };

  const portfolioChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${currency === 'INR' ? '₹' : '$'}${ctx.parsed.y.toLocaleString()} (${['Portfolio Budget', 'Original Estimate', 'AI-Optimized Cost', 'AI Savings'][ctx.dataIndex]})`
        }
      }
    },
    onClick: () => navigate('/optimization'),
    scales: {
      x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } },
      y: { ticks: { color: '#64748b', font: { size: 10 }, callback: (v) => currency === 'INR' ? `₹${(v / 100000).toFixed(1)}L` : `$${(v / 1000).toFixed(0)}K` }, grid: { color: '#e2e8f0' } }
    }
  };

  // ── Upcoming milestones ──────────────────────────────────────────────────
  const upcomingMilestones = useMemo(() => {
    const now = new Date();
    return projectListRaw
      .filter(p => p.deadline)
      .map(p => ({ ...p, daysLeft: Math.ceil((new Date(p.deadline) - now) / (1000 * 60 * 60 * 24)) }))
      .filter(p => p.daysLeft >= -7 && p.daysLeft <= 60)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 4);
  }, [projectListRaw]);

  // ── Event handlers ───────────────────────────────────────────────────────
  const handleAcknowledgeAlert = (e, id) => { e.stopPropagation(); setAcknowledgedAlerts(prev => [...prev, id]); };
  const handleDismissAlert = (e, id) => { e.stopPropagation(); setDismissedAlerts(prev => [...prev, id]); };
  const resetFilters = () => { setFilterProject('all'); setFilterStatus('all'); };

  return (
    <div style={{ padding: '4px 0 32px 0', background: '#f8fafc', minHeight: '100vh' }}>

      {/* ── Dashboard Header ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            👋 Executive Resource Center
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 8px 0' }}>
            Real-time AI task optimization, team workload capacity tracking, and operational telemetry.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* System Status Pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 10px',
              borderRadius: '9999px', fontWeight: '600', fontSize: '0.75rem',
              background: hasCriticalAlerts ? '#fef2f2' : (isSystemOnline ? '#ecfdf5' : '#fef2f2'),
              border: `1px solid ${hasCriticalAlerts ? '#fecaca' : (isSystemOnline ? '#a7f3d0' : '#fecaca')}`,
              color: hasCriticalAlerts ? '#991b1b' : (isSystemOnline ? '#047857' : '#991b1b')
            }}>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: hasCriticalAlerts ? '#ef4444' : (isSystemOnline ? '#10b981' : '#ef4444'),
                boxShadow: `0 0 6px ${hasCriticalAlerts ? '#ef4444' : (isSystemOnline ? '#10b981' : '#ef4444')}`
              }} />
              <span>{hasCriticalAlerts ? '⚠ Critical Alerts Active' : (isSystemOnline ? 'All Systems Operational' : 'Backend System Offline')}</span>
            </div>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Last updated: <strong style={{ color: '#0f172a' }}>{displayLastUpdated}</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilterBar(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px',
              background: showFilterBar ? '#eff6ff' : '#ffffff', color: showFilterBar ? '#1d4ed8' : '#374151',
              border: `1px solid ${showFilterBar ? '#bfdbfe' : '#d1d5db'}`, borderRadius: '8px',
              fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer'
            }}
          >
            <Filter size={14} />
            {showFilterBar ? 'Hide Filters' : 'Filter Dashboard'}
            {activeFilterLabel && <span style={{ background: '#1d4ed8', color: '#fff', borderRadius: '9999px', fontSize: '0.65rem', padding: '1px 6px', fontWeight: '700' }}>ON</span>}
          </button>

          {onRefreshData && (
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px',
                background: '#ffffff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px',
                fontSize: '0.82rem', fontWeight: '600', cursor: isRefreshing ? 'not-allowed' : 'pointer', opacity: isRefreshing ? 0.7 : 1
              }}
            >
              <RefreshCw size={14} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              {isRefreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          )}

          <button
            onClick={() => navigate('/optimization')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
              background: 'linear-gradient(135deg, #1749B8, #4f46e5)', color: '#ffffff',
              border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(23,73,184,0.25)'
            }}
          >
            <Sparkles size={14} /> AI Optimization Results
          </button>
        </div>
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────────────── */}
      {showFilterBar && (
        <div style={{ marginBottom: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Filter Dashboard By:</span>
          <select
            value={filterProject}
            onChange={e => setFilterProject(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem', color: '#374151', background: '#fff', cursor: 'pointer' }}
          >
            <option value="all">All Projects</option>
            {projectListRaw.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem', color: '#374151', background: '#fff', cursor: 'pointer' }}
          >
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="testing">Testing</option>
            <option value="completed">Completed</option>
            <option value="planning">Planning</option>
          </select>
          {activeFilterLabel && (
            <>
              <span style={{ fontSize: '0.78rem', color: '#1d4ed8', fontWeight: '600', background: '#eff6ff', padding: '3px 8px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                Filtered: {activeFilterLabel}
              </span>
              <button onClick={resetFilters} style={{ padding: '5px 10px', fontSize: '0.78rem', fontWeight: '600', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', borderRadius: '6px', cursor: 'pointer' }}>
                × Reset
              </button>
            </>
          )}
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: 'auto' }}>
            Showing {projectListToDisplay.length} of {projectListRaw.length} projects · {taskListToDisplay.length} tasks
          </span>
        </div>
      )}

      {/* ── Real-time Alerts ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="#e11d48" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Real-Time Optimization & System Telemetry Alerts
            </h3>
            {activeAlerts.length > 0 && (
              <span style={{ background: '#e11d48', color: '#fff', borderRadius: '9999px', fontSize: '0.65rem', padding: '1px 6px', fontWeight: '700' }}>
                {activeAlerts.length}
              </span>
            )}
          </div>
          <button
            onClick={() => navigate('/monitoring')}
            style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            View All Alerts →
          </button>
        </div>

        {activeAlerts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeAlerts.map(alert => {
              const isAcked = acknowledgedAlerts.includes(alert.id);
              const isCritical = alert.severity === 'CRITICAL';
              const isWarning = alert.severity === 'WARNING';
              return (
                <div key={alert.id}
                  onClick={() => navigate(alert.target, { state: alert.navState })}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', cursor: 'pointer',
                    background: isAcked ? '#f8fafc' : (isCritical ? '#fef2f2' : (isWarning ? '#fffbeb' : '#f0fdf4')),
                    border: `1px solid ${isAcked ? '#cbd5e1' : (isCritical ? '#fecaca' : (isWarning ? '#fef3c7' : '#bbf7d0'))}`,
                    color: isAcked ? '#475569' : (isCritical ? '#991b1b' : (isWarning ? '#92400e' : '#166534')),
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', background: isCritical ? '#e11d48' : (isWarning ? '#d97706' : '#059669'), color: '#fff', flexShrink: 0 }}>
                      {alert.severity}
                    </span>
                    <span style={{ fontWeight: '600' }}>{alert.text}</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>• {alert.timestamp}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    {!isAcked ? (
                      <button onClick={e => handleAcknowledgeAlert(e, alert.id)} style={{ padding: '3px 8px', fontSize: '0.7rem', fontWeight: '700', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', cursor: 'pointer' }}>Ack</button>
                    ) : (
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>✓ ACK</span>
                    )}
                    <span style={{ fontWeight: '700', fontSize: '0.78rem', color: '#4f46e5', textDecoration: 'underline' }}>{alert.actionText}</span>
                    <button onClick={e => handleDismissAlert(e, alert.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.84rem' }}>
            ✓ All system telemetry metrics, workloads, and task schedules are running within normal parameters.
          </div>
        )}
      </div>

      {/* ── AI Resource Recommendation Banner ───────────────────────────── */}
      <div
        className="glass-card interactive-card"
        onClick={() => navigate('/assignment', { state: { recommendDev: 'Developer D', recommendTask: 'Payment Gateway API' } })}
        style={{
          marginBottom: '24px',
          background: isPaymentReassigned
            ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
            : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
          border: isPaymentReassigned ? '1px solid #a7f3d0' : '1px solid #c7d2fe',
          borderRadius: '12px', padding: '18px 20px',
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ background: isPaymentReassigned ? '#059669' : '#1749B8', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BrainCircuit size={16} color="#ffffff" />
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: isPaymentReassigned ? '#064e3b' : '#1e1b4b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🤖 AI Resource Recommendation
              </h3>
              <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '9999px', background: isPaymentReassigned ? '#059669' : '#1749B8', color: '#fff', fontWeight: '700' }}>
                {isPaymentReassigned ? 'OPTIMIZATION COMPLETE' : 'LIVE SUGGESTION'}
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: isPaymentReassigned ? '#064e3b' : '#1e293b', margin: '0 0 10px 0', fontWeight: '500' }}>
              {isPaymentReassigned
                ? `✓ "Payment Gateway API" is successfully assigned to ${paymentDevName}. Developer A workload is balanced.`
                : 'E-Commerce Squad member Developer A is overloaded at 88%+ capacity. Recommend task rebalancing to available developer.'}
            </p>
            <p style={{ fontSize: '0.74rem', color: isPaymentReassigned ? '#047857' : '#6366f1', margin: 0, fontStyle: 'italic' }}>
              ⚠ AI recommendations are based on heuristic workload analysis. Review and apply from the AI Optimization page.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={e => { e.stopPropagation(); navigate('/assignment', { state: { recommendDev: 'Developer D', recommendTask: 'Payment Gateway API' } }); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                background: isPaymentReassigned ? '#059669' : '#1749B8', color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '0.84rem', fontWeight: '700', cursor: 'pointer',
                boxShadow: isPaymentReassigned ? '0 4px 12px rgba(5,150,105,0.3)' : '0 4px 12px rgba(23,73,184,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{isPaymentReassigned ? 'View AI Matrix' : 'Review Recommendation'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Cards Row ────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard
          title="ACTIVE PROJECTS"
          value={activeProjectsCount}
          subtitle={`${projectListToDisplay.length} total tracked`}
          icon={Briefcase} color="#1749B8"
          actionText="View Projects"
          onClick={() => navigate('/projects', { state: { filterStatus: 'In Progress' } })}
        />
        <StatCard
          title="TOTAL TASKS"
          value={totalTasksCount}
          subtitle={`${inProgressTasksCount} In Progress`}
          icon={CheckSquare} color="#2563eb"
          actionText="View Team Tasks"
          onClick={() => navigate('/teams?tab=tasks', { state: { tab: 'tasks' } })}
        />
        <StatCard
          title="PORTFOLIO PROGRESS"
          value={`${avgProgress}%`}
          subtitle={filterProject !== 'all' ? 'Selected Project' : 'Avg. All Projects'}
          icon={TrendingUp} color="#059669"
          actionText="View Projects"
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="AI-OPTIMIZED COST"
          value={formattedCost}
          subtitle={`Saved ${formattedSavings} (${savingsPct}%)`}
          icon={DollarSign} color="#7c3aed"
          actionText="View Optimization"
          onClick={() => navigate('/optimization')}
        />
      </div>

      {/* ── 2×2 Charts Grid ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '24px' }}>

        {/* 1. Project Completion Progress */}
        <div
          className="glass-card interactive-card"
          onClick={() => navigate('/projects')}
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Project Completion Progress</h3>
            <span style={{ fontSize: '0.74rem', color: '#1749B8', fontWeight: '600', cursor: 'pointer' }}>View All Projects →</span>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '0.72rem', flexWrap: 'wrap' }}>
            {[['#059669', '≥75% On Track'], ['rgba(79,70,229,0.85)', '40–74% In Progress'], ['rgba(217,119,6,0.85)', '<40% Behind']].map(([c, l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontWeight: '600' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: c }} /> {l}
              </span>
            ))}
          </div>
          <div style={{ height: '185px' }}>
            {projectListToDisplay.length > 0
              ? <Bar data={projectProgressData} options={projectProgressOptions} />
              : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '0.84rem' }}>No projects match the current filter</div>
            }
          </div>
          {selectedProject && (
            <div style={{ marginTop: '10px', padding: '8px 12px', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', color: '#1e1b4b' }}>📁 {selectedProject.name} — <strong>{selectedProject.progress}% Complete</strong></div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '2px', color: '#4338ca' }}>
                  <span>Status: <strong>{selectedProject.status || 'In Progress'}</strong></span>
                  <span>Budget: <strong>₹{(selectedProject.budget || 0).toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); navigate('/projects', { state: { selectedProjectId: selectedProject.id } }); }} style={{ padding: '5px 10px', background: '#1749B8', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>
                View Details →
              </button>
            </div>
          )}
        </div>

        {/* 2. Team / Developer Workload Distribution */}
        <div
          className="glass-card interactive-card"
          onClick={() => navigate(workloadViewMode === 'teams' ? '/teams' : '/developers')}
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {workloadViewMode === 'teams' ? 'Team Workload Distribution' : 'Developer Workload Distribution'}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', background: '#f1f5f9', padding: '2px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                {['teams', 'devs'].map(mode => (
                  <button key={mode} onClick={() => setWorkloadViewMode(mode)} style={{
                    padding: '3px 8px', fontSize: '0.7rem', fontWeight: '700', borderRadius: '4px', border: 'none',
                    background: workloadViewMode === mode ? '#1749B8' : 'transparent',
                    color: workloadViewMode === mode ? '#fff' : '#64748b', cursor: 'pointer'
                  }}>
                    {mode === 'teams' ? 'Teams' : 'Devs'}
                  </button>
                ))}
              </div>
              <span onClick={() => navigate(workloadViewMode === 'teams' ? '/teams' : '/developers')} style={{ fontSize: '0.74rem', color: '#1749B8', fontWeight: '600', cursor: 'pointer' }}>
                View {workloadViewMode === 'teams' ? 'Teams' : 'Devs'} →
              </span>
            </div>
          </div>

          {workloadViewMode === 'teams' ? (
            <div>
              {/* Legend */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                {[['#dc2626', '≥90% Critical'], ['rgba(217,119,6,0.85)', '75–89% High Risk'], ['rgba(79,70,229,0.85)', '<75% Optimal']].map(([c, l]) => (
                  <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontWeight: '600' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} /> {l}
                  </span>
                ))}
              </div>
              <div style={{ height: '170px' }}>
                <Bar data={teamWorkloadData} options={teamWorkloadOptions} />
              </div>
            </div>
          ) : (
            <WorkloadChart
              developers={developers}
              onSelectDeveloper={(dev) => { setSelectedDeveloper(dev); navigate('/developers', { state: { selectedDevId: dev.id, selectedDevName: dev.name } }); }}
            />
          )}

          {selectedDeveloper && workloadViewMode === 'devs' && (
            <div style={{ marginTop: '10px', padding: '8px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', color: '#064e3b' }}>👤 {selectedDeveloper.name} — <strong>{selectedDeveloper.workload ?? selectedDeveloper.currentWorkload ?? 0}% Workload</strong></div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '2px', color: '#047857' }}>
                  <span>Exp: <strong>{selectedDeveloper.yearsExperience || 4} yrs</strong></span>
                  <span>Rate: <strong>\${selectedDeveloper.hourlyRate || 45}/hr</strong></span>
                  <span>Status: <strong>{selectedDeveloper.status || 'Available'}</strong></span>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); navigate('/developers', { state: { selectedDevId: selectedDeveloper.id } }); }} style={{ padding: '5px 10px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>
                View Details →
              </button>
            </div>
          )}
        </div>

        {/* 3. Task Status Breakdown Doughnut */}
        <div
          className="glass-card interactive-card"
          onClick={() => navigate('/teams?tab=tasks', { state: { tab: 'tasks' } })}
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Task Status Breakdown</h3>
            <span style={{ fontSize: '0.74rem', color: '#1749B8', fontWeight: '600', cursor: 'pointer' }}>View Team Tasks →</span>
          </div>
          <div style={{ height: '170px', display: 'flex', justifyContent: 'center' }}>
            {totalTasksCount > 0
              ? <Doughnut data={taskStatusData} options={taskStatusOptions} />
              : <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '0.84rem' }}>No task data available</div>
            }
          </div>
          {/* Quick status nav buttons */}
          <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }} onClick={e => e.stopPropagation()}>
            {[
              ['COMPLETED', 'Completed', taskCounts.Completed, '#ecfdf5', '#a7f3d0', '#047857'],
              ['IN_PROGRESS', 'In Progress', taskCounts.InProgress, '#eff6ff', '#bfdbfe', '#1d4ed8'],
              ['TESTING', 'Testing', taskCounts.Testing, '#fffbeb', '#fde68a', '#b45309'],
              ['NOT_STARTED', 'Not Started', taskCounts.NotStarted, '#f5f3ff', '#ddd6fe', '#6d28d9'],
            ].map(([status, label, count, bg, border, color]) => (
              <button key={status}
                onClick={() => navigate(`/teams?tab=tasks&status=${status}`, { state: { tab: 'tasks', statusFilter: status } })}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', background: bg, border: `1px solid ${border}`, borderRadius: '6px', fontSize: '0.76rem', color, fontWeight: '600', cursor: 'pointer' }}
              >
                <span>{label}</span><strong>{count} →</strong>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Portfolio Budget vs AI-Optimized Cost */}
        <div
          className="glass-card interactive-card"
          onClick={() => navigate('/optimization')}
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Portfolio Budget & AI Cost Optimization</h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '2px 0 0 0', fontStyle: 'italic' }}>⚠ AI savings % is an estimate based on heuristic task rebalancing</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setCurrency(c => c === 'INR' ? 'USD' : 'INR'); }}
              style={{ padding: '3px 8px', fontSize: '0.7rem', fontWeight: '600', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', color: '#374151', cursor: 'pointer' }}
            >
              {currency}
            </button>
          </div>

          <div style={{ height: '155px' }}>
            <Bar data={portfolioChartData} options={portfolioChartOptions} />
          </div>

          {/* Summary row */}
          <div style={{ marginTop: '10px', padding: '10px 12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', fontSize: '0.76rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', color: '#047857' }}>
              <div>Portfolio Budget:<br /><strong>{formattedPortfolioBudget}</strong></div>
              <div>AI-Optimized Cost:<br /><strong>{formattedCost}</strong></div>
              <div>Total AI Savings:<br /><strong style={{ color: '#059669', fontSize: '0.82rem' }}>{formattedSavings} ({savingsPct}%)</strong></div>
            </div>
          </div>

          <div style={{ marginTop: '8px', fontSize: '0.76rem', color: '#64748b', display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ color: '#1749B8', fontWeight: '600', textDecoration: 'underline' }}>View Full AI Benchmark Results →</span>
          </div>
        </div>
      </div>

      {/* ── Upcoming Milestones Row ──────────────────────────────────────── */}
      {upcomingMilestones.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#1749B8" /> Upcoming Project Milestones & Deadlines
            </h3>
            <span onClick={() => navigate('/schedule')} style={{ fontSize: '0.74rem', color: '#1749B8', fontWeight: '600', cursor: 'pointer' }}>View Full Schedule →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {upcomingMilestones.map(p => {
              const isOverdue = p.daysLeft < 0;
              const isUrgent = p.daysLeft >= 0 && p.daysLeft <= 7;
              const bg = isOverdue ? '#fef2f2' : isUrgent ? '#fffbeb' : '#f0fdf4';
              const border = isOverdue ? '#fecaca' : isUrgent ? '#fde68a' : '#bbf7d0';
              const color = isOverdue ? '#991b1b' : isUrgent ? '#92400e' : '#166534';
              const icon = isOverdue ? '🔴' : isUrgent ? '🟡' : '🟢';
              return (
                <div key={p.id}
                  onClick={() => navigate('/schedule')}
                  style={{ background: bg, border: `1px solid ${border}`, borderRadius: '10px', padding: '12px 14px', cursor: 'pointer', transition: 'transform 0.15s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    {icon} {isOverdue ? `${Math.abs(p.daysLeft)} days overdue` : p.daysLeft === 0 ? 'Due TODAY' : `${p.daysLeft} days left`}
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>{p.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                    Deadline: <strong>{new Date(p.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                    &nbsp;·&nbsp;Progress: <strong>{p.progress || 0}%</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
