const express = require('express');
const multer = require('multer');
// CORRECTED: programsController and formController
const { createProgram, getPrograms, getProgramById, checkDuplicateProgramEnrollment } = require('../controllers/programsController');
const { sendContactEmail } = require('../controllers/formController');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Original Program/Upload Routes
router.post('/', upload.single('resume'), createProgram);
router.get('/', getPrograms);
router.post('/check-duplicate', checkDuplicateProgramEnrollment);
router.get('/:id', getProgramById);

// New Contact Form Route
router.post('/contact', sendContactEmail);

module.exports = router;