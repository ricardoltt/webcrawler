const { searchRequestSchema, roomSchema, roomResponseSchema } = require('../../src/utils/ValidationSchemas');

describe('ValidationSchemas', () => {
  describe('searchRequestSchema', () => {
    it('should validate valid search params', () => {
      const validData = {
        checkin: '2023-12-20',
        checkout: '2023-12-25'
      };
      
      const result = searchRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date formats', () => {
      const invalidData = {
        checkin: '20/12/2023',
        checkout: '25/12/2023'
      };
      
      const result = searchRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid dates', () => {
      const invalidData = {
        checkin: '2023-13-45',
        checkout: '2023-12-25'
      };
      
      const result = searchRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject when checkout is before checkin', () => {
      const invalidData = {
        checkin: '2023-12-25',
        checkout: '2023-12-20'
      };
      
      const result = searchRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('roomSchema', () => {
    it('should validate valid room data', () => {
      const validRoom = {
        name: 'Deluxe Room',
        description: 'A luxurious room',
        price: 'R$ 150,00',
        image: 'https://example.com/room.jpg'
      };
      
      const result = roomSchema.safeParse(validRoom);
      expect(result.success).toBe(true);
    });

    it('should require a name', () => {
      const invalidRoom = {
        description: 'A luxurious room',
        price: 'R$ 150,00',
        image: 'https://example.com/room.jpg'
      };
      
      const result = roomSchema.safeParse(invalidRoom);
      expect(result.success).toBe(false);
    });

    it('should validate price format', () => {
      const invalidRoom = {
        name: 'Deluxe Room',
        description: 'A luxurious room',
        price: '150,00',
        image: 'https://example.com/room.jpg'
      };
      
      const result = roomSchema.safeParse(invalidRoom);
      expect(result.success).toBe(false);
    });

    it('should validate image URL', () => {
      const invalidRoom = {
        name: 'Deluxe Room',
        description: 'A luxurious room',
        price: 'R$ 150,00',
        image: 'not-a-url'
      };
      
      const result = roomSchema.safeParse(invalidRoom);
      expect(result.success).toBe(false);
    });
  });

  describe('roomResponseSchema', () => {
    it('should validate an array of valid rooms', () => {
      const validRooms = [
        {
          name: 'Deluxe Room',
          description: 'A luxurious room',
          price: 'R$ 150,00',
          image: 'https://example.com/room1.jpg'
        },
        {
          name: 'Standard Room',
          description: 'A standard room',
          price: 'R$ 100,00',
          image: 'https://example.com/room2.jpg'
        }
      ];
      
      const result = roomResponseSchema.safeParse(validRooms);
      expect(result.success).toBe(true);
    });

    it('should reject if any room is invalid', () => {
      const invalidRooms = [
        {
          name: 'Deluxe Room',
          description: 'A luxurious room',
          price: 'R$ 150,00',
          image: 'https://example.com/room1.jpg'
        },
        {
          description: 'A standard room',
          price: 'R$ 100,00',
          image: 'https://example.com/room2.jpg'
        }
      ];
      
      const result = roomResponseSchema.safeParse(invalidRooms);
      expect(result.success).toBe(false);
    });
  });
}); 