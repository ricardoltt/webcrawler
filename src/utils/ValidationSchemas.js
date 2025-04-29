const z = require('zod');

const searchRequestSchema = z.object({
  checkin: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Checkin date must be in YYYY-MM-DD format' })
    .refine(value => !isNaN(new Date(value).getTime()), {
      message: 'Checkin date is invalid'
    }),
  checkout: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Checkout date must be in YYYY-MM-DD format' })
    .refine(value => !isNaN(new Date(value).getTime()), {
      message: 'Checkout date is invalid'
    })
}).refine(data => {
  const checkinDate = new Date(data.checkin);
  const checkoutDate = new Date(data.checkout);
  return checkoutDate > checkinDate;
}, {
  message: 'Checkout date must be after checkin date',
  path: ['checkout']
});

const roomSchema = z.object({
  name: z.string().min(1, { message: 'Room name is required' }),
  description: z.string().optional(),
  price: z.string()
    .min(1, { message: 'Room price is required' })
    .regex(/^R\$\s?\d{1,3}(\.\d{3})*(,\d{2})?$/, { message: 'Room price must be in the format "R$ 0,00"' }),
  image: z.string().url({ message: 'Room image must be a valid URL' })
});

const roomResponseSchema = z.array(roomSchema);

module.exports = {
  searchRequestSchema,
  roomSchema,
  roomResponseSchema
}; 