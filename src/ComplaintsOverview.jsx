import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js components register karein
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ComplaintsOverview = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          color: '#94a3b8',
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          font: { size: 14 }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      },
      y: {
        min: 0,
        max: 50,
        ticks: { stepSize: 10, color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  const data = {
    labels: ['May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15', 'May 16'],
    datasets: [
      {
        label: 'Total',
        data: [21, 29, 32, 41, 28, 21, 16, 20],
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        pointRadius: 5,
        tension: 0,
        borderWidth: 2
      },
      {
        label: 'Resolved',
        data: [12, 18, 17, 22, 16, 13, 10, 12],
        borderColor: '#22c55e',
        backgroundColor: '#22c55e',
        pointRadius: 5,
        tension: 0,
        borderWidth: 2
      },
      {
        label: 'Pending',
        data: [7, 10, 8.5, 13, 8.5, 8, 5.5, 7.5],
        borderColor: '#f97316',
        backgroundColor: '#f97316',
        pointRadius: 5,
        tension: 0,
        borderWidth: 2
      }
    ]
  };

  const cardStyle = {
    backgroundColor: '#0d1b3e',
    border: '1px solid #1e2d5a',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    color: '#fff'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const btnStyle = {
    background: 'transparent',
    border: '1px solid #2a3d73',
    color: '#e0e0e0',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={{ margin: 0, fontSize: '20px' }}>Complaints Overview</h3>
        <button style={btnStyle}>View All</button>
      </div>
      <div style={{ height: '300px', width: '100%' }}>
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default ComplaintsOverview;