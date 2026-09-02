import { AlertTriangle, Circle } from 'lucide-react';
import { useAvailabilityQuery } from '../../features/services/hooks/useAvailability';
import { getLocalDateString } from '../../utils/date';

type TodayAvailabilityPillProps = {
  serviceId: string;
  onClick: () => void;
};

export function TodayAvailabilityPill({ serviceId, onClick }: TodayAvailabilityPillProps) {
  const today = getLocalDateString();
  const availabilityQuery = useAvailabilityQuery(serviceId, today);

  if (availabilityQuery.isLoading) {
    return <span className="meta-pill availability-pill-skeleton" aria-label="Loading today's availability" />;
  }

  if (availabilityQuery.isError) {
    return (
      <button type="button" className="meta-pill availability-pill availability-pill-warning" onClick={onClick} aria-label="View today's availability and book" title="View today's availability and book">
        <AlertTriangle size={13} />
        <span>Availability unavailable</span>
      </button>
    );
  }

  const slots = availabilityQuery.data?.data.slots || [];
  const availableSlotsToday = slots.filter((slot) => slot.available).length;
  const totalSlotsToday = slots.length;

  let label = 'No slots scheduled today';
  let stateClass = 'availability-pill-neutral';
  if (availableSlotsToday > 0) {
    label = `${availableSlotsToday} ${availableSlotsToday === 1 ? 'slot' : 'slots'} available today`;
    stateClass = 'availability-pill-success';
  } else if (totalSlotsToday > 0) {
    label = 'Fully booked today';
    stateClass = 'availability-pill-danger';
  }

  return (
    <button type="button" className={`meta-pill availability-pill ${stateClass}`} onClick={onClick} aria-label="View today's availability and book" title="View today's availability and book">
      <Circle size={9} fill="currentColor" />
      <span>{label}</span>
    </button>
  );
}
