// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
   console.error('Error:', err);

   // Default error
   let statusCode = err.statusCode || 500;
   let message = err.message || 'Internal Server Error';

   // Handle specific error types
   if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
   } else if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      message = 'Unauthorized Access';
   } else if (err.code === '23505') {
      // PostgreSQL unique violation
      statusCode = 409;
      message = 'Duplicate entry - Resource already exists';
   } else if (err.code === '23503') {
      // PostgreSQL foreign key violation
      statusCode = 400;
      message = 'Invalid reference - Related resource not found';
   } else if (err.code === '22P02') {
      // PostgreSQL invalid text representation
      statusCode = 400;
      message = 'Invalid data format';
   }

   // Send error response
   res.status(statusCode).json({
      success: false,
      message: message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      data: process.env.NODE_ENV === 'development' ? err.message : undefined
   });
};

// 404 handler for unknown routes
export const notFoundHandler = (req, res, next) => {
   res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      data: null
   });
};
