import type { Booking, CreateBookingDto, Service, ServiceAvailability } from '../../types';

export const mockServices: Service[] = [
  {
    id: 'svc-cleaning',
    name: 'Deep Home Cleaning',
    description: 'A complete room-by-room home cleaning service.',
    category: 'Home Cleaning',
    provider: { id: 'provider-1', name: 'Sparkle Nepal' },
    price: 2500,
    currency: 'NPR',
    durationMinutes: 120,
    rating: 4.8,
    imageUrl: 'https://example.com/cleaning.jpg',
    activeBookingsCount: 3,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'svc-electric',
    name: 'Electrical Safety Check',
    description: 'Inspection of household wiring and electrical panels.',
    category: 'Electrical',
    provider: { id: 'provider-2', name: 'SafeWire Services' },
    price: 1800,
    currency: 'NPR',
    durationMinutes: 60,
    rating: 4.6,
    createdAt: '2026-08-02T00:00:00.000Z',
    updatedAt: '2026-08-02T00:00:00.000Z',
  },
];

export const mockAvailability: ServiceAvailability = {
  serviceId: mockServices[0].id,
  date: '2026-09-03',
  timezone: 'Asia/Kathmandu',
  slots: [{ startTime: '10:00', endTime: '12:00', available: true }],
};

export const mockBookingPayload: CreateBookingDto = {
  serviceId: mockServices[0].id,
  customerName: 'Aarav Sharma',
  customerEmail: 'aarav@example.com',
  serviceAddress: '14 Durbar Marg, Kathmandu',
  scheduledDate: '2026-09-03',
  startTime: '10:00',
};

export const mockConfirmedBooking: Booking = {
  id: 'booking-1',
  bookingNumber: 'BK-2026-001',
  serviceId: mockServices[0].id,
  serviceName: mockServices[0].name,
  provider: mockServices[0].provider,
  customerName: mockBookingPayload.customerName,
  customerEmail: mockBookingPayload.customerEmail,
  serviceAddress: mockBookingPayload.serviceAddress,
  scheduledDate: mockBookingPayload.scheduledDate,
  startTime: mockBookingPayload.startTime,
  endTime: '12:00',
  price: mockServices[0].price,
  currency: mockServices[0].currency,
  status: 'confirmed',
  createdAt: '2026-09-02T08:00:00.000Z',
};
