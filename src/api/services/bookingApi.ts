import type {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  BookingQueryParams,
  ApiResponse,
  ApiListResponse,
} from '../../types';
import {
  mockCreateBooking,
  mockGetBookings,
  mockGetBookingById,
  mockUpdateBooking,
  mockDeleteBooking,
} from '../mock/mockApi';

export const bookingApi = {
  createBooking: async (dto: CreateBookingDto): Promise<ApiResponse<Booking>> => {
    return mockCreateBooking(dto);
  },

  getBookings: async (params?: BookingQueryParams): Promise<ApiListResponse<Booking>> => {
    return mockGetBookings(params);
  },

  getBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
    return mockGetBookingById(id);
  },

  updateBooking: async (id: string, dto: UpdateBookingDto): Promise<ApiResponse<Booking>> => {
    return mockUpdateBooking(id, dto);
  },

  deleteBooking: async (id: string): Promise<void> => {
    return mockDeleteBooking(id);
  },
};
