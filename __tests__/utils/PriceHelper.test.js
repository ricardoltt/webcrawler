const { normalizePrice, formatPrice, getMinFormattedPrice } = require('../../src/utils/PriceHelper');

describe('PriceHelper', () => {
  describe('normalizePrice', () => {
    it('should convert price text to number', () => {
      expect(normalizePrice('R$ 123,45')).toBe(123.45);
      expect(normalizePrice('R$ 1.234,56')).toBe(1234.56);
      expect(normalizePrice('123,45')).toBe(123.45);
    });

    it('should return null for invalid inputs', () => {
      expect(normalizePrice(null)).toBeNull();
      expect(normalizePrice('')).toBeNull();
      expect(normalizePrice('abc')).toBeNull();
    });
  });

  describe('formatPrice', () => {
    it('should format numbers as Brazilian currency', () => {
      expect(formatPrice(123.45)).toBe('R$ 123,45');
      expect(formatPrice(1234.56)).toBe('R$ 1.234,56');
      expect(formatPrice(1234567.89)).toBe('R$ 1.234.567,89');
    });

    it('should handle edge cases', () => {
      expect(formatPrice(0)).toBe('R$ 0,00');
      expect(formatPrice('invalid')).toBe('');
      expect(formatPrice(NaN)).toBe('');
      expect(formatPrice()).toBe('');
    });
  });

  describe('getMinFormattedPrice', () => {
    it('should find minimum price and format it', () => {
      const prices = ['R$ 150,00', 'R$ 125,50', 'R$ 200,00'];
      expect(getMinFormattedPrice(prices)).toBe('R$ 125,50');
    });

    it('should handle empty array', () => {
      expect(getMinFormattedPrice([])).toBe('');
    });

    it('should handle array with invalid values', () => {
      const prices = ['abc', 'xyz'];
      expect(getMinFormattedPrice(prices)).toBe('');
    });

    it('should handle mixed valid and invalid values', () => {
      const prices = ['abc', 'R$ 150,00', 'xyz', 'R$ 125,50'];
      expect(getMinFormattedPrice(prices)).toBe('R$ 125,50');
    });
  });
}); 