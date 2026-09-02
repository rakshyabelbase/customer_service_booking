import { screen } from '@testing-library/react';
import { serviceApi } from '../../../api/services/serviceApi';
import { ApiError } from '../../../types';
import { mockServices } from '../../../test-utils/fixtures/bookingFixtures';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { ServiceListPage } from './ServiceListPage';

jest.mock('../../../api/services/serviceApi', () => ({
  serviceApi: {
    getServices: jest.fn(),
    createService: jest.fn(),
    updateService: jest.fn(),
    deleteService: jest.fn(),
    getAvailability: jest.fn(),
  },
}));

const mockedServiceApi = serviceApi as jest.Mocked<typeof serviceApi>;

describe('Service list', () => {
  it('renders every service returned by the API', async () => {
    mockedServiceApi.getServices.mockResolvedValue({ data: mockServices, meta: { total: 2 } });

    renderWithProviders(<ServiceListPage />);

    expect(await screen.findByRole('heading', { name: mockServices[0].name })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: mockServices[1].name })).toBeInTheDocument();
  });

  it('shows the API error state when loading services fails', async () => {
    mockedServiceApi.getServices.mockRejectedValue(
      new ApiError(503, { code: 'INTERNAL_SERVER_ERROR', message: 'Service directory is unavailable.' }),
    );

    renderWithProviders(<ServiceListPage />);

    expect(
      await screen.findByText('Service directory is unavailable.', {}, { timeout: 3_000 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry request/i })).toBeInTheDocument();
  });
});
