// clientPaymentMiddleware.js

const ClientPayment = require('../models/clientPayment');

// Validation middleware
const validateClientPayment = (req, res, next) => {
  const { clientId, paymentDate, paymentAmount, paymentStatus } = req.body;

  // Check if required fields are present
  if (!clientId || !paymentDate || !paymentAmount || !paymentStatus) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Additional validation logic if needed...

  next(); // Move to the next middleware or route handler
};

// Authorization middleware
const authorizeClientPayment = async (req, res, next) => {
  const { clientId } = req.body;

  // Check if the user making the request is authorized to perform the operation
  // Example: You might check if the user has permission to manage payments for the specified client

  // Dummy implementation for demonstration purposes
  const authorized = true; // Replace this with your authorization logic

  if (!authorized) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  next(); // Move to the next middleware or route handler
};

// Error handling middleware
const handleClientPaymentError = (err, req, res, next) => {
  console.error('Error in clientPaymentMiddleware:', err);
  res.status(500).json({ message: 'Internal Server Error' });
};

module.exports = {
  validateClientPayment,
  authorizeClientPayment,
  handleClientPaymentError
};
