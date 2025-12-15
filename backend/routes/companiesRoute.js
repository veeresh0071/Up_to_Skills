const express = require('express');
const router = express.Router();
const { getCompanies, deleteCompany, getCompanyDetails } = require('../controllers/companiesController');

router.get('/', getCompanies);
router.get('/:id/details', getCompanyDetails);
router.delete('/:id', deleteCompany);

module.exports = router;
