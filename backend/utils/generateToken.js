const jwt = require('jsonwebtoken');

// Accept user object, not just id!
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // include role!
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
