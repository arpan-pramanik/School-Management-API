const express = require('express');
const router = express.Router();
const SchoolController = require('../controllers/school.controller');

// Route to add a new school
router.post('/addSchool', SchoolController.addSchool);

// Route to list schools sorted by proximity
router.get('/listSchools', SchoolController.listSchools);

module.exports = router;
