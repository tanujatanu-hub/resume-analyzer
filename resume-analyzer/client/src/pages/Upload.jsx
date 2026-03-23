import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleDrop = e => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSet(dropped);
  };

  const validateAndSet = f => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      toast.error('Only PDF and DOCX files are supported');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }
    setFile(f);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return toast.error('Please select a resume file');

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDesc);

    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        }
      });
      toast.success('Resume analyzed successfully!');
      navigate(`/resume/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page upload-page">
      <div className="page-header">
        <h1>Analyze Your Resume</h1>
        <p>Upload your resume and optionally paste a job description for ATS scoring</p>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        {/* Drop Zone */}
        <div
          className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={e => e.target.files[0] && validateAndSet(e.target.files[0])}
            style={{ display: 'none' }}
          />
          {file ? (
            <div className="file-selected">
              <div className="file-icon">{file.name.endsWith('.pdf') ? '📄' : '📝'}</div>
              <div className="file-info">
                <strong>{file.name}</strong>
                <span>{(file.size / 1024).toFixed(1)} KB</span>
              </div>
              <button
                type="button"
                className="file-remove"
                onClick={e => { e.stopPropagation(); setFile(null); }}
              >✕</button>
            </div>
          ) : (
            <div className="drop-prompt">
              <div className="drop-icon">⬆</div>
              <strong>Drop your resume here</strong>
              <span>or click to browse</span>
              <div className="file-types">PDF · DOCX · Max 10MB</div>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="form-section">
          <label className="section-label">
            Job Description <span className="optional">(optional — improves ATS accuracy)</span>
          </label>
          <textarea
            className="jd-textarea"
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here. The more detail you provide, the more accurate your keyword match score will be..."
            rows={8}
          />
          <div className="char-count">{jobDesc.length} characters</div>
        </div>

        {/* Progress */}
        {loading && (
          <div className="progress-bar-wrap">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
            <span>{progress < 100 ? `Uploading... ${progress}%` : 'Analyzing with AI...'}</span>
          </div>
        )}

        <button type="submit" className="btn-analyze" disabled={loading || !file}>
          {loading ? (
            <><span className="spinner-sm" /> Analyzing...</>
          ) : (
            <><span>◈</span> Analyze Resume</>
          )}
        </button>
      </form>
    </div>
  );
};

export default Upload;
