function normalizePrice(priceText) {
    if (!priceText) return null;
    const match = priceText.match(/[\d,.]+/);
    if (!match) return null;
    const number = match[0].replace(/\./g, '').replace(',', '.');
    return parseFloat(number);
  }
  
  function formatPrice(priceNumber) {
    if (typeof priceNumber !== 'number' || isNaN(priceNumber)) return '';
    return `R$ ${priceNumber.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }
  
  function getMinFormattedPrice(prices = []) {
    const normalizedPrices = prices
      .map(normalizePrice)
      .filter(price => price !== null);
  
    if (normalizedPrices.length === 0) return '';
  
    const minPrice = Math.min(...normalizedPrices);
    return formatPrice(minPrice);
  }
  
  module.exports = {
    normalizePrice,
    formatPrice,
    getMinFormattedPrice,
  };