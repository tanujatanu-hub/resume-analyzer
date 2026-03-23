import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-badge">AI-Powered Resume Analysis</div>
        <h1 className="hero-title">
          Beat the ATS.<br />
          <span className="gradient-text">Land the Interview.</span>
        </h1>
        <p className="hero-sub">
          Upload your resume, paste a job description, and get an instant ATS compatibility score with actionable improvements.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/upload" className="btn-hero-primary">Analyze My Resume →</Link>
          ) : (
            <>
              <Link to="/register" className="btn-hero-primary">Get Started Free →</Link>
              <Link to="/login" className="btn-hero-secondary">Sign In</Link>
            </>
          )}
        </div>
      </div>

      <div className="features-grid">
        {[
          { icon: '◈', title: 'ATS Score', desc: 'Instant compatibility score out of 100 based on real ATS criteria.' },
          { icon: '🔑', title: 'Keyword Match', desc: 'Compare your resume against any job description for keyword gaps.' },
          { icon: '💡', title: 'Smart Suggestions', desc: 'Personalized tips to improve structure, content, and formatting.' },
          { icon: '📊', title: 'Score Dashboard', desc: 'Track your improvement across multiple resume versions.' },
        ].map((f, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
