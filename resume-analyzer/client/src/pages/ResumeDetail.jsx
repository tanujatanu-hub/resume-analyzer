import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../api/axios';
import ScoreGauge from '../components/ScoreGauge';

const ResumeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reAnalyzeJD, setReAnalyzeJD] = useState('');
  const [reAnalyzing, setReAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const { data } = await api.get(`/resume/${id}`);
      setResume(data.data);
      setReAnalyzeJD(data.data.jobDescription || '');
    } catch (err) {
      toast.error('Resume not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleReAnalyze = async () => {
    setReAnalyzing(true);
    try {
      const { data } = await api.put(`/resume/${id}/analyze`, { jobDescription: reAnalyzeJD });
      setResume(data.data);
      toast.success('Re-analyzed successfully!');
    } catch {
      toast.error('Re-analysis failed');
    } finally {
      setReAnalyzing(false);
    }
  };

  const getScoreColor = s => {
    if (s >= 80) return '#00e5a0';
    if (s >= 60) return '#f5c842';
    if (s >= 40) return '#ff9d42';
    return '#ff4f6b';
  };

  if (loading) return (
    <div className="page loading-page"><div className="spinner" /></div>
  );
  if (!resume) return null;

  const { analysis } = resume;
  const sections = analysis.sections || {};
  const contactInfo = analysis.contactInfo || {};

  const radarData = [
    { subject: 'Contact', value: Object.values(contactInfo).filter(Boolean).length * 25 },
    { subject: 'Sections', value: Object.values(sections).filter(Boolean).length * 17 },
    { subject: 'Skills', value: Math.min(100, (analysis.skillsFound?.length || 0) * 10) },
    { subject: 'Keywords', value: resume.jobDescription ? Math.round(((analysis.keywordsFound?.length || 0) / Math.max(1, (analysis.keywordsFound?.length || 0) + (analysis.keywordsMissing?.length || 0))) * 100) : 50 },
    { subject: 'Readability', value: analysis.readabilityScore || 50 },
  ];

  return (
    <div className="page detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>← Back</button>
        <div className="detail-title">
          <h1>{resume.fileName}</h1>
          <span className="upload-date">
            {new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Score Hero */}
      <div className="score-hero">
        <div className="score-hero-left">
          <ScoreGauge score={resume.atsScore} size="large" />
          <div className="score-meta">
            <h2>ATS Score</h2>
            <p style={{ color: getScoreColor(resume.atsScore) }}>
              {resume.atsScore >= 80 ? '🟢 Excellent — highly ATS-friendly' :
               resume.atsScore >= 60 ? '🟡 Good — minor improvements needed' :
               resume.atsScore >= 40 ? '🟠 Fair — significant improvements needed' :
               '🔴 Needs Work — major revision recommended'}
            </p>
            <div className="word-count">📖 {analysis.wordCount} words</div>
          </div>
        </div>

        <div className="score-hero-right">
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <Radar dataKey="value" stroke="#00e5a0" fill="#00e5a0" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['overview', 'keywords', 'suggestions', 'reanalyze'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'keywords' && '🔑 Keywords'}
            {tab === 'suggestions' && '💡 Suggestions'}
            {tab === 'reanalyze' && '🔄 Re-Analyze'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="overview-grid">
            {/* Contact Info */}
            <div className="analysis-card">
              <h3>Contact Information</h3>
              <div className="checklist">
                {[
                  { key: 'hasEmail', label: 'Email Address' },
                  { key: 'hasPhone', label: 'Phone Number' },
                  { key: 'hasLinkedIn', label: 'LinkedIn Profile' },
                  { key: 'hasGitHub', label: 'GitHub Profile' },
                ].map(item => (
                  <div key={item.key} className={`check-item ${contactInfo[item.key] ? 'found' : 'missing'}`}>
                    <span className="check-icon">{contactInfo[item.key] ? '✓' : '✗'}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="analysis-card">
              <h3>Resume Sections</h3>
              <div className="checklist">
                {[
                  { key: 'hasSummary', label: 'Professional Summary' },
                  { key: 'hasExperience', label: 'Work Experience' },
                  { key: 'hasEducation', label: 'Education' },
                  { key: 'hasSkills', label: 'Skills' },
                  { key: 'hasProjects', label: 'Projects' },
                  { key: 'hasCertifications', label: 'Certifications' },
                ].map(item => (
                  <div key={item.key} className={`check-item ${sections[item.key] ? 'found' : 'missing'}`}>
                    <span className="check-icon">{sections[item.key] ? '✓' : '✗'}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Found */}
            <div className="analysis-card full-width">
              <h3>Technical Skills Detected ({analysis.skillsFound?.length || 0})</h3>
              {analysis.skillsFound?.length > 0 ? (
                <div className="tags-container">
                  {analysis.skillsFound.map((skill, i) => (
                    <span key={i} className="tag tag-green">{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="no-data">No recognizable technical skills detected. Add a dedicated Skills section.</p>
              )}
            </div>

            {/* Strengths */}
            {analysis.strengths?.length > 0 && (
              <div className="analysis-card full-width">
                <h3>✨ Strengths</h3>
                <ul className="strength-list">
                  {analysis.strengths.map((s, i) => (
                    <li key={i}><span className="bullet-green">▸</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* KEYWORDS TAB */}
        {activeTab === 'keywords' && (
          <div className="keywords-section">
            {resume.jobDescription ? (
              <>
                <div className="keyword-stats">
                  <div className="kw-stat found">
                    <div className="kw-num">{analysis.keywordsFound?.length || 0}</div>
                    <div>Keywords Found</div>
                  </div>
                  <div className="kw-stat missing">
                    <div className="kw-num">{analysis.keywordsMissing?.length || 0}</div>
                    <div>Keywords Missing</div>
                  </div>
                  <div className="kw-stat">
                    <div className="kw-num">
                      {analysis.keywordsFound?.length + analysis.keywordsMissing?.length > 0
                        ? Math.round((analysis.keywordsFound?.length / (analysis.keywordsFound?.length + analysis.keywordsMissing?.length)) * 100)
                        : 0}%
                    </div>
                    <div>Match Rate</div>
                  </div>
                </div>

                <div className="two-col">
                  <div className="analysis-card">
                    <h3 style={{ color: '#00e5a0' }}>✓ Found in Resume</h3>
                    {analysis.keywordsFound?.length > 0 ? (
                      <div className="tags-container">
                        {analysis.keywordsFound.map((kw, i) => (
                          <span key={i} className="tag tag-green">{kw}</span>
                        ))}
                      </div>
                    ) : <p className="no-data">None detected</p>}
                  </div>

                  <div className="analysis-card">
                    <h3 style={{ color: '#ff4f6b' }}>✗ Missing Keywords</h3>
                    {analysis.keywordsMissing?.length > 0 ? (
                      <div className="tags-container">
                        {analysis.keywordsMissing.map((kw, i) => (
                          <span key={i} className="tag tag-red">{kw}</span>
                        ))}
                      </div>
                    ) : <p className="no-data">All key keywords found!</p>}
                  </div>
                </div>
              </>
            ) : (
              <div className="no-jd-message">
                <div className="no-jd-icon">🔑</div>
                <h3>No Job Description Provided</h3>
                <p>Add a job description in the Re-Analyze tab to see keyword match analysis</p>
                <button className="btn-analyze" onClick={() => setActiveTab('reanalyze')}>Add Job Description</button>
              </div>
            )}
          </div>
        )}

        {/* SUGGESTIONS TAB */}
        {activeTab === 'suggestions' && (
          <div className="suggestions-section">
            <div className="suggestions-header">
              <h3>Improvement Suggestions</h3>
              <p>Implement these to increase your ATS score</p>
            </div>
            {analysis.suggestions?.length > 0 ? (
              <div className="suggestion-list">
                {analysis.suggestions.map((sug, i) => (
                  <div key={i} className="suggestion-item">
                    <div className="sug-number">{String(i + 1).padStart(2, '0')}</div>
                    <div className="sug-text">{sug}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No suggestions — your resume looks great!</p>
            )}
          </div>
        )}

        {/* RE-ANALYZE TAB */}
        {activeTab === 'reanalyze' && (
          <div className="reanalyze-section">
            <h3>Re-Analyze with Job Description</h3>
            <p>Paste a new job description to get updated keyword matching and ATS score</p>
            <textarea
              className="jd-textarea"
              value={reAnalyzeJD}
              onChange={e => setReAnalyzeJD(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={10}
            />
            <div className="char-count">{reAnalyzeJD.length} characters</div>
            <button
              className="btn-analyze"
              onClick={handleReAnalyze}
              disabled={reAnalyzing}
            >
              {reAnalyzing ? <><span className="spinner-sm" /> Analyzing...</> : '🔄 Re-Analyze Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDetail;
