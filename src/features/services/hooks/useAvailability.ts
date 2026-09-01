import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../../../api/services/serviceApi';
import { bookingApi } from '../../../api/services/bookingApi';
import type { CreateBookingDto, ApiError } from '../../../types';
import { useToast } from '../../../components/common/ToastContext';

export const availabilityKeys = {
  all: ['availability'] as const,
  byService: (serviceId: string, date?: string) =>
    [...availabilityKeys.all, serviceId, date] as const,
};

export const useAvailabilityQuery = (serviceId: string, date?: string, enabled = true) => {
  return useQuery({
    queryKey: availabilityKeys.byService(serviceId, date),
    queryFn: () => serviceApi.getAvailability(serviceId, date),
    enabled: Boolean(serviceId) && enabled,
    staleTime: 1000 * 30, // 30 seconds for slot freshness
  });
};

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (dto: CreateBookingDto) => bookingApi.createBooking(dto),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      showToast({
        type: 'success',
        title: 'Booking Confirmed!',
        message: `Booking #${res.data.bookingNumber} confirmed for ${res.data.scheduledDate} at ${res.data.startTime}.`,
      });
    },
    onError: (error: ApiError) => {
      if (error.statusCode !== 400) {
        showToast({
          type: 'error',
          title: 'Booking Failed',
          message: error.message || 'Could not complete booking.',
        });
      }
    },
  });
};
