// backend/controllers/issueController.js
const Issue = require('../models/Issue');

// Create a new issue
exports.createIssue = async (req, res, next) => {
  try {
    const {
      name,
      usn,
      branch,
      section,
      email,
      title,
      issue,    // description field from the frontend form
      photo,
      date,
    } = req.body;

    const newIssue = await Issue.create({
      name,
      usn,
      branch,
      section,
      email,
      title,
      description: issue,
      photo,
      date,
      status: 'pending', // default status
      createdBy: req.user ? req.user._id : undefined,
    });

    res.status(201).json(newIssue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get issues (admins see all, users see own, public see all without user restriction)
exports.getIssues = async (req, res, next) => {
  try {
    let filter = {};
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

// Update an issue's status or assignee
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

// Delete an issue (admin-only; protect with admin middleware in route)
exports.deleteIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json({ message: 'Issue deleted' });
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
      date: new Date(),
    });

    await issue.save();
    res.json(issue);
  } catch (error) {
    next(error);
  }
};

// Mark issue as resolved
exports.resolveIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.status = 'resolved';
    await issue.save();

    res.json(issue);
  } catch (error) {
    next(error);
  }
};

// Upvote or remove upvote for an issue (toggle)
exports.toggleUpvoteIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email; // Or use user._id if your Issue model stores ObjectId

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const hasUpvoted = issue.upvotes && issue.upvotes.includes(userEmail);
    if (hasUpvoted) {
      // Remove upvote
      issue.upvotes = issue.upvotes.filter(email => email !== userEmail);
    } else {
      // Add upvote
      issue.upvotes.push(userEmail);
    }

    await issue.save();
    res.json(issue);
  } catch (error) {
    next(error);
  }
};
