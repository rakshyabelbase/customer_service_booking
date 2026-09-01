import type {
  Booking,
  CreateBookingDto,
  ApiResponse,
  ApiListResponse,
} from '../../types';
import {
  mockCreateBooking,
  mockGetBookings,
  mockGetBookingById,
} from '../mock/mockApi';

export const bookingApi = {
  createBooking: async (dto: CreateBookingDto): Promise<ApiResponse<Booking>> => {
    return mockCreateBooking(dto);
  },

  getBookings: async (): Promise<ApiListResponse<Booking>> => {
    return mockGetBookings();
  },

  getBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
    return mockGetBookingById(id);
  },
};
