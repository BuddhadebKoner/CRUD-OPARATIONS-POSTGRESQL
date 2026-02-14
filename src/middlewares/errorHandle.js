export const errorHandler = (err, req, res, next) => {
   console.error('Error:', err.message);

   let statusCode = err.statusCode || 500;
   let message = err.message || 'Internal Server Error';

   if (err.code === '23505') {
      statusCode = 409;
      message = 'Duplicate entry - Resource already exists';
   } else if (err.code === '23503') {
      statusCode = 400;
      message = 'Invalid reference - Related resource not found';
   } else if (err.code === '22P02') {
      statusCode = 400;
      message = 'Invalid data format';
   } else if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
   } else if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      message = 'Unauthorized Access';
   }

   const isProduction = process.env.NODE_ENV === 'production';

   res.status(statusCode).json({
      success: false,
      message,
      data: isProduction ? null : {
         error: err.message,
         stack: err.stack,
      },
   });
};

export const notFoundHandler = (req, res, next) => {
   res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      data: null,
   });
};
