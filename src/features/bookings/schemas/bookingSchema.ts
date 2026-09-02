import { z } from 'zod';
import { getLocalDateString } from '../../../utils/date';

const isValidDateString = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export const bookingSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, 'Customer name is required.')
    .min(2, 'Name must be at least 2 characters.'),
  customerEmail: z
    .string()
    .trim()
    .min(1, 'Customer email is required.')
    .pipe(z.email('Please provide a valid email address.')),
  customerPhone: z.string().trim().optional(),
  serviceAddress: z
    .string()
    .trim()
    .min(8, 'Enter a complete service address (at least 8 characters).'),
  scheduledDate: z
    .string()
    .min(1, 'Booking date is required.')
    .refine(isValidDateString, 'Please provide a valid booking date.')
    .refine((value) => !isValidDateString(value) || value >= getLocalDateString(), {
      message: 'Booking date cannot be in the past.',
    }),
  startTime: z.string().min(1, 'Please select an available time slot.'),
  notes: z.string().trim().optional(),
  status: z.enum(['confirmed', 'completed', 'cancelled']),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
