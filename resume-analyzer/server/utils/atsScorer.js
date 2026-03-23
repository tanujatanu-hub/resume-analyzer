const stringSimilarity = require('string-similarity');

// Common tech skills
const TECH_SKILLS = [
  'javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'react', 'angular', 'vue',
  'node.js', 'nodejs', 'express', 'django', 'flask', 'spring', 'mongodb', 'postgresql',
  'mysql', 'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'rest api',
  'graphql', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'webpack', 'sql', 'nosql',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'data science', 'pandas',
  'numpy', 'linux', 'agile', 'scrum', 'jira', 'ci/cd', 'devops', 'microservices',
  'php', 'ruby', 'swift', 'kotlin', 'flutter', 'react native', 'firebase', 'elasticsearch',
  'kafka', 'rabbitmq', 'nginx', 'apache', 'jenkins', 'ansible', 'terraform'
];

// Section keywords
const SECTION_KEYWORDS = {
  experience: ['experience', 'work history', 'employment', 'career', 'professional background', 'work experience'],
  education: ['education', 'academic', 'degree', 'university', 'college', 'school', 'bachelor', 'master', 'phd'],
  skills: ['skills', 'technical skills', 'competencies', 'technologies', 'tools', 'expertise'],
  summary: ['summary', 'objective', 'profile', 'about me', 'professional summary', 'career objective'],
  projects: ['projects', 'portfolio', 'personal projects', 'open source'],
  certifications: ['certification', 'certifications', 'certificate', 'licenses', 'credentials']
};

function extractText(text) {
  return text.toLowerCase().replace(/[^\w\s.@+#]/g, ' ');
}

function detectContactInfo(text) {
  const lower = text.toLowerCase();
  return {
    hasEmail: /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/.test(lower),
    hasPhone: /(\+?\d[\d\s\-().]{7,}\d)/.test(text),
    hasLinkedIn: /linkedin\.com|linkedin/i.test(lower),
    hasGitHub: /github\.com|github/i.test(lower)
  };
}

function detectSections(text) {
  const lower = text.toLowerCase();
  return {
    hasExperience: SECTION_KEYWORDS.experience.some(kw => lower.includes(kw)),
    hasEducation: SECTION_KEYWORDS.education.some(kw => lower.includes(kw)),
    hasSkills: SECTION_KEYWORDS.skills.some(kw => lower.includes(kw)),
    hasSummary: SECTION_KEYWORDS.summary.some(kw => lower.includes(kw)),
    hasProjects: SECTION_KEYWORDS.projects.some(kw => lower.includes(kw)),
    hasCertifications: SECTION_KEYWORDS.certifications.some(kw => lower.includes(kw))
  };
}

function extractKeywordsFromJD(jobDescription) {
  const lower = jobDescription.toLowerCase();
  const words = lower.split(/[\s,.\-\/]+/).filter(w => w.length > 2);
  // Extract meaningful keywords (longer words + known tech terms)
  const keywords = new Set();
  
  // Find tech skills mentioned in JD
  TECH_SKILLS.forEach(skill => {
    if (lower.includes(skill)) keywords.add(skill);
  });

  // Extract capitalized terms (likely technologies/tools)
  const capTerms = jobDescription.match(/\b[A-Z][a-zA-Z0-9.+#]{1,20}\b/g) || [];
  capTerms.forEach(t => {
    if (t.length > 2) keywords.add(t.toLowerCase());
  });

  // Extract multi-word phrases
  const phrases = ['machine learning', 'deep learning', 'data science', 'rest api', 'ci/cd',
    'full stack', 'full-stack', 'front end', 'back end', 'object oriented', 'version control'];
  phrases.forEach(p => {
    if (lower.includes(p)) keywords.add(p);
  });

  return [...keywords];
}

function findSkillsInResume(resumeText) {
  const lower = resumeText.toLowerCase();
  return TECH_SKILLS.filter(skill => lower.includes(skill));
}

function calculateReadability(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  if (sentences.length === 0 || words.length === 0) return 50;
  const avgWordsPerSentence = words.length / sentences.length;
  // Optimal resume sentences: 10-20 words
  const score = Math.max(0, Math.min(100, 100 - Math.abs(avgWordsPerSentence - 15) * 2));
  return Math.round(score);
}

function generateSuggestions(analysis, hasJD, atsScore) {
  const suggestions = [];
  const { sections, contactInfo, keywordsMissing, wordCount } = analysis;

  // Contact info suggestions
  if (!contactInfo.hasEmail) suggestions.push('Add your professional email address');
  if (!contactInfo.hasPhone) suggestions.push('Include your phone number for recruiters to contact you');
  if (!contactInfo.hasLinkedIn) suggestions.push('Add your LinkedIn profile URL to increase credibility');
  if (!contactInfo.hasGitHub) suggestions.push('Include your GitHub profile to showcase your coding projects');

  // Section suggestions
  if (!sections.hasSummary) suggestions.push('Add a professional summary at the top — 3-4 lines about your key strengths');
  if (!sections.hasExperience) suggestions.push('Add a dedicated Work Experience section with job titles and responsibilities');
  if (!sections.hasSkills) suggestions.push('Create a Skills section to pass ATS keyword scanning');
  if (!sections.hasProjects) suggestions.push('Add a Projects section to demonstrate practical skills');
  if (!sections.hasCertifications) suggestions.push('Consider adding relevant certifications to boost your profile');

  // Keyword suggestions
  if (hasJD && keywordsMissing.length > 0) {
    const topMissing = keywordsMissing.slice(0, 5).join(', ');
    suggestions.push(`Add these missing keywords from the job description: ${topMissing}`);
  }

  // Word count suggestions
  if (wordCount < 300) suggestions.push('Your resume seems too short. Aim for at least 400-600 words');
  if (wordCount > 1000) suggestions.push('Consider condensing your resume — aim for 1 page (under 700 words)');

  // Score-based suggestions
  if (atsScore < 50) {
    suggestions.push('Use standard section headings like "Experience", "Education", "Skills" for better ATS parsing');
    suggestions.push('Avoid tables, columns, headers/footers as ATS systems struggle to parse them');
  }

  suggestions.push('Use action verbs like "Developed", "Led", "Implemented", "Optimized" to start bullet points');
  suggestions.push('Quantify your achievements with numbers (e.g., "Improved performance by 40%")');
  suggestions.push('Tailor your resume keywords to match each job description you apply to');

  return suggestions.slice(0, 8);
}

function generateStrengths(analysis, atsScore) {
  const strengths = [];
  const { sections, contactInfo, skillsFound, wordCount } = analysis;

  if (contactInfo.hasEmail && contactInfo.hasPhone) strengths.push('Complete contact information provided');
  if (contactInfo.hasLinkedIn) strengths.push('LinkedIn profile included — great for recruiter visibility');
  if (sections.hasExperience) strengths.push('Work experience section present and structured');
  if (sections.hasEducation) strengths.push('Education background clearly documented');
  if (sections.hasSkills) strengths.push('Dedicated skills section helps with ATS keyword matching');
  if (sections.hasProjects) strengths.push('Projects section showcases practical experience');
  if (sections.hasCertifications) strengths.push('Certifications add credibility to your profile');
  if (skillsFound.length >= 5) strengths.push(`Strong technical skill set: ${skillsFound.slice(0,5).join(', ')}`);
  if (wordCount >= 300 && wordCount <= 900) strengths.push('Resume length is well-optimized');
  if (atsScore >= 70) strengths.push('Good ATS compatibility overall');

  return strengths.slice(0, 6);
}

function calculateATSScore(resumeText, jobDescription = '') {
  const cleanResume = extractText(resumeText);
  const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;

  const contactInfo = detectContactInfo(resumeText);
  const sections = detectSections(resumeText);
  const skillsFound = findSkillsInResume(resumeText);
  const readabilityScore = calculateReadability(resumeText);

  let score = 0;
  let keywordsFound = [];
  let keywordsMissing = [];

  // === SCORING BREAKDOWN (100 pts) ===

  // 1. Contact Info (15 pts)
  if (contactInfo.hasEmail) score += 5;
  if (contactInfo.hasPhone) score += 5;
  if (contactInfo.hasLinkedIn) score += 3;
  if (contactInfo.hasGitHub) score += 2;

  // 2. Sections (25 pts)
  if (sections.hasExperience) score += 8;
  if (sections.hasEducation) score += 6;
  if (sections.hasSkills) score += 6;
  if (sections.hasSummary) score += 3;
  if (sections.hasProjects) score += 1;
  if (sections.hasCertifications) score += 1;

  // 3. Skills (15 pts)
  const skillScore = Math.min(15, skillsFound.length * 1.5);
  score += skillScore;

  // 4. Word Count (10 pts)
  if (wordCount >= 200 && wordCount <= 900) score += 10;
  else if (wordCount >= 100) score += 5;

  // 5. Readability (5 pts)
  score += Math.round(readabilityScore / 20);

  // 6. Job Description Match (30 pts)
  if (jobDescription && jobDescription.trim().length > 20) {
    const jdKeywords = extractKeywordsFromJD(jobDescription);
    const cleanResumeForMatch = cleanResume;

    jdKeywords.forEach(kw => {
      if (cleanResumeForMatch.includes(kw.toLowerCase())) {
        keywordsFound.push(kw);
      } else {
        keywordsMissing.push(kw);
      }
    });

    const matchRatio = jdKeywords.length > 0 ? keywordsFound.length / jdKeywords.length : 0;
    score += Math.round(matchRatio * 30);

    // Semantic similarity bonus
    try {
      const similarity = stringSimilarity.compareTwoStrings(
        cleanResume.substring(0, 2000),
        jobDescription.toLowerCase().substring(0, 2000)
      );
      score += Math.round(similarity * 5);
    } catch (e) {}
  } else {
    // No JD: give partial credit based on general quality
    score += 15;
  }

  const finalScore = Math.min(100, Math.round(score));

  const analysis = {
    keywordsFound: [...new Set(keywordsFound)].slice(0, 20),
    keywordsMissing: [...new Set(keywordsMissing)].slice(0, 20),
    skillsFound,
    contactInfo,
    sections,
    wordCount,
    readabilityScore
  };

  analysis.suggestions = generateSuggestions(analysis, !!jobDescription, finalScore);
  analysis.strengths = generateStrengths(analysis, finalScore);

  return { atsScore: finalScore, analysis };
}

module.exports = { calculateATSScore };
