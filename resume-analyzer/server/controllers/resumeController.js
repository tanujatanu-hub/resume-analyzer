const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const Resume = require('../models/Resume');
const { calculateATSScore } = require('../utils/atsScorer');

// @desc    Upload and analyze resume
// @route   POST /api/resume/upload
const uploadResume = async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.files.resume;
    const fileName = file.name;
    const ext = fileName.split('.').pop().toLowerCase();

    if (!['pdf', 'docx'].includes(ext)) {
      return res.status(400).json({ success: false, message: 'Only PDF and DOCX files are supported' });
    }

    const jobDescription = req.body.jobDescription || '';

    // Parse file
    let rawText = '';
    try {
      if (ext === 'pdf') {
        const data = await pdf(file.data);
        rawText = data.text;
      } else if (ext === 'docx') {
        const result = await mammoth.extractRawText({ buffer: file.data });
        rawText = result.value;
      }
    } catch (parseErr) {
      return res.status(400).json({ success: false, message: 'Failed to parse file. Ensure it is a valid PDF or DOCX.' });
    }

    if (!rawText || rawText.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'Could not extract text from file. Try a text-based PDF.' });
    }

    // Calculate ATS score
    const { atsScore, analysis } = calculateATSScore(rawText, jobDescription);

    // Save to database
    const resume = await Resume.create({
      user: req.user._id,
      fileName,
      fileType: ext,
      rawText,
      jobDescription,
      atsScore,
      analysis
    });

    res.status(201).json({
      success: true,
      data: resume
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all resumes for user
// @route   GET /api/resume
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select('-rawText')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single resume
// @route   GET /api/resume/:id
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    res.json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Re-analyze resume with new job description
// @route   PUT /api/resume/:id/analyze
const reAnalyze = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const jobDescription = req.body.jobDescription || '';
    const { atsScore, analysis } = calculateATSScore(resume.rawText, jobDescription);

    resume.jobDescription = jobDescription;
    resume.atsScore = atsScore;
    resume.analysis = analysis;
    await resume.save();

    res.json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { uploadResume, getResumes, getResume, reAnalyze, deleteResume };
