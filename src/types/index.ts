export interface ServiceProvider {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: ServiceProvider;
  price: number;
  currency: string;
  durationMinutes: number;
  rating: number;
  imageUrl?: string;
  activeBookingsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  category: string;
  providerName: string;
  price: number;
  currency?: string;
  durationMinutes: number;
  imageUrl?: string;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  category?: string;
  providerName?: string;
  price?: number;
  currency?: string;
  durationMinutes?: number;
  imageUrl?: string;
}

export interface ServiceQueryParams {
  search?: string;
  category?: string;
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface ServiceAvailability {
  serviceId: string;
  date: string;
  timezone: string;
  slots: AvailabilitySlot[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  price: number;
  currency: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface CreateBookingDto {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  scheduledDate: string;
  startTime: string;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'ACTIVE_BOOKINGS_CONFLICT'
  | 'SLOT_UNAVAILABLE'
  | 'INTERNAL_SERVER_ERROR';

export type FieldErrors = Record<string, string>;

export interface ApiErrorPayload {
  code: ApiErrorCode;
  message: string;
  fieldErrors?: FieldErrors;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ApiErrorCode;
  public readonly fieldErrors?: FieldErrors;

  constructor(statusCode: number, payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = payload.code;
    this.fieldErrors = payload.fieldErrors;
  }
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: {
    total: number;
  };
}
