// backend/middleware/admin.js

module.exports = (req, res, next) => {
  // Allow all requests if using the admin bypass (for development/testing)
  if (req.user && req.user.id === 'admin-bypass') {
    return next();
  }
  // Normal admin check
  if (req.user && req.user.role === "admin") {
    return next();
  }
  // If not admin, deny access
  return res.status(403).json({ error: "Admin access required" });
};
