import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { serviceApi } from '../../../api/services/serviceApi';
import { bookingApi } from '../../../api/services/bookingApi';
import { ApiError } from '../../../types';
import { mockAvailability, mockConfirmedBooking, mockServices } from '../../../test-utils/fixtures/bookingFixtures';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { BookingModal } from './BookingModal';

jest.mock('../../../api/services/serviceApi', () => ({ serviceApi: { getAvailability: jest.fn() } }));
jest.mock('../../../api/services/bookingApi', () => ({ bookingApi: { createBooking: jest.fn(), updateBooking: jest.fn() } }));

const mockedServiceApi = serviceApi as jest.Mocked<typeof serviceApi>;
const mockedBookingApi = bookingApi as jest.Mocked<typeof bookingApi>;

async function renderReadyBookingModal() {
  mockedServiceApi.getAvailability.mockResolvedValue({ data: mockAvailability });
  const user = userEvent.setup();
  renderWithProviders(<BookingModal isOpen service={mockServices[0]} onClose={jest.fn()} />);
  await user.click(await screen.findByRole('button', { name: /10:00 - 12:00/i }));
  return user;
}

describe('Booking validation', () => {
  it('blocks invalid input and displays field-level validation messages', async () => {
    const user = await renderReadyBookingModal();
    await user.clear(screen.getByPlaceholderText('e.g. Aarav Sharma'));
    await user.clear(screen.getByPlaceholderText('e.g. customer@example.com'));

    await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));

    expect(await screen.findByText('Customer name is required.')).toBeInTheDocument();
    expect(screen.getByText('Customer email is required.')).toBeInTheDocument();
    expect(screen.getByText('Enter a complete service address (at least 8 characters).')).toBeInTheDocument();
    expect(mockedBookingApi.createBooking).not.toHaveBeenCalled();
  });
});

describe('Booking submission', () => {
  it('shows a confirmation after a valid booking succeeds', async () => {
    const user = await renderReadyBookingModal();
    mockedBookingApi.createBooking.mockResolvedValue({ data: mockConfirmedBooking });
    await user.type(screen.getByPlaceholderText('Street, area, city and postal code'), mockConfirmedBooking.serviceAddress);

    await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));

    expect(await screen.findByRole('heading', { name: 'Booking confirmed' })).toBeInTheDocument();
    expect(screen.getByText(mockConfirmedBooking.bookingNumber)).toBeInTheDocument();
  });

  it('keeps the form open and explains a slot conflict', async () => {
    const user = await renderReadyBookingModal();
    mockedBookingApi.createBooking.mockRejectedValue(
      new ApiError(409, { code: 'SLOT_UNAVAILABLE', message: 'That time slot was just booked.' }),
    );
    await user.type(screen.getByPlaceholderText('Street, area, city and postal code'), '14 Durbar Marg, Kathmandu');

    await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));

    expect(await screen.findByText(/that time slot was just booked/i)).toBeInTheDocument();
    await waitFor(() => expect(mockedServiceApi.getAvailability).toHaveBeenCalledTimes(2));
    expect(screen.getByRole('button', { name: 'Confirm Booking' })).toBeInTheDocument();
  });
});
