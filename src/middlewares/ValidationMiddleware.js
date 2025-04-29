const { ZodError } = require('zod');

class ValidationMiddleware {
  static validateBody(schema) {
    return (req, res, next) => {
      try {
        const validatedData = schema.parse(req.body);
        
        req.body = validatedData;
        
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));
          
          return res.status(400).json({
            error: 'Validation Error',
            details: formattedErrors
          });
        }
        
        next(error);
      }
    };
  }
}

module.exports = ValidationMiddleware; 