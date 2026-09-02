import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../../../api/services/serviceApi';
import type {
  ServiceQueryParams,
  CreateServiceDto,
  UpdateServiceDto,
  ApiError,
} from '../../../types';
import { useToast } from '../../../components/common/useToast';

export const serviceKeys = {
  all: ['services'],
  lists: () => [...serviceKeys.all, 'list'],
  list: (params?: ServiceQueryParams) => [...serviceKeys.lists(), params],
  details: () => [...serviceKeys.all, 'detail'],
  detail: (id: string) => [...serviceKeys.details(), id],
};

/**
 * Custom query hook for service listing & filtering
 */
export const useServicesQuery = (params?: ServiceQueryParams) => {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: () => serviceApi.getServices(params),
    staleTime: 1000 * 60 * 5, // 5 minutes cache fresh duration
    retry: 1,
  });
};

/**
 * Custom query hook for a single service
 */
export const useServiceQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => serviceApi.getServiceById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

/**
 * Mutation hook for creating a service
 */
export const useCreateServiceMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (dto: CreateServiceDto) => serviceApi.createService(dto),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      showToast({
        type: 'success',
        title: 'Service Created',
        message: `"${response.data.name}" was successfully added to services.`,
      });
    },
    onError: (error: ApiError) => {
      if (error.statusCode !== 400) {
        showToast({
          type: 'error',
          title: 'Create Failed',
          message: error.message || 'Unable to create service.',
        });
      }
    },
  });
};

/**
 * Mutation hook for updating a service
 */
export const useUpdateServiceMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateServiceDto }) =>
      serviceApi.updateService(id, dto),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      showToast({
        type: 'success',
        title: 'Service Updated',
        message: `"${response.data.name}" has been updated successfully.`,
      });
    },
    onError: (error: ApiError) => {
      if (error.statusCode !== 400) {
        showToast({
          type: 'error',
          title: 'Update Failed',
          message: error.message || 'Unable to update service.',
        });
      }
    },
  });
};

/**
 * Mutation hook for deleting a service
 */
export const useDeleteServiceMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => serviceApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      showToast({
        type: 'success',
        title: 'Service Deleted',
        message: 'Service has been permanently removed.',
      });
    },
    onError: (error: ApiError) => {
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: error.message || 'Unable to delete service.',
      });
    },
  });
};
