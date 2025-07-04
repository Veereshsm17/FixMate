// backend/controllers/issueController.js
const Issue = require('../models/Issue');

// Create a new issue
exports.createIssue = async (req, res, next) => {
  try {
    // Accept all fields from the frontend
    const {
      name,
      usn,
      branch,
      section,
      email,
      title,
      issue,   // This is your issue description from the frontend
      photo,
      date,
    } = req.body;

    // Save all fields to MongoDB, mapping 'issue' to 'description'
    const newIssue = await Issue.create({
      name,
      usn,
      branch,
      section,
      email,
      title,
      description: issue, // <-- Maps frontend 'issue' to schema 'description'
      photo,
      date,
      createdBy: req.user ? req.user._id : undefined, // If you want to track user
    });

    res.status(201).json(newIssue);
  } catch (error) {
    // Send error details for easier debugging
    res.status(400).json({ error: error.message });
  }
};

// Get issues (admins see all, students see their own, public sees all)
exports.getIssues = async (req, res, next) => {
  try {
    let filter = {};
    // Only filter by user if req.user exists
    if (req.user) {
      filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const issues = await Issue.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    res.json(issues);
  } catch (error) {
    next(error);
  }
};

// Update an issue
exports.updateIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    if (status) issue.status = status;
    if (assignedTo) issue.assignedTo = assignedTo;

    await issue.save();
    res.json(issue);
  } catch (error) {
    next(error);
  }
};

// Add a comment to an issue
exports.addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.comments.push({
      user: req.user._id,
      text,
    });

    await issue.save();
    res.json(issue);
  } catch (error) {
    next(error);
  }
};

// Mark an issue as resolved
exports.resolveIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.status = "resolved";
    await issue.save();

    res.json(issue);
  } catch (error) {
    next(error);
  }
};
