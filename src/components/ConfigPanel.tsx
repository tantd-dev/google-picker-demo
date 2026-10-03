import React from 'react';
import type { PickerConfig, ViewType } from '../types/google-picker';
import { VIEW_TYPE_LABELS } from '../types/google-picker';

interface ConfigPanelProps {
  config: PickerConfig;
  onChange: (config: PickerConfig) => void;
}

const VIEW_TYPES: ViewType[] = ['all', 'docs', 'sheets', 'slides', 'images', 'pdfs'];

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  const update = (field: keyof PickerConfig, value: string | boolean) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <section className="panel" id="config-panel">
      <h2 className="panel-title">
        <span className="panel-icon">⚙️</span> Configuration
      </h2>
      <div className="config-grid">
        <div className="form-group">
          <label htmlFor="api-key" className="form-label">
            Google API Key
            <span className="form-hint">From Google Cloud Console → Credentials</span>
          </label>
          <input
            id="api-key"
            type="password"
            className="form-input"
            placeholder="AIza..."
            value={config.apiKey}
            onChange={(e) => update('apiKey', e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="client-id" className="form-label">
            OAuth Client ID
            <span className="form-hint">Web application OAuth 2.0 Client ID</span>
          </label>
          <input
            id="client-id"
            type="password"
            className="form-input"
            placeholder="123...apps.googleusercontent.com"
            value={config.clientId}
            onChange={(e) => update('clientId', e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="app-id" className="form-label">
            App ID / Project Number
            <span className="form-hint">Google Cloud Project Number (not Project ID)</span>
          </label>
          <input
            id="app-id"
            type="text"
            className="form-input"
            placeholder="123456789012"
            value={config.appId}
            onChange={(e) => update('appId', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="scope" className="form-label">
            OAuth Scope
            <span className="form-hint">Space-separated list of OAuth scopes</span>
          </label>
          <input
            id="scope"
            type="text"
            className="form-input"
            placeholder="https://www.googleapis.com/auth/drive.readonly"
            value={config.scope}
            onChange={(e) => update('scope', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="view-type" className="form-label">
            Picker View
            <span className="form-hint">Filter file types shown in the picker</span>
          </label>
          <select
            id="view-type"
            className="form-select"
            value={config.viewType}
            onChange={(e) => update('viewType', e.target.value as ViewType)}
          >
            {VIEW_TYPES.map((vt) => (
              <option key={vt} value={vt}>
                {VIEW_TYPE_LABELS[vt]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group form-group--checkbox">
          <label htmlFor="multiselect" className="form-label form-label--inline">
            <input
              id="multiselect"
              type="checkbox"
              className="form-checkbox"
              checked={config.multiselect}
              onChange={(e) => update('multiselect', e.target.checked)}
            />
            Allow Multiple File Selection
          </label>
        </div>
      </div>

      <div className="config-status">
        <span className={`config-badge ${config.apiKey ? 'config-badge--ok' : 'config-badge--missing'}`}>
          {config.apiKey ? '✓ API Key' : '✗ API Key missing'}
        </span>
        <span className={`config-badge ${config.clientId ? 'config-badge--ok' : 'config-badge--missing'}`}>
          {config.clientId ? '✓ Client ID' : '✗ Client ID missing'}
        </span>
        <span className={`config-badge ${config.appId ? 'config-badge--ok' : 'config-badge--missing'}`}>
          {config.appId ? '✓ App ID' : '✗ App ID missing'}
        </span>
      </div>
    </section>
  );
};
