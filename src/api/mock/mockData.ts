import type { Service, Booking } from '../../types';

const INITIAL_SERVICES: Service[] = [
  {
    id: 'service-001',
    name: 'Home Deep Cleaning',
    description: 'Comprehensive residential deep cleaning including kitchen, sanitization, floor scrubbing, and window wiping.',
    category: 'Home Cleaning',
    provider: {
      id: 'prov-01',
      name: 'CleanCare Services',
    },
    price: 2500,
    currency: 'NPR',
    durationMinutes: 120,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    activeBookingsCount: 2,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'service-002',
    name: 'Electrical Circuit Diagnostic & Repair',
    description: 'Expert electrician diagnostic for tripping breakers, short circuits, switch repairs, and safety inspection.',
    category: 'Electrical',
    provider: {
      id: 'prov-02',
      name: 'SparkPro Electricals',
    },
    price: 1500,
    currency: 'NPR',
    durationMinutes: 60,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    activeBookingsCount: 0,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'service-003',
    name: 'Plumbing Leak Repair & Unclogging',
    description: 'Fix pipe leaks, high pressure drain unclogging, tap replacement, and bathroom fixture installation.',
    category: 'Plumbing',
    provider: {
      id: 'prov-03',
      name: 'FlowMaster Plumbing',
    },
    price: 1200,
    currency: 'NPR',
    durationMinutes: 45,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=600&q=80',
    activeBookingsCount: 1,
    createdAt: '2026-02-01T09:30:00Z',
    updatedAt: '2026-02-01T09:30:00Z',
  },
  {
    id: 'service-004',
    name: 'AC Servicing & Gas Top-Up',
    description: 'Split and window AC filter cleaning, coil wash, refrigerant pressure check, and cooling optimization.',
    category: 'Appliance',
    provider: {
      id: 'prov-04',
      name: 'CoolTech Solutions',
    },
    price: 2200,
    currency: 'NPR',
    durationMinutes: 90,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
    activeBookingsCount: 0,
    createdAt: '2026-02-10T14:15:00Z',
    updatedAt: '2026-02-10T14:15:00Z',
  },
  {
    id: 'service-005',
    name: 'Full Body Car Wash & Detail',
    description: 'Exterior foam wash, interior vacuuming, dashboard polish, and tire gloss for sedans and SUVs.',
    category: 'Auto Care',
    provider: {
      id: 'prov-05',
      name: 'AutoShine Care',
    },
    price: 1800,
    currency: 'NPR',
    durationMinutes: 75,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80',
    activeBookingsCount: 0,
    createdAt: '2026-02-15T11:00:00Z',
    updatedAt: '2026-02-15T11:00:00Z',
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking-101',
    bookingNumber: 'CSB-2026-0101',
    serviceId: 'service-001',
    serviceName: 'Home Deep Cleaning',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav@example.com',
    customerPhone: '9841000001',
    scheduledDate: '2026-09-02',
    startTime: '09:00',
    endTime: '11:00',
    price: 2500,
    currency: 'NPR',
    status: 'confirmed',
    createdAt: '2026-08-30T10:00:00Z',
  },
  {
    id: 'booking-102',
    bookingNumber: 'CSB-2026-0102',
    serviceId: 'service-001',
    serviceName: 'Home Deep Cleaning',
    customerName: 'Sita Gurung',
    customerEmail: 'sita@example.com',
    customerPhone: '9841000002',
    scheduledDate: '2026-09-03',
    startTime: '14:00',
    endTime: '16:00',
    price: 2500,
    currency: 'NPR',
    status: 'confirmed',
    createdAt: '2026-08-31T09:00:00Z',
  },
  {
    id: 'booking-103',
    bookingNumber: 'CSB-2026-0103',
    serviceId: 'service-003',
    serviceName: 'Plumbing Leak Repair & Unclogging',
    customerName: 'Kiran Thapa',
    customerEmail: 'kiran@example.com',
    customerPhone: '9841000003',
    scheduledDate: '2026-09-02',
    startTime: '11:00',
    endTime: '11:45',
    price: 1200,
    currency: 'NPR',
    status: 'confirmed',
    createdAt: '2026-08-31T11:00:00Z',
  },
];

const SERVICES_KEY = 'csb_mock_services_v1';
const BOOKINGS_KEY = 'csb_mock_bookings_v1';

export const getStoredServices = (): Service[] => {
  try {
    const raw = localStorage.getItem(SERVICES_KEY);
    if (!raw) {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SERVICES;
  }
};

export const saveStoredServices = (services: Service[]): void => {
  try {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  } catch {
    // Ignore quota issues
  }
};

export const getStoredBookings = (): Booking[] => {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
};

export const saveStoredBookings = (bookings: Booking[]): void => {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {
    // Ignore quota issues
  }
};

export const resetMockDatabase = (): { services: Service[]; bookings: Booking[] } => {
  localStorage.setItem(SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
  return { services: INITIAL_SERVICES, bookings: INITIAL_BOOKINGS };
};
