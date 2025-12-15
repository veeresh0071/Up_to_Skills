// routes/companyProfiles.route.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/auth');

const {
  getCompanyProfiles,
  getCompanyProfileById,
  addCompanyProfile,
  updateCompanyProfile,
  getMyCompanyProfile
} = require('../controllers/companyProfilesController');

// Logged-in company profile
router.get('/me', verifyToken, getMyCompanyProfile);

// Admin or public routes
router.get('/', getCompanyProfiles);
router.get('/:id', getCompanyProfileById);

// Create or update profile
router.post('/', verifyToken, upload.single('logo'), addCompanyProfile);
router.put('/', verifyToken, upload.single('logo'), updateCompanyProfile);

module.exports = router;
