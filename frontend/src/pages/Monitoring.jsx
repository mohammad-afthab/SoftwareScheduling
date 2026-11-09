import React, { useState, useEffect } from 'react';
import ServerCard from '../components/ServerCard';
import { Server, Activity, Cpu, HardDrive, Zap, ShieldAlert, AlertTriangle, Users, Clock, ArrowRight } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Monitoring({ initialServerList, teams = [], developers = [] }) {
  const navigate = useNavigate();

  const [servers, setServers] = useState(initialServerList || [
    { id: 1, name: 'Server 1 (Primary Web API)', ip: '192.168.1.10', status: 'Healthy', cpu: 62, memory: 70, latency: 180 },
    { id: 2, name: 'Server 2 (Database Cluster)', ip: '192.168.1.11', status: 'High Load', cpu: 91, memory: 88, latency: 420 },
    { id: 3, name: 'Server 3 (AI Scheduler Node)', ip: '192.168.1.12', status: 'Healthy', cpu: 45, memory: 52, latency: 140 },
    { id: 4, name: 'Server 4 (Redis Cache)', ip: '192.168.1.13', status: 'Healthy', cpu: 28, memory: 40, latency: 95 }
  ]);

  const [timeLabels, setTimeLabels] = useState(['19:00', '19:01', '19:02', '19:03', '19:04']);
  const [cpuHistory, setCpuHistory] = useState([55, 60, 68, 75, 91]);
  const [latencyHistory, setLatencyHistory] = useState([180, 210, 290, 410, 420]);

  useEffect(() => {
    const timer = setInterval(() => {
      setServers(prevServers =>
        prevServers.map(s => {
          const deltaCpu = Math.floor(Math.random() * 9) - 4;
          const newCpu = Math.max(20, Math.min(98, s.cpu + deltaCpu));
          const deltaMem = Math.floor(Math.random() * 7) - 3;
          const newMem = Math.max(30, Math.min(95, s.memory + deltaMem));
          const newLat = Math.max(90, Math.floor(120 + newCpu * 3.5));

          return {
            ...s,
            cpu: newCpu,
            memory: newMem,
            latency: newLat,
            status: newCpu > 85 ? 'High Load' : 'Healthy'
          };
        })
      );

      // Update telemetry history charts
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      setTimeLabels(prev => [...prev.slice(1), timeStr]);
      setCpuHistory(prev => [...prev.slice(1), Math.floor(Math.random() * 25) + 70]);
      setLatencyHistory(prev => [...prev.slice(1), Math.floor(Math.random() * 150) + 250]);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { color: '#64748b', font: { size: 12, weight: '500' } } } },
    scales: { x: { ticks: { color: '#64748b' } }, y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } } }
  };

  const telemetryData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Server 2 CPU Usage (%)',
        data: cpuHistory,
        borderColor: '#e11d48',
        backgroundColor: 'rgba(225, 29, 72, 0.08)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Server 1 CPU Usage (%)',
        data: [42, 45, 50, 55, 62],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.08)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  const latencyData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Application Latency (ms)',
        data: latencyHistory,
        borderColor: '#d97706',
        backgroundColor: 'rgba(217, 119, 6, 0.08)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  const activeAlertsList = [
    { id: 'alt-0', type: 'critical', text: 'E-Commerce Squad capacity load is 82% (High Capacity Risk)', category: 'Team Capacity', metric: 'Capacity 82%', target: '/teams', state: { selectedTeamName: 'E-Commerce Squad' } },
    { id: 'alt-1', type: 'critical', text: 'Server 2 CPU usage is 91% (High Infrastructure Load)', category: 'Servers', metric: 'CPU 91%', target: '/monitoring' },
    { id: 'alt-2', type: 'warning', text: 'Developer A workload is 88% (High Overload Risk)', category: 'Developer Workload', metric: 'Workload 88%', target: '/developers', state: { selectedDevName: 'Developer A' } },
    { id: 'alt-3', type: 'warning', text: 'Payment API task may be delayed due to security dependency', category: 'Task Delays', metric: 'Delay Risk', target: '/tasks', state: { searchTask: 'Payment API' } }
  ];

  const teamListToDisplay = (teams && teams.length > 0) ? teams : [
    { id: 1, name: 'E-Commerce Squad', capacity: 82, status: 'High Risk' },
    { id: 2, name: 'Cloud Migration Squad', capacity: 67, status: 'Optimal' },
    { id: 3, name: 'Mobile Platform Team', capacity: 74, status: 'Optimal' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>System Resource Monitoring & Health</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Infrastructure servers, CPU/Memory telemetry, organization team workload breakdown & active system telemetry alerts.
          </p>
        </div>
        <div className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} /> Telemetry Live Sync (3s)
        </div>
      </div>

      {/* Active System Alerts Center */}
      <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert color="#e11d48" size={18} /> Active System Telemetry Alerts ({activeAlertsList.length})
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activeAlertsList.map(alert => (
            <div
              key={alert.id}
              onClick={() => alert.target !== '/monitoring' && navigate(alert.target, { state: alert.state })}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem',
                background: alert.type === 'critical' ? '#fef2f2' : '#fffbeb',
                border: `1px solid ${alert.type === 'critical' ? '#fecaca' : '#fef3c7'}`,
                color: alert.type === 'critical' ? '#991b1b' : '#92400e',
                cursor: alert.target !== '/monitoring' ? 'pointer' : 'default'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {alert.type === 'critical' ? <ShieldAlert size={18} /> : <AlertTriangle size={18} />}
                <div>
                  <div style={{ fontWeight: '600' }}>{alert.text}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.85, marginTop: '2px' }}>
                    Category: <strong>{alert.category}</strong> • Metric: <strong>{alert.metric}</strong>
                  </div>
                </div>
              </div>
              {alert.target !== '/monitoring' && (
                <span style={{ fontSize: '0.78rem', fontWeight: '700', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Resolve →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure Server Nodes */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
          Server Infrastructure Clusters
        </h3>
        <div className="grid-4">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      </div>

      {/* Developer Workload & Task Delay Monitor Summary */}
      <div className="grid-2">
        <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users color="#4f46e5" size={18} /> Team & Dev Workload Hotspots
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/teams')}>
              Manage Teams →
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {teamListToDisplay.map(t => (
              <div
                key={t.id}
                onClick={() => navigate('/teams', { state: { selectedTeamName: t.name } })}
                style={{
                  padding: '10px 12px',
                  background: (t.capacity || 0) >= 80 ? '#fef2f2' : '#f0f9ff',
                  border: `1px solid ${(t.capacity || 0) >= 80 ? '#fecaca' : '#bae6fd'}`,
                  borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                }}
              >
                <div>
                  <strong style={{ color: (t.capacity || 0) >= 80 ? '#991b1b' : '#0369a1', fontSize: '0.85rem' }}>{t.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned Squad Workload Capacity</div>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: (t.capacity || 0) >= 80 ? '#e11d48' : '#0284c7' }}>
                  {t.capacity || 65}% { (t.capacity || 0) >= 80 ? 'High Risk' : 'Optimal' }
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock color="#d97706" size={18} /> Task Dependency Delay Risks
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/tasks')}>
              View Tasks →
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px 12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#92400e', fontSize: '0.85rem' }}>Payment API</strong>
                <div style={{ fontSize: '0.75rem', color: '#78350f' }}>Blocked by Security Subsystem</div>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#b45309' }}>High Delay Risk</span>
            </div>

            <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#334155', fontSize: '0.85rem' }}>Cloud Migration Pipeline</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Awaiting Infrastructure Provisioning</div>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#059669' }}>On Schedule</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Charts */}
      <div className="grid-2">
        <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu color="#e11d48" size={18} /> Server CPU Usage Stream (%)
          </h3>
          <div style={{ height: '220px' }}>
            <Line data={telemetryData} options={lineChartOptions} />
          </div>
        </div>

        <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity color="#d97706" size={18} /> Application Latency Stream (ms)
          </h3>
          <div style={{ height: '220px' }}>
            <Line data={latencyData} options={lineChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
