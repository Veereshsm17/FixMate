const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Issue = require('../models/Issue');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/admin');

// --- Nodemailer setup (unchanged except typo fixed) ---
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER || 'smveeresh22@gmail.com',      // your email
    pass: process.env.MAIL_PASS || 'avuzqwxfrydxbisn',           // your password or app password
  },
});
// ------------------------------------------------------

// Get all pending issues (for admin)
router.get('/pending-issues', auth, admin, async (req, res) => {
  try {
    const issues = await Issue.find({ status: { $ne: 'resolved' } });
    res.json(issues);
  } catch (err) {
    console.error('Error fetching pending issues:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark an issue as resolved
router.post('/resolve-issue/:id', auth, admin, async (req, res) => {
  const { id } = req.params;

  // --- Helper function to send resolved email ---
  async function sendResolvedEmail(issue) {
    if (!issue.email) return;
    try {
      await transporter.sendMail({
        from: process.env.MAIL_USER || 'smveeresh22@gmail.com', // typo fixed!
        to: issue.email,
        subject: 'Your Issue Has Been Resolved',
        text: `Hello,\n\nYour reported issue "${issue.issue || issue.description || issue.title}" has been resolved. Thank you for helping us improve!\n\nBest regards,\nAdmin Team`,
      });
    } catch (err) {
      console.error('Error sending resolved email:', err);
    }
  }
  // ------------------------------------------------

  // Bypass ObjectId check for admin email
  if (req.user && req.user.email === 'smveeresh22@gmail.com') {
    try {
      let issue = null;

      // Only try _id if id is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(id)) {
        issue = await Issue.findById(id);
      }
      // If not found or not valid ObjectId, try 'id' field (string id)
      if (!issue) {
        // Keep this for your custom environment, but you must create an 'id' field if you want it to work!
        issue = await Issue.findOne({ id: id });
      }
      if (!issue) return res.status(404).json({ error: 'Issue not found' });

      issue.status = 'resolved';
      await issue.save();

      // --- Send email ---
      await sendResolvedEmail(issue);
      // ------------------

      return res.json(issue);
    } catch (err) {
      console.error('Error in resolve-issue (admin bypass):', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // For everyone else, validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid issue ID' });
  }
  try {
    const issue = await Issue.findByIdAndUpdate(
      id,
      { status: 'resolved' },
      { new: true }
    );
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    // --- Send email ---
    await sendResolvedEmail(issue);
    // ------------------

    res.json(issue);
  } catch (err) {
    console.error('Error in resolve-issue:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a resolved issue
router.delete('/resolved-issues/:id', auth, admin, async (req, res) => {
  const { id } = req.params;

  // Bypass ObjectId check for admin email
  if (req.user && req.user.email === 'smveeresh22@gmail.com') {
    try {
      let issue = null;

      // Only try _id if id is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(id)) {
        // Only allow delete if status == 'resolved'
        issue = await Issue.findOneAndDelete({ _id: id, status: 'resolved' });
      }
      // If not found or not valid ObjectId, try 'id' field (string id)
      if (!issue) {
        // Again, only if you have a custom 'id' field!
        issue = await Issue.findOneAndDelete({ id: id, status: 'resolved' });
      }
      if (!issue) return res.status(404).json({ error: 'Issue not found or not resolved' });

      return res.json({ message: 'Issue deleted' });
    } catch (err) {
      console.error('Error deleting resolved issue (admin bypass):', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // For everyone else, validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid issue ID' });
  }
  try {
    // Only delete if status == 'resolved'
    const issue = await Issue.findOneAndDelete({ _id: id, status: 'resolved' });
    if (!issue) return res.status(404).json({ error: 'Issue not found or not resolved' });
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    console.error('Error deleting resolved issue:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
