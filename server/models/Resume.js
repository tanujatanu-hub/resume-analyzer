const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true
  },
  rawText: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    default: ''
  },
  atsScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  analysis: {
    keywordsFound: [String],
    keywordsMissing: [String],
    skillsFound: [String],
    contactInfo: {
      hasEmail: Boolean,
      hasPhone: Boolean,
      hasLinkedIn: Boolean,
      hasGitHub: Boolean
    },
    sections: {
      hasExperience: Boolean,
      hasEducation: Boolean,
      hasSkills: Boolean,
      hasSummary: Boolean,
      hasProjects: Boolean,
      hasCertifications: Boolean
    },
    suggestions: [String],
    strengths: [String],
    wordCount: Number,
    readabilityScore: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
