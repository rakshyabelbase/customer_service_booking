import type {
  Service,
  CreateServiceDto,
  UpdateServiceDto,
  ServiceQueryParams,
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  BookingQueryParams,
  ServiceAvailability,
  ApiResponse,
  ApiListResponse,
  FieldErrors,
} from '../../types';
import { ApiError } from '../../types';
import {
  getStoredServices,
  saveStoredServices,
  getStoredBookings,
  saveStoredBookings,
} from './mockData';
import { executeRequest } from '../client/httpClient';

// Helper to calculate end time string
const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, mins] = startTime.split(':').map(Number);
  const totalMins = hours * 60 + mins + durationMinutes;
  const endHours = Math.floor(totalMins / 60) % 24;
  const endMins = totalMins % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
};

// 1. GET /api/v1/services
export const mockGetServices = async (
  params?: ServiceQueryParams
): Promise<ApiListResponse<Service>> => {
  return executeRequest(async () => {
    let services = getStoredServices();

    if (params?.category && params.category !== 'All') {
      const catLower = params.category.toLowerCase();
      services = services.filter((s) => s.category.toLowerCase() === catLower);
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.provider.name.toLowerCase().includes(q)
      );
    }

    return {
      data: services,
      meta: { total: services.length },
    };
  });
};

// 2. GET /api/v1/services/{service_id}
export const mockGetServiceById = async (serviceId: string): Promise<ApiResponse<Service>> => {
  return executeRequest(async () => {
    const services = getStoredServices();
    const service = services.find((s) => s.id === serviceId);

    if (!service) {
      throw new ApiError(404, {
        code: 'NOT_FOUND',
        message: `Service with ID '${serviceId}' could not be found.`,
      });
    }

    return { data: service };
  });
};

// 3. POST /api/v1/services
export const mockCreateService = async (
  dto: CreateServiceDto
): Promise<ApiResponse<Service>> => {
  return executeRequest(async () => {
    const fieldErrors: FieldErrors = {};

    if (!dto.name || !dto.name.trim()) {
      fieldErrors.name = 'Service name is required.';
    } else if (dto.name.trim().length < 3) {
      fieldErrors.name = 'Service name must be at least 3 characters.';
    }

    if (!dto.description || !dto.description.trim()) {
      fieldErrors.description = 'Service description is required.';
    }

    if (!dto.category || !dto.category.trim()) {
      fieldErrors.category = 'Service category is required.';
    }

    if (dto.price === undefined || dto.price === null || isNaN(dto.price)) {
      fieldErrors.price = 'Price is required.';
    } else if (dto.price <= 0) {
      fieldErrors.price = 'Price must be a positive number greater than 0.';
    }

    if (dto.durationMinutes === undefined || dto.durationMinutes === null || isNaN(dto.durationMinutes)) {
      fieldErrors.durationMinutes = 'Duration is required.';
    } else if (dto.durationMinutes < 15) {
      fieldErrors.durationMinutes = 'Duration must be at least 15 minutes.';
    }

    if (!dto.providerName || !dto.providerName.trim()) {
      fieldErrors.providerName = 'Provider name is required.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      throw new ApiError(400, {
        code: 'VALIDATION_ERROR',
        message: 'Form validation failed. Please correct the highlighted errors.',
        fieldErrors,
      });
    }

    const services = getStoredServices();
    const now = new Date().toISOString();
    const newService: Service = {
      id: `service-${Date.now().toString().slice(-4)}`,
      name: dto.name.trim(),
      description: dto.description.trim(),
      category: dto.category.trim(),
      provider: {
        id: `prov-${Date.now().toString().slice(-4)}`,
        name: dto.providerName.trim(),
      },
      price: Number(dto.price),
      currency: dto.currency || 'NPR',
      durationMinutes: Number(dto.durationMinutes),
      rating: 5.0,
      imageUrl: dto.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      activeBookingsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newService, ...services];
    saveStoredServices(updatedList);

    return { data: newService };
  });
};

// 4. PUT /api/v1/services/{service_id}
export const mockUpdateService = async (
  serviceId: string,
  dto: UpdateServiceDto
): Promise<ApiResponse<Service>> => {
  return executeRequest(async () => {
    const services = getStoredServices();
    const index = services.findIndex((s) => s.id === serviceId);

    if (index === -1) {
      throw new ApiError(404, {
        code: 'NOT_FOUND',
        message: `Service with ID '${serviceId}' was not found.`,
      });
    }

    const fieldErrors: FieldErrors = {};

    if (dto.name !== undefined) {
      if (!dto.name.trim()) fieldErrors.name = 'Service name cannot be empty.';
      else if (dto.name.trim().length < 3) fieldErrors.name = 'Service name must be at least 3 characters.';
    }

    if (dto.price !== undefined && dto.price <= 0) {
      fieldErrors.price = 'Price must be a positive number greater than 0.';
    }

    if (dto.durationMinutes !== undefined && dto.durationMinutes < 15) {
      fieldErrors.durationMinutes = 'Duration must be at least 15 minutes.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      throw new ApiError(400, {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed for service update.',
        fieldErrors,
      });
    }

    const current = services[index];
    const updated: Service = {
      ...current,
      name: dto.name ? dto.name.trim() : current.name,
      description: dto.description !== undefined ? dto.description.trim() : current.description,
      category: dto.category ? dto.category.trim() : current.category,
      provider: dto.providerName
        ? { ...current.provider, name: dto.providerName.trim() }
        : current.provider,
      price: dto.price !== undefined ? Number(dto.price) : current.price,
      currency: dto.currency || current.currency,
      durationMinutes: dto.durationMinutes !== undefined ? Number(dto.durationMinutes) : current.durationMinutes,
      imageUrl: dto.imageUrl !== undefined ? dto.imageUrl : current.imageUrl,
      updatedAt: new Date().toISOString(),
    };

    services[index] = updated;
    saveStoredServices(services);

    return { data: updated };
  });
};

// 5. DELETE /api/v1/services/{service_id}
export const mockDeleteService = async (serviceId: string): Promise<void> => {
  return executeRequest(async () => {
    const services = getStoredServices();
    const service = services.find((s) => s.id === serviceId);

    if (!service) {
      throw new ApiError(404, {
        code: 'NOT_FOUND',
        message: `Service with ID '${serviceId}' was not found.`,
      });
    }

    // Business check: active bookings conflict (409 Conflict)
    const bookings = getStoredBookings();
    const activeBookings = bookings.filter(
      (b) => b.serviceId === serviceId && b.status === 'confirmed'
    );

    if (activeBookings.length > 0 || (service.activeBookingsCount && service.activeBookingsCount > 0)) {
      throw new ApiError(409, {
        code: 'ACTIVE_BOOKINGS_CONFLICT',
        message: `Cannot delete service '${service.name}' because it currently has ${
          activeBookings.length || service.activeBookingsCount
        } active confirmed customer booking(s).`,
      });
    }

    const filtered = services.filter((s) => s.id !== serviceId);
    saveStoredServices(filtered);
  });
};

// 6. GET /api/v1/services/{service_id}/availability
export const mockGetServiceAvailability = async (
  serviceId: string,
  date?: string
): Promise<ApiResponse<ServiceAvailability>> => {
  return executeRequest(async () => {
    const services = getStoredServices();
    const service = services.find((s) => s.id === serviceId);

    if (!service) {
      throw new ApiError(404, {
        code: 'NOT_FOUND',
        message: `Service with ID '${serviceId}' not found.`,
      });
    }

    const selectedDate = date || new Date().toISOString().split('T')[0];
    const bookings = getStoredBookings();
    const existingBookings = bookings.filter(
      (b) => b.serviceId === serviceId && b.scheduledDate === selectedDate && b.status === 'confirmed'
    );
    const bookedTimes = new Set(existingBookings.map((b) => b.startTime));

    const defaultTimeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
    const slots = defaultTimeSlots.map((startTime) => {
      const isBooked = bookedTimes.has(startTime);
      return {
        startTime,
        endTime: calculateEndTime(startTime, service.durationMinutes),
        available: !isBooked,
      };
    });

    return {
      data: {
        serviceId,
        date: selectedDate,
        timezone: 'Asia/Kathmandu',
        slots,
      },
    };
  });
};

// 7. POST /api/v1/bookings
export const mockCreateBooking = async (
  dto: CreateBookingDto
): Promise<ApiResponse<Booking>> => {
  return executeRequest(async () => {
    const fieldErrors: FieldErrors = {};

    if (!dto.serviceId) fieldErrors.serviceId = 'Service is required.';
    if (!dto.customerName || !dto.customerName.trim()) fieldErrors.customerName = 'Customer name is required.';
    if (!dto.customerEmail || !dto.customerEmail.trim()) fieldErrors.customerEmail = 'Customer email is required.';
    if (!dto.scheduledDate) fieldErrors.scheduledDate = 'Date is required.';
    if (!dto.startTime) fieldErrors.startTime = 'Time slot is required.';

    if (Object.keys(fieldErrors).length > 0) {
      throw new ApiError(400, {
        code: 'VALIDATION_ERROR',
        message: 'Booking validation failed.',
        fieldErrors,
      });
    }

    const services = getStoredServices();
    const service = services.find((s) => s.id === dto.serviceId);
    if (!service) {
      throw new ApiError(404, {
        code: 'NOT_FOUND',
        message: `Service with ID '${dto.serviceId}' not found.`,
      });
    }

    // Business check: slot conflict (409 Conflict)
    const bookings = getStoredBookings();
    const isConflict = bookings.some(
      (b) =>
        b.serviceId === dto.serviceId &&
        b.scheduledDate === dto.scheduledDate &&
        b.startTime === dto.startTime &&
        b.status === 'confirmed'
    );

    if (isConflict) {
      throw new ApiError(409, {
        code: 'SLOT_UNAVAILABLE',
        message: `The slot ${dto.startTime} on ${dto.scheduledDate} is no longer available. Please select another slot.`,
      });
    }

    const newBooking: Booking = {
      id: `booking-${Date.now().toString().slice(-4)}`,
      bookingNumber: `CSB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: dto.serviceId,
      serviceName: service.name,
      customerName: dto.customerName.trim(),
      customerEmail: dto.customerEmail.trim(),
      customerPhone: dto.customerPhone?.trim(),
      scheduledDate: dto.scheduledDate,
      startTime: dto.startTime,
      endTime: calculateEndTime(dto.startTime, service.durationMinutes),
      price: service.price,
      currency: service.currency,
      status: 'confirmed',
      notes: dto.notes?.trim(),
      createdAt: new Date().toISOString(),
    };

    // Save booking & increment active bookings count on service
    saveStoredBookings([newBooking, ...bookings]);

    const serviceIndex = services.findIndex((s) => s.id === dto.serviceId);
    if (serviceIndex !== -1) {
      services[serviceIndex].activeBookingsCount = (services[serviceIndex].activeBookingsCount || 0) + 1;
      saveStoredServices(services);
    }

    return { data: newBooking };
  });
};

// 8. GET /api/v1/bookings
export const mockGetBookings = async (
  params?: BookingQueryParams
): Promise<ApiListResponse<Booking>> => {
  return executeRequest(async () => {
    let bookings = getStoredBookings();

    if (params?.serviceId) {
      bookings = bookings.filter((b) => b.serviceId === params.serviceId);
    }

    if (params?.status) {
      bookings = bookings.filter((b) => b.status === params.status);
    }

    return {
      data: bookings,
      meta: { total: bookings.length },
    };
  });
};

// 9. GET /api/v1/bookings/{booking_id}
export const mockGetBookingById = async (bookingId: string): Promise<ApiResponse<Booking>> => {
  return executeRequest(async () => {
    const bookings = getStoredBookings();
    const booking = bookings.find((b) => b.id === bookingId);

    if (!booking) {
      throw new ApiError(404, {
        code: 'NOT_FOUND',
        message: `Booking with ID '${bookingId}' not found.`,
      });
    }

    return { data: booking };
  });
};

// 10. PATCH /api/v1/bookings/{booking_id}
export const mockUpdateBooking = async (
  bookingId: string,
  dto: UpdateBookingDto
): Promise<ApiResponse<Booking>> => {
  return executeRequest(async () => {
    const bookings = getStoredBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);

    if (index === -1) {
      throw new ApiError(404, {
        code: 'NOT_FOUND',
        message: `Booking with ID '${bookingId}' not found.`,
      });
    }

    const currentBooking = bookings[index];
    const fieldErrors: FieldErrors = {};

    if (dto.customerName !== undefined && !dto.customerName.trim()) {
      fieldErrors.customerName = 'Customer name cannot be empty.';
    }
    if (dto.customerEmail !== undefined && !dto.customerEmail.trim()) {
      fieldErrors.customerEmail = 'Customer email cannot be empty.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      throw new ApiError(400, {
        code: 'VALIDATION_ERROR',
        message: 'Booking update validation failed.',
        fieldErrors,
      });
    }

    const targetDate = dto.scheduledDate || currentBooking.scheduledDate;
    const targetStartTime = dto.startTime || currentBooking.startTime;
    const targetStatus = dto.status || currentBooking.status;

    // Slot conflict check if date or start time changes while booking is confirmed
    if (
      targetStatus === 'confirmed' &&
      (targetDate !== currentBooking.scheduledDate || targetStartTime !== currentBooking.startTime)
    ) {
      const isConflict = bookings.some(
        (b) =>
          b.id !== bookingId &&
          b.serviceId === currentBooking.serviceId &&
          b.scheduledDate === targetDate &&
          b.startTime === targetStartTime &&
          b.status === 'confirmed'
      );

      if (isConflict) {
        throw new ApiError(409, {
          code: 'SLOT_UNAVAILABLE',
          message: `The slot ${targetStartTime} on ${targetDate} is no longer available. Please select another slot.`,
        });
      }
    }

    // Calculate updated end time if slot changed
    const services = getStoredServices();
    const service = services.find((s) => s.id === currentBooking.serviceId);
    const duration = service ? service.durationMinutes : 60;
    const updatedEndTime = calculateEndTime(targetStartTime, duration);

    // Check if status changed to adjust service active bookings count
    const statusChanged = currentBooking.status !== targetStatus;
    if (statusChanged && service) {
      const serviceIndex = services.findIndex((s) => s.id === service.id);
      if (serviceIndex !== -1) {
        if (currentBooking.status === 'confirmed' && targetStatus !== 'confirmed') {
          services[serviceIndex].activeBookingsCount = Math.max(
            0,
            (services[serviceIndex].activeBookingsCount || 1) - 1
          );
        } else if (currentBooking.status !== 'confirmed' && targetStatus === 'confirmed') {
          services[serviceIndex].activeBookingsCount =
            (services[serviceIndex].activeBookingsCount || 0) + 1;
        }
        saveStoredServices(services);
      }
    }

    const updatedBooking: Booking = {
      ...currentBooking,
      customerName: dto.customerName !== undefined ? dto.customerName.trim() : currentBooking.customerName,
      customerEmail: dto.customerEmail !== undefined ? dto.customerEmail.trim() : currentBooking.customerEmail,
      customerPhone: dto.customerPhone !== undefined ? dto.customerPhone.trim() : currentBooking.customerPhone,
      scheduledDate: targetDate,
      startTime: targetStartTime,
      endTime: updatedEndTime,
      status: targetStatus,
      notes: dto.notes !== undefined ? dto.notes.trim() : currentBooking.notes,
      updatedAt: new Date().toISOString(),
    };

    bookings[index] = updatedBooking;
    saveStoredBookings(bookings);

    return { data: updatedBooking };
  });
};

// 11. DELETE /api/v1/bookings/{booking_id}
export const mockDeleteBooking = async (bookingId: string): Promise<void> => {
  return executeRequest(async () => {
    const bookings = getStoredBookings();
    const booking = bookings.find((b) => b.id === bookingId);

    if (!booking) {
      throw new ApiError(404, {
        code: 'NOT_FOUND',
        message: `Booking with ID '${bookingId}' not found.`,
      });
    }

    // Decrement active booking count if confirmed
    if (booking.status === 'confirmed') {
      const services = getStoredServices();
      const serviceIndex = services.findIndex((s) => s.id === booking.serviceId);
      if (serviceIndex !== -1) {
        services[serviceIndex].activeBookingsCount = Math.max(
          0,
          (services[serviceIndex].activeBookingsCount || 1) - 1
        );
        saveStoredServices(services);
      }
    }

    const updatedBookings = bookings.filter((b) => b.id !== bookingId);
    saveStoredBookings(updatedBookings);
  });
};
