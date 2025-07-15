const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    upvotes: { type: [String], default: [] }, // <-- don't forget!
    // Extra fields for your form
    name: { type: String },
    usn: { type: String },
    branch: { type: String },
    section: { type: String },
    email: { type: String },
    photo: { type: String },
    date: { type: String },
    // issue: { type: String }, // Not needed unless you want original
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);
