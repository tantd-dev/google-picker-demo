import React from 'react';
import type { PickerConfig, ViewType } from '../types/google-picker';
import { VIEW_TYPE_LABELS } from '../types/google-picker';

interface ConfigPanelProps {
  config: PickerConfig;
  onChange: (config: PickerConfig) => void;
}

const VIEW_TYPES: ViewType[] = ['all', 'docs', 'sheets', 'slides', 'images', 'pdfs'];

// function maskString(str: string, keepStart = 8, keepEnd = 4): string {
//   if (!str) return '—';
//   if (str.length <= keepStart + keepEnd) return str;
//   return `${str.substring(0, keepStart)}••••••••${str.substring(str.length - keepEnd)}`;
// }

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  // const [showOverride, setShowOverride] = useState(false);
  // const [showFullKeys, setShowFullKeys] = useState(false);

  const update = (field: keyof PickerConfig, value: string | boolean) => {
    onChange({ ...config, [field]: value });
  };

  // const handleResetToEnv = () => {
  //   onChange({
  //     apiKey: import.meta.env.VITE_GOOGLE_API_KEY ?? '',
  //     clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
  //     appId: import.meta.env.VITE_GOOGLE_APP_ID ?? '',
  //     scope: import.meta.env.VITE_GOOGLE_SCOPE ?? 'https://www.googleapis.com/auth/drive.readonly',
  //     viewType: config.viewType,
  //     multiselect: config.multiselect,
  //   });
  // };

  // const isKeyConfigured = Boolean(config.apiKey);
  // const isClientConfigured = Boolean(config.clientId);
  // const isAppIdConfigured = Boolean(config.appId);

  return (
    <section className="panel" id="config-panel">
      {/* <div className="panel-header-row">
        <h2 className="panel-title" style={{ margin: 0, border: 'none', padding: 0 }}>
          <span className="panel-icon">⚙️</span> Cấu hình Google API (.env)
        </h2>
        <span className="env-tag">.env</span>
      </div> */}

      {/* <div className="env-status-card">
        ...
      </div> */}

      <div className="config-grid" style={{ marginTop: '14px' }}>
        <div className="form-group">
          <label htmlFor="view-type" className="form-label">
            Chế độ xem (View Filter)
            <span className="form-hint">
              Lọc loại tệp hiển thị trong Google Picker
            </span>
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
          <label className="form-label form-label--inline">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={true}
              disabled
            />
            Cho phép chọn nhiều file cùng lúc (Multi-select)
          </label>
        </div>
      </div>

      {/* Collapsible advanced manual override */}
      {/* <div className="override-accordion">
        <button
          type="button"
          className="override-toggle-btn"
          onClick={() => setShowOverride(!showOverride)}
        >
          <span>{showOverride ? '▼' : '►'} Chỉnh sửa thủ công (nếu không dùng .env)</span>
        </button>

        {showOverride && (
          <div className="override-content">
            <div className="form-group">
              <label htmlFor="manual-api-key" className="form-label">
                API Key
              </label>
              <input
                id="manual-api-key"
                type="text"
                className="form-input"
                value={config.apiKey}
                onChange={(e) => update('apiKey', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="manual-client-id" className="form-label">
                OAuth Client ID
              </label>
              <input
                id="manual-client-id"
                type="text"
                className="form-input"
                value={config.clientId}
                onChange={(e) => update('clientId', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="manual-app-id" className="form-label">
                App ID / Project Number
              </label>
              <input
                id="manual-app-id"
                type="text"
                className="form-input"
                value={config.appId}
                onChange={(e) => update('appId', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="manual-scope" className="form-label">
                OAuth Scope
              </label>
              <input
                id="manual-scope"
                type="text"
                className="form-input"
                value={config.scope}
                onChange={(e) => update('scope', e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn-sm btn-secondary"
              style={{ marginTop: '6px' }}
              onClick={handleResetToEnv}
            >
              🔄 Khôi phục lại từ file .env
            </button>
          </div>
        )}
      </div> */}
    </section>
  );
};