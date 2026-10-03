import React from 'react';
import type { AuthStatus } from '../types/google-picker';

interface AuthStatusPanelProps {
  status: AuthStatus;
  error: string | null;
}

type StatusConfig = { icon: string; label: string; className: string };

const STATUS_CONFIG: Record<AuthStatus, StatusConfig> = {
  idle: { icon: '○', label: 'Not authenticated', className: 'auth-status--idle' },
  authenticated: { icon: '●', label: 'Authenticated', className: 'auth-status--ok' },
  error: { icon: '✕', label: 'Authentication error', className: 'auth-status--error' },
};

export const AuthStatusPanel: React.FC<AuthStatusPanelProps> = ({ status, error }) => {
  const cfg = STATUS_CONFIG[status];

  return (
    <section className="panel" id="auth-status-panel">
      <h2 className="panel-title">
        <span className="panel-icon">🔐</span> Authentication Status
      </h2>
      <div className={`auth-status ${cfg.className}`}>
        <span className="auth-status-icon">{cfg.icon}</span>
        <span className="auth-status-label">{cfg.label}</span>
      </div>
      {status === 'idle' && (
        <p className="auth-hint">
          Authentication is handled automatically by the Google Drive Picker when you open it.
          Click <strong>"Open Google Drive Picker"</strong> to begin the OAuth flow.
        </p>
      )}
      {status === 'authenticated' && (
        <p className="auth-hint auth-hint--success">
          ✓ OAuth token obtained. The picker is ready to use.
        </p>
      )}
      {status === 'error' && error && (
        <div className="auth-error">
          <strong>Error:</strong> {error}
          <p className="auth-error-hint">
            Check that your Client ID is correct and that your domain is listed in Authorized JavaScript Origins.
          </p>
        </div>
      )}
    </section>
  );
};
