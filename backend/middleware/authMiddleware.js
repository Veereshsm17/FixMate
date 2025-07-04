// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // === ADMIN BYPASS: For development/testing only ===
  if (
    req.headers['x-admin-bypass'] === 'true' ||
    req.query.admin_bypass === 'true'
  ) {
    req.user = {
      _id: 'admin-bypass',
      id: 'admin-bypass',
      name: 'Super Admin',
      email: 'smveeresh22@gmail.com',
      role: 'admin',
    };
    console.log('Admin bypass active: req.user set as super admin');
    return next();
  }

  // === Normal JWT authentication ===
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
     

      // If the token is literally the string 'bypass', treat as admin bypass
      if (token === 'bypass') {
        req.user = {
          _id: 'admin-bypass',
          id: 'admin-bypass',
          name: 'Super Admin',
          email: 'smveeresh22@gmail.com',
          role: 'admin',
        };
        console.log('Admin bypass active via Bearer token "bypass"');
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      

      // Support both 'id' and '_id' in JWT payload
      const userId = decoded.id || decoded._id;
      if (!userId) {
        console.error('Invalid token payload:', decoded); // DEBUG
        return res.status(401).json({ message: 'Not authorized, invalid token payload' });
      }

      // Fetch user from DB
      const user = await User.findById(userId).select('-password');
      if (!user) {
        console.error('User not found for ID:', userId); // DEBUG
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Attach role and email to req.user from JWT if available, else from DB
      req.user = {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: decoded.email || user.email,
        role: decoded.role || user.role,
      };

      next();
    } catch (error) {
      console.error('Token verification failed:', error); // DEBUG
      // If you want, you can still allow bypass here for dev:
      if (process.env.ALLOW_ADMIN_BYPASS_ON_ERROR === 'true') {
        req.user = {
          _id: 'admin-bypass',
          id: 'admin-bypass',
          name: 'Super Admin',
          email: 'smveeresh22@gmail.com',
          role: 'admin',
        };
        console.log('Admin bypass active due to token error (dev only)');
        return next();
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error('No token provided'); // DEBUG
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = authMiddleware;
