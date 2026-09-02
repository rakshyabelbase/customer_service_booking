import { Wrench, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="app-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand-link">
          <div className="navbar-brand">
            <div className="brand-icon-wrapper">
              <Wrench size={22} className="brand-icon" />
            </div>

            <div className="brand-text">
              <span className="brand-title">ServiCraft</span>
              <span className="brand-subtitle">
                Service Booking  System
              </span>
            </div>
          </div>
        </Link>

        <div className="navbar-actions">
          <Link
            to="/bookings"
            className="btn-secondary-sm flex-align"
          >
            <CalendarCheck size={16} />
            <span>My Bookings</span>
          </Link>
        </div>
      </div>
    </header>
  );
}