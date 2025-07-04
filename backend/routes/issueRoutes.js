// backend/routes/issueRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Import the whole controller object
const issueController = require('../controllers/issueController');

// All routes require authentication
// router.use(authMiddleware); // <--- Authentication is now skipped

router.post('/', issueController.createIssue);
router.get('/', issueController.getIssues);
router.patch('/:id', issueController.updateIssue);
router.post('/:id/comments', issueController.addComment);

// ADD THIS ROUTE for resolving issues:
router.post('/resolve-issue/:id', issueController.resolveIssue);

module.exports = router;
