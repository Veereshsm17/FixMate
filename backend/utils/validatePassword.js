// backend/utils/validatePassword.js
module.exports = function validatePassword(password) {
  // Example: at least 6 chars, one number, one letter
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
};
