import { z } from 'zod';

export const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Service name is required.')
    .min(3, 'Service name must be at least 3 characters.'),
  description: z.string().trim().min(1, 'Description is required.'),
  category: z.string().trim().min(1, 'Category is required.'),
  providerName: z.string().trim().min(1, 'Provider name is required.'),
  price: z
    .number({ error: 'Price is required.' })
    .finite('Price is required.')
    .positive('Price must be a positive number greater than 0.'),
  currency: z.string().trim().optional(),
  durationMinutes: z
    .number({ error: 'Duration is required.' })
    .finite('Duration is required.')
    .min(15, 'Duration must be at least 15 minutes.'),
  imageUrl: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
