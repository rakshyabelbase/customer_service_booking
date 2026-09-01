import React, { useState } from 'react';
import { getHttpClientConfig, setHttpClientConfig } from '../../api/client/httpClient';
import { resetMockDatabase } from '../../api/mock/mockData';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './ToastContext';
import { AlertTriangle, Clock, RotateCcw, Check, X } from 'lucide-react';

interface DevToolbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevToolbar: React.FC<DevToolbarProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [config, setConfig] = useState(getHttpClientConfig());

  if (!isOpen) return null;

  const handleToggleServerError = () => {
    const nextVal = !config.forceServerError;
    setHttpClientConfig({ forceServerError: nextVal });
    setConfig((prev) => ({ ...prev, forceServerError: nextVal }));

    showToast({
      type: nextVal ? 'error' : 'info',
      title: nextVal ? '500 Error Injection ACTIVE' : '500 Error Injection DISABLED',
      message: nextVal
        ? 'All API calls will now fail with a 500 Internal Server Error. Test the UI Error & Retry states!'
        : 'API responses restored to normal operation.',
    });
  };

  const handleDelayChange = (ms: number) => {
    setHttpClientConfig({ simulatedDelayMs: ms });
    setConfig((prev) => ({ ...prev, simulatedDelayMs: ms }));
    showToast({
      type: 'info',
      title: 'Latency Set',
      message: `Simulated network delay set to ${ms}ms.`,
    });
  };

  const handleResetData = () => {
    resetMockDatabase();
    queryClient.invalidateQueries();
    showToast({
      type: 'success',
      title: 'Database Reset',
      message: 'Mock database has been restored to default initial services and bookings.',
    });
  };

  return (
    <div className="dev-toolbar-panel">
      <div className="dev-toolbar-header">
        <div className="dev-toolbar-title">
          <AlertTriangle size={18} className="text-amber" />
          <span>Mock API & Error Injection Dev Tools</span>
        </div>
        <button type="button" className="dev-close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="dev-toolbar-grid">
        {/* 500 Error Simulation Toggle */}
        <div className="dev-card">
          <div className="dev-card-label">Simulate Server Failure</div>
          <button
            type="button"
            className={`btn-dev-action ${config.forceServerError ? 'btn-danger-active' : ''}`}
            onClick={handleToggleServerError}
          >
            {config.forceServerError ? (
              <>
                <AlertTriangle size={16} />
                <span>500 ERROR IS ON (Click to Disable)</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Simulate HTTP 500 Error</span>
              </>
            )}
          </button>
          <div className="dev-card-hint">
            Forces all API requests to fail with HTTP 500 to test Error UI & Retry buttons.
          </div>
        </div>

        {/* Latency Selection */}
        <div className="dev-card">
          <div className="dev-card-label">Simulated Network Latency</div>
          <div className="latency-btn-group">
            {[300, 600, 1200, 2500].map((ms) => (
              <button
                key={ms}
                type="button"
                className={`btn-latency ${config.simulatedDelayMs === ms ? 'selected' : ''}`}
                onClick={() => handleDelayChange(ms)}
              >
                <Clock size={12} />
                <span>{ms}ms</span>
              </button>
            ))}
          </div>
          <div className="dev-card-hint">
            Simulates realistic async delay to test Skeleton loading states.
          </div>
        </div>

        {/* Reset Database */}
        <div className="dev-card">
          <div className="dev-card-label">Reset Mock State</div>
          <button type="button" className="btn-dev-reset" onClick={handleResetData}>
            <RotateCcw size={16} />
            <span>Reset Database to Default</span>
          </button>
          <div className="dev-card-hint">
            Restores original mock dataset and clears localStorage edits.
          </div>
        </div>
      </div>
    </div>
  );
};
