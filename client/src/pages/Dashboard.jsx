import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ScoreGauge from '../components/ScoreGauge';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get('/resume');
      setResumes(data.data);
    } catch (err) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this resume analysis?')) return;
    try {
      await api.delete(`/resume/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
      toast.success('Deleted successfully');
    } catch {
      toast.error('Delete failed');
    }
  };

  const getScoreColor = s => {
    if (s >= 80) return '#00e5a0';
    if (s >= 60) return '#f5c842';
    if (s >= 40) return '#ff9d42';
    return '#ff4f6b';
  };

  const chartData = resumes.slice(0, 8).map(r => ({
    name: r.fileName.replace(/\.(pdf|docx)$/, '').slice(0, 12),
    score: r.atsScore
  })).reverse();

  const avgScore = resumes.length
    ? Math.round(resumes.reduce((sum, r) => sum + r.atsScore, 0) / resumes.length)
    : 0;

  const bestScore = resumes.length ? Math.max(...resumes.map(r => r.atsScore)) : 0;

  if (loading) {
    return (
      <div className="page loading-page">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Your Dashboard</h1>
          <p>Welcome back, <strong>{user?.name}</strong></p>
        </div>
        <Link to="/upload" className="btn-new-analysis">
          + New Analysis
        </Link>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{resumes.length}</div>
          <div className="stat-label">Resumes Analyzed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: getScoreColor(avgScore) }}>{avgScore}</div>
          <div className="stat-label">Average ATS Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: getScoreColor(bestScore) }}>{bestScore}</div>
          <div className="stat-label">Best Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#00e5a0' }}>
            {resumes.filter(r => r.atsScore >= 70).length}
          </div>
          <div className="stat-label">High Scoring (70+)</div>
        </div>
      </div>

      {/* Chart */}
      {resumes.length > 1 && (
        <div className="chart-card">
          <h2>Score History</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Resume List */}
      <div className="resumes-section">
        <h2>Recent Analyses</h2>

        {resumes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No resumes yet</h3>
            <p>Upload your first resume to get an ATS score and improvement tips</p>
            <Link to="/upload" className="btn-analyze">Analyze Your Resume</Link>
          </div>
        ) : (
          <div className="resumes-grid">
            {resumes.map(resume => (
              <div
                key={resume._id}
                className="resume-card"
                onClick={() => navigate(`/resume/${resume._id}`)}
              >
                <div className="resume-card-left">
                  <div className="resume-file-icon">
                    {resume.fileType === 'pdf' ? '📄' : '📝'}
                  </div>
                  <div className="resume-info">
                    <strong>{resume.fileName}</strong>
                    <span className="resume-date">
                      {new Date(resume.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </span>
                    {resume.jobDescription && (
                      <span className="jd-badge">JD matched</span>
                    )}
                  </div>
                </div>

                <div className="resume-card-right">
                  <ScoreGauge score={resume.atsScore} size="small" />
                  <button
                    className="btn-delete"
                    onClick={e => handleDelete(resume._id, e)}
                    title="Delete"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
