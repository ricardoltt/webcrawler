const BrowserService = require('../services/BrowserService');

class SearchController {
  static async search(req, res) {
    try {
      const { checkin, checkout } = req.body;
      
      const rooms = await BrowserService.crawlRooms(checkin, checkout);
        
      return res.json(rooms);

    } catch (error) {
        return res.status(error.statusCode || 500).json({
          error: 'Unable to retrieve room information',
        });
    }
  }
}

module.exports = SearchController; 