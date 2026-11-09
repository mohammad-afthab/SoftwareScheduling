import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WorkloadChart({ developers = [], onSelectDeveloper }) {
  const [filter, setFilter] = useState('ALL');

  const filteredDevs = developers.filter(d => {
    const load = d.workload ?? d.currentWorkload ?? 0;
    if (filter === 'OVERLOADED') return load >= 75;
    if (filter === 'BUSY') return load >= 50 && load < 75;
    if (filter === 'AVAILABLE') return load < 50;
    return true;
  });

  const chartData = {
    labels: (filteredDevs.length ? filteredDevs : developers).map(d => d.name),
    datasets: [
      {
        label: 'Workload Capacity (%)',
        data: (filteredDevs.length ? filteredDevs : developers).map(d => d.workload ?? d.currentWorkload ?? 0),
        backgroundColor: (filteredDevs.length ? filteredDevs : developers).map(d => {
          const load = d.workload ?? d.currentWorkload ?? 0;
          if (load >= 75) return 'rgba(225, 29, 72, 0.85)';
          if (load >= 50) return 'rgba(217, 119, 6, 0.85)';
          return 'rgba(79, 70, 229, 0.85)';
        }),
        borderColor: (filteredDevs.length ? filteredDevs : developers).map(d => {
          const load = d.workload ?? d.currentWorkload ?? 0;
          if (load >= 75) return '#e11d48';
          if (load >= 50) return '#d97706';
          return '#4f46e5';
        }),
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => ` Workload: ${context.parsed.y}%`
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && onSelectDeveloper) {
        const index = elements[0].index;
        const targetDev = (filteredDevs.length ? filteredDevs : developers)[index];
        if (targetDev) onSelectDeveloper(targetDev);
      }
    },
    scales: {
      x: { ticks: { color: '#64748b', font: { size: 11, weight: '500' } }, grid: { display: false } },
      y: { max: 100, ticks: { color: '#64748b', font: { size: 11 } }, grid: { color: '#e2e8f0' } }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        {['ALL', 'OVERLOADED', 'BUSY', 'AVAILABLE'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '3px 8px',
              fontSize: '0.7rem',
              borderRadius: '4px',
              fontWeight: '600',
              border: filter === f ? '1px solid #4f46e5' : '1px solid #e2e8f0',
              background: filter === f ? '#eff6ff' : '#ffffff',
              color: filter === f ? '#4f46e5' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {f === 'ALL' ? 'All Devs' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
      <div style={{ height: '200px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
