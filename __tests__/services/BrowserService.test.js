const puppeteer = require('puppeteer');

jest.mock('puppeteer');

describe('BrowserService', () => {
  let mockBrowser;
  let mockPage;
  let BrowserService;

  beforeEach(() => {
    mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn(),
      close: jest.fn()
    };

    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(undefined)
    };

    jest.resetModules();
    
    const launchMock = jest.fn().mockResolvedValue(mockBrowser);
    puppeteer.launch = launchMock;
    
    BrowserService = require('../../src/services/BrowserService');
    
    jest.spyOn(BrowserService, 'getBrowser').mockImplementation(async () => {
      const browser = await puppeteer.launch();
      return browser;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('closeBrowser', () => {
    it('should close the browser instance', async () => {
      await BrowserService.closeBrowser(mockBrowser);
      expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should not throw error if browser is undefined', async () => {
      const result = await BrowserService.closeBrowser(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('crawlRooms', () => {
    const mockRoomData = [
      {
        name: 'Deluxe Room',
        description: 'A luxurious room',
        prices: ['R$ 150,00'],
        image: 'https://example.com/room.jpg'
      }
    ];

    beforeEach(() => {
      mockPage.evaluate.mockResolvedValue(mockRoomData);
      process.env.BASE_URL = 'https://example.com';
    });

    it('should successfully crawl rooms', async () => {
      const checkin = '2023-12-20';
      const checkout = '2023-12-25';

      const result = await BrowserService.crawlRooms(checkin, checkout);

      expect(mockPage.goto).toHaveBeenCalledWith(
        expect.stringContaining(`entrada=${checkin}&saida=${checkout}`),
        expect.any(Object)
      );
      expect(mockPage.evaluate).toHaveBeenCalled();
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Deluxe Room',
          description: expect.any(String),
          price: expect.any(String),
          image: expect.any(String)
        })
      ]));
    });

    it('should handle navigation errors', async () => {
      mockPage.goto.mockRejectedValue(new Error('Navigation failed'));

      await expect(BrowserService.crawlRooms('2023-12-20', '2023-12-25'))
        .rejects
        .toThrow('Crawling failed: Navigation failed');
      
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should handle evaluation errors', async () => {
      mockPage.evaluate.mockRejectedValue(new Error('Evaluation failed'));

      await expect(BrowserService.crawlRooms('2023-12-20', '2023-12-25'))
        .rejects
        .toThrow('Crawling failed: Evaluation failed');
      
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should close browser even if an error occurs', async () => {
      const error = new Error('Test error');
      mockPage.goto.mockRejectedValue(error);

      await expect(BrowserService.crawlRooms('2023-12-20', '2023-12-25'))
        .rejects
        .toThrow('Crawling failed: Test error');

      expect(mockBrowser.close).toHaveBeenCalled();
    });
  });
}); 