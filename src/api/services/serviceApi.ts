import type {
  Service,
  CreateServiceDto,
  UpdateServiceDto,
  ServiceQueryParams,
  ServiceAvailability,
  ApiResponse,
  ApiListResponse,
} from '../../types';
import {
  mockGetServices,
  mockGetServiceById,
  mockCreateService,
  mockUpdateService,
  mockDeleteService,
  mockGetServiceAvailability,
} from '../mock/mockApi';

export const serviceApi = {
  getServices: async (params?: ServiceQueryParams): Promise<ApiListResponse<Service>> => {
    return mockGetServices(params);
  },

  getServiceById: async (id: string): Promise<ApiResponse<Service>> => {
    return mockGetServiceById(id);
  },

  createService: async (dto: CreateServiceDto): Promise<ApiResponse<Service>> => {
    return mockCreateService(dto);
  },

  updateService: async (id: string, dto: UpdateServiceDto): Promise<ApiResponse<Service>> => {
    return mockUpdateService(id, dto);
  },

  deleteService: async (id: string): Promise<void> => {
    return mockDeleteService(id);
  },

  getAvailability: async (serviceId: string, date?: string): Promise<ApiResponse<ServiceAvailability>> => {
    return mockGetServiceAvailability(serviceId, date);
  },
};
