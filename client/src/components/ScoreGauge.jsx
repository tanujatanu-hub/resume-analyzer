import React from 'react';

const ScoreGauge = ({ score, size = 'large' }) => {
  const getColor = (s) => {
    if (s >= 80) return '#00e5a0';
    if (s >= 60) return '#f5c842';
    if (s >= 40) return '#ff9d42';
    return '#ff4f6b';
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Needs Work';
  };

  const color = getColor(score);
  const radius = size === 'large' ? 70 : 45;
  const strokeWidth = size === 'large' ? 10 : 7;
  const svgSize = (radius + strokeWidth) * 2 + 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`score-gauge score-gauge--${size}`}>
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}66)` }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="-0.1em"
          style={{ fill: color, fontSize: size === 'large' ? '2rem' : '1.3rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
        >
          {score}
        </text>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="1.4em"
          style={{ fill: 'rgba(255,255,255,0.4)', fontSize: size === 'large' ? '0.7rem' : '0.55rem', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}
        >
          {getLabel(score)}
        </text>
      </svg>
    </div>
  );
};

export default ScoreGauge;
