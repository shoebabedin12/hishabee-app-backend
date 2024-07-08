// authMiddleware.js

// Sample implementation of isAuthenticated middleware
const isAuthenticated = (req, res, next) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
      // If authenticated, proceed to the next middleware or route handler
      return next();
    } else {
      // If not authenticated, send a 401 Unauthorized response
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
  
  module.exports = {
    isAuthenticated
  };
  