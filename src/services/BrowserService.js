const puppeteer = require('puppeteer');
const { roomSchema } = require('../utils/ValidationSchemas');
const { getMinFormattedPrice } = require('../utils/PriceHelper');
const z = require('zod');

class BrowserService {

  static getBrowser() {
    return puppeteer.launch({});
  };

  static closeBrowser(browser) {
    if (!browser) return;
    return browser.close();
  };

  static async crawlRooms(checkin, checkout) {
      const browser = await this.getBrowser();

      try {
        const page = await browser.newPage();
            
        const url = `${process.env.BASE_URL}?entrada=${checkin}&saida=${checkout}&adultos=1#acomodacoes`;
            
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        const rooms = await page.evaluate(() => {
          const roomElements = Array.from(document.querySelectorAll('div.row.borda-cor'))
          .filter(room => room.querySelector('h3[data-campo="titulo"]') && room.querySelector('div.quarto.descricao'));

          return roomElements.map(room => {
            const name = room.querySelector('h3[data-campo="titulo"]')?.innerText.trim() ?? '';
            const description = room.querySelector('div.quarto.descricao')?.innerText.trim() ?? '';
            const activeImage = room.querySelector('.flexslider .flex-active-slide img');
            const anyImage = room.querySelector('.flexslider img');
            const image = activeImage?.src || anyImage?.src || '';

            const prices = Array.from(room.querySelectorAll('div[data-campo="tarifas"] .row.tarifa b[data-campo="valor"]'))
                .map(priceElement => priceElement?.innerText.trim() || '');

            return { name, description, prices, image };
          });
        });

        const filteredRooms = rooms
            .map(({ name, description, prices, image }) => ({
              name,
              description,
              price: getMinFormattedPrice(prices),
              image,
              }))
            .filter(room => room.price !== '');

        const validatedRooms = z.array(roomSchema).parse(filteredRooms);
        
        return validatedRooms;
    } catch (error) {
      const crawlerError = new Error(`Crawling failed: ${error.message}`);

      crawlerError.statusCode = error.statusCode || 500;
      crawlerError.originalError = error;

      throw crawlerError;
    } finally {
      await this.closeBrowser(browser);
    }
  }
}

module.exports = BrowserService;
