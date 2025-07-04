const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Issue = require('../models/Issue');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/admin');

// --- Nodemailer setup (added) ---
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER || 'smveeresh22@gmail.com',      // your email
    pass: process.env.MAIL_PASS || 'avuzqwxfrydxbisn',       // your password or app password
  },
});
// --------------------------------

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

  // --- Helper function to send resolved email (added) ---
  async function sendResolvedEmail(issue) {
    if (!issue.email) return;
    try {
      await transporter.sendMail({
        from: process.env.MAIL_USER || 'smveeresh22@gamil.com',
        to: issue.email,
        subject: 'Your Issue Has Been Resolved',
        text: `Hello,\n\nYour reported issue "${issue.issue || issue.description || issue.title}" has been resolved. Thank you for helping us improve!\n\nBest regards,\nAdmin Team`,
      });
    } catch (err) {
      console.error('Error sending resolved email:', err);
    }
  }
  // ------------------------------------------------------

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
        issue = await Issue.findOne({ id: id });
      }
      if (!issue) return res.status(404).json({ error: 'Issue not found' });

      issue.status = 'resolved';
      await issue.save();

      // --- Send email (added) ---
      await sendResolvedEmail(issue);
      // --------------------------

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

    // --- Send email (added) ---
    await sendResolvedEmail(issue);
    // --------------------------

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
        issue = await Issue.findByIdAndDelete(id);
      }
      // If not found or not valid ObjectId, try 'id' field (string id)
      if (!issue) {
        issue = await Issue.findOneAndDelete({ id: id });
      }
      if (!issue) return res.status(404).json({ error: 'Issue not found' });

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
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    console.error('Error deleting resolved issue:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
