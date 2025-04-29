const SearchController = require('../../src/controllers/BrowserController');
const BrowserService = require('../../src/services/BrowserService');

jest.mock('../../src/services/BrowserService');

describe('SearchController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        checkin: '2023-12-20',
        checkout: '2023-12-25'
      }
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('search', () => {
    it('should return rooms when crawl succeeds', async () => {
      const mockRooms = [
        {
          name: 'Deluxe Room',
          description: 'A luxurious room',
          price: 'R$ 150,00',
          image: 'https://example.com/room.jpg'
        }
      ];

      BrowserService.crawlRooms = jest.fn().mockResolvedValue(mockRooms);

      await SearchController.search(req, res);

      expect(BrowserService.crawlRooms).toHaveBeenCalledWith('2023-12-20', '2023-12-25');
      expect(res.json).toHaveBeenCalledWith(mockRooms);
    });

    it('should return 500 when crawling fails', async () => {
      const error = new Error('Crawling failed: Network error');
      error.statusCode = 503;
      BrowserService.crawlRooms = jest.fn().mockRejectedValue(error);

      await SearchController.search(req, res);

      expect(BrowserService.crawlRooms).toHaveBeenCalledWith('2023-12-20', '2023-12-25');
      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Unable to retrieve room information'
      });
    });

    it('should use default 500 status when error has no statusCode', async () => {
      const error = new Error('Crawling failed: Some error');
      BrowserService.crawlRooms = jest.fn().mockRejectedValue(error);

      await SearchController.search(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
}); 