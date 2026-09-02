import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../../../api/services/bookingApi';
import type {
  BookingQueryParams,
  CreateBookingDto,
  UpdateBookingDto,
  ApiError,
} from '../../../types';
import { useToast } from '../../../components/common/useToast';
import { availabilityKeys } from '../../services/hooks/useAvailability';
import { serviceKeys } from '../../services/hooks/useServices';

export const bookingKeys = {
  all: ['bookings'],
  lists: () => [...bookingKeys.all, 'list'],
  list: (params?: BookingQueryParams) => [...bookingKeys.lists(), params],
  details: () => [...bookingKeys.all, 'detail'],
  detail: (id: string) => [...bookingKeys.details(), id],
};

/**
 * Hook to fetch bookings, optionally filtered by service ID & params
 */
export const useServiceBookings = (serviceId?: string, params?: BookingQueryParams, enabled = true) => {
  const queryParams: BookingQueryParams = { ...params, serviceId };
  return useQuery({
    queryKey: bookingKeys.list(queryParams),
    queryFn: () => bookingApi.getBookings(queryParams),
    enabled: Boolean(serviceId || params) && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
};

/**
 * Hook to fetch a single booking details by ID
 */
export const useBookingQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingApi.getBookingById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

/**
 * Mutation hook for creating a new booking
 */
export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (dto: CreateBookingDto) => bookingApi.createBooking(dto),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      showToast({
        type: 'success',
        title: 'Booking Confirmed!',
        message: `Booking #${res.data.bookingNumber} for ${res.data.customerName} on ${res.data.scheduledDate} at ${res.data.startTime} was created successfully.`,
      });
    },
    onError: (error: ApiError) => {
      if (error.statusCode !== 400 && error.statusCode !== 409) {
        showToast({
          type: 'error',
          title: 'Booking Failed',
          message: error.message || 'Unable to complete booking request.',
        });
      }
    },
  });
};

/**
 * Mutation hook for updating/rescheduling a booking
 */
export const useUpdateBookingMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBookingDto }) =>
      bookingApi.updateBooking(id, dto),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      showToast({
        type: 'success',
        title: 'Booking Updated',
        message: `Booking #${res.data.bookingNumber} has been updated successfully.`,
      });
    },
    onError: (error: ApiError) => {
      if (error.statusCode !== 400 && error.statusCode !== 409) {
        showToast({
          type: 'error',
          title: 'Update Failed',
          message: error.message || 'Unable to update booking.',
        });
      }
    },
  });
};

/**
 * Mutation hook for cancelling/deleting a booking
 */
export const useDeleteBookingMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => bookingApi.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      showToast({
        type: 'success',
        title: 'Booking Cancelled',
        message: 'The booking has been successfully cancelled.',
      });
    },
    onError: (error: ApiError) => {
      showToast({
        type: 'error',
        title: 'Cancellation Failed',
        message: error.message || 'Unable to cancel booking.',
      });
    },
  });
};
