import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { serviceApi } from '../../../api/services/serviceApi';
import { bookingApi } from '../../../api/services/bookingApi';
import { mockAvailability, mockServices } from '../../../test-utils/fixtures/bookingFixtures';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { ServiceDetailPage } from './ServiceDetailPage';

jest.mock('../../../api/services/serviceApi', () => ({ serviceApi: {
  getServiceById: jest.fn(), getAvailability: jest.fn(), updateService: jest.fn(), deleteService: jest.fn(),
} }));
jest.mock('../../../api/services/bookingApi', () => ({ bookingApi: {
  getBookings: jest.fn(), createBooking: jest.fn(), updateBooking: jest.fn(), deleteBooking: jest.fn(), getBookingById: jest.fn(),
} }));

const mockedServiceApi = serviceApi as jest.Mocked<typeof serviceApi>;
const mockedBookingApi = bookingApi as jest.Mocked<typeof bookingApi>;

describe('Service details', () => {
  it('renders the data for the service selected by the route id', async () => {
    mockedServiceApi.getServiceById.mockResolvedValue({ data: mockServices[0] });
    mockedServiceApi.getAvailability.mockResolvedValue({ data: mockAvailability });
    mockedBookingApi.getBookings.mockResolvedValue({ data: [], meta: { total: 0 } });

    renderWithProviders(
      <Routes><Route path="/services/:serviceId" element={<ServiceDetailPage />} /></Routes>,
      `/services/${mockServices[0].id}`,
    );

    expect(await screen.findByRole('heading', { name: mockServices[0].name })).toBeInTheDocument();
    expect(screen.getByText(mockServices[0].description)).toBeInTheDocument();
    expect(screen.getByText(mockServices[0].provider.name)).toBeInTheDocument();
    expect(mockedServiceApi.getServiceById).toHaveBeenCalledWith(mockServices[0].id);
  });
});
