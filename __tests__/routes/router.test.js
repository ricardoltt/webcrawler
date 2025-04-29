const request = require('supertest');
const express = require('express');

jest.mock('../../src/controllers/BrowserController', () => ({
  search: jest.fn((req, res) => res.json([{ 
    name: 'Test Room', 
    description: 'Test Description', 
    price: 'R$ 100,00', 
    image: 'https://example.com/image.jpg' 
  }]))
}));

const router = require('../../src/routes/router');
const SearchController = require('../../src/controllers/BrowserController');

describe('Router endpoints', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    
    app = express();
    app.use(express.json());
    app.use(router);
  });

  describe('GET /', () => {
    it('should return a greeting message', async () => {
      const response = await request(app).get('/');
      
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Hello Asksuite World!');
    });
  });

  describe('POST /search', () => {
    it('should call the search controller and return 200 when request is valid', async () => {
      const response = await request(app)
        .post('/search')
        .send({ 
          checkin: '2023-12-20', 
          checkout: '2023-12-25' 
        });
      
      expect(SearchController.search).toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          name: 'Test Room'
        })
      ]);
    });

    it('should return 400 when checkin is missing', async () => {
      const response = await request(app)
        .post('/search')
        .send({ checkout: '2023-12-31' });
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation Error');
    });

    it('should return 400 when checkout is missing', async () => {
      const response = await request(app)
        .post('/search')
        .send({ checkin: '2023-12-20' });
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation Error');
    });

    it('should return 400 when dates are invalid format', async () => {
      const response = await request(app)
        .post('/search')
        .send({ 
          checkin: '20-12-2023', 
          checkout: '31-12-2023' 
        });
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation Error');
    });

    it('should return 400 when checkout is before checkin', async () => {
      const response = await request(app)
        .post('/search')
        .send({ 
          checkin: '2023-12-25', 
          checkout: '2023-12-20' 
        });
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation Error');
    });
  });
}); 