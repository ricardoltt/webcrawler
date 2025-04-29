const ValidationMiddleware = require('../../src/middlewares/ValidationMiddleware');
const { searchRequestSchema } = require('../../src/utils/ValidationSchemas');

describe('ValidationMiddleware', () => {
  describe('validateBody', () => {
    let req, res, next;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    it('should call next() when validation passes', () => {
      req.body = {
        checkin: '2023-12-20',
        checkout: '2023-12-25'
      };
      const middleware = ValidationMiddleware.validateBody(searchRequestSchema);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 with error details when validation fails', () => {
      req.body = {
        checkin: 'invalid-date'
      };
      const middleware = ValidationMiddleware.validateBody(searchRequestSchema);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Validation Error',
        details: expect.any(Array)
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should pass other errors to next()', () => {
      req.body = {
        checkin: '2023-12-20',
        checkout: '2023-12-25'
      };
      const error = new Error('Test error');
      const mockSchema = {
        parse: jest.fn().mockImplementation(() => {
          throw error;
        })
      };
      const middleware = ValidationMiddleware.validateBody(mockSchema);

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
}); 