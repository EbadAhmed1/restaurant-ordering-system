/**
 * Middleware function to handle errors from all routes and controllers.
 * It formats the error response consistently.
 */

const errorHandler = (err, req, res, next) => {
    // Set a status code. If a previous middleware set one, use it, otherwise 500.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
    res.status(statusCode);
    
    // Send a structured JSON error response
    res.json({
        success: false,
        message: err.message,
        // Only include stack trace in development mode for debugging
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
};

module.exports = errorHandler;