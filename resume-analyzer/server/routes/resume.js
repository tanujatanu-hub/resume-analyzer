const express = require('express');
const router = express.Router();
const { uploadResume, getResumes, getResume, reAnalyze, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.use(protect); // All resume routes are protected

router.post('/upload', uploadResume);
router.get('/', getResumes);
router.get('/:id', getResume);
router.put('/:id/analyze', reAnalyze);
router.delete('/:id', deleteResume);

module.exports = router;
