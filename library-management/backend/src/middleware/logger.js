// backend/src/middleware/logger.js
//
// CONCEPT: Middleware
// Middleware is a function that runs BETWEEN receiving a request and sending a response.
// Every middleware function receives three arguments:
//   req  - the incoming request object
//   res  - the outgoing response object
//   next - a function you MUST call to pass control to the next middleware or route handler
//
// If you forget to call next(), the request will hang and never get a response.

const logger = (req, res, next) => {
  // req.method is the HTTP verb: GET, POST, PUT, DELETE etc.
  // req.url  is the path that was requested, e.g. /api/books
  console.log(`${req.method} request made to ${req.url}`);

  // Calling next() hands the request off to the next middleware or route handler.
  next();
};

module.exports = logger;
