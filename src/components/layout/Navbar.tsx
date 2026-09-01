import { Wrench, RefreshCw, Sliders, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

type NavbarProps = {
  isFetching?: boolean;
  onToggleDevToolbar: () => void;
  devToolbarOpen: boolean;
};

export function Navbar({
  isFetching,
  onToggleDevToolbar,
  devToolbarOpen,
}: NavbarProps) {
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
              <span className="brand-subtitle">Service Booking & CRUD System</span>
            </div>
          </div>
        </Link>

        <div className="navbar-actions">
          {isFetching && (
            <div className="fetching-indicator" title="TanStack Query is fetching in background">
              <RefreshCw size={14} className="spin-icon" />
              <span>Syncing data...</span>
            </div>
          )}

          <div className="nav-badge">
            <CalendarCheck size={14} />
            <span>TanStack Query v5</span>
          </div>

          <button
            type="button"
            className={`btn-dev-toggle ${devToolbarOpen ? 'active' : ''}`}
            onClick={onToggleDevToolbar}
            title="Toggle Developer & Network Error Simulation Panel"
          >
            <Sliders size={16} />
            <span>Dev Simulation</span>
          </button>
        </div>
      </div>
    </header>
  );
}
