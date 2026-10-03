import React, { useRef, useEffect } from 'react';
import { DrivePicker, DrivePickerDocsView } from '@googleworkspace/drive-picker-react';
import type { PickerConfig, DriveFile, AuthStatus } from '../types/google-picker';
import { VIEW_TYPE_MIME_TYPES, VIEW_TYPE_LABELS } from '../types/google-picker';
import type {
  PickerPickedEvent,
  PickerCanceledEvent,
  OAuthErrorEvent,
  OAuthResponseEvent,
} from '@googleworkspace/drive-picker-element';

interface PickerControlsProps {
  config: PickerConfig;
  authStatus: AuthStatus;
  pickerVisible: boolean;
  onPickerVisibleChange: (visible: boolean) => void;
  onFilesPicked: (files: DriveFile[], raw: unknown) => void;
  onPickerCancel: () => void;
  onAuthSuccess: () => void;
  onAuthError: (msg: string) => void;
  onLog: (level: 'INFO' | 'SUCCESS' | 'ERROR', msg: string) => void;
}

export const PickerControls: React.FC<PickerControlsProps> = ({
  config,
  authStatus,
  pickerVisible,
  onPickerVisibleChange,
  onFilesPicked,
  onPickerCancel,
  onAuthSuccess,
  onAuthError,
  onLog,
}) => {
  // DrivePicker does not forward refs, so we use a wrapper div to find the underlying element
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isConfigValid = Boolean(config.apiKey && config.clientId && config.appId);

  // Control the picker visibility via the underlying drive-picker web component's `visible` property
  useEffect(() => {
    if (!wrapperRef.current) return;
    type PickerEl = HTMLElement & { visible: boolean };
    const el = wrapperRef.current.querySelector('drive-picker') as PickerEl | null;
    if (el) {
      el.visible = pickerVisible;
    }
  }, [pickerVisible]);

  const handleOpen = () => {
    if (!config.apiKey) {
      onLog('ERROR', 'Missing API Key. Please fill in the Configuration panel.');
      return;
    }
    if (!config.clientId) {
      onLog('ERROR', 'Missing OAuth Client ID. Please fill in the Configuration panel.');
      return;
    }
    if (!config.appId) {
      onLog('ERROR', 'Missing App ID / Project Number. Please fill in the Configuration panel.');
      return;
    }
    onLog('INFO', 'Opening Google Drive Picker...');
    onPickerVisibleChange(true);
  };

  const handlePicked = (e: PickerPickedEvent) => {
    // Use string keys — the picker ResponseObject uses 'docs' for the document array
    const response = e.detail as Record<string, unknown>;
    const docs = (response['docs'] ?? []) as Record<string, unknown>[];

    const files: DriveFile[] = docs.map((raw) => ({
      id: String(raw['id'] ?? ''),
      name: String(raw['name'] ?? 'Unnamed'),
      mimeType: String(raw['mimeType'] ?? ''),
      url: String(raw['url'] ?? raw['embedUrl'] ?? ''),
      description: String(raw['description'] ?? ''),
      ...raw,
    }));

    onLog('SUCCESS', `Picker: ${files.length} file(s) selected — ${files.map((f) => f.name).join(', ')}`);
    onFilesPicked(files, response);
    onPickerVisibleChange(false);
  };

  const handleCanceled = (_e: PickerCanceledEvent) => {
    onLog('INFO', 'Picker: User cancelled without selecting a file.');
    onPickerCancel();
    onPickerVisibleChange(false);
  };

  const handleOauthResponse = (_e: OAuthResponseEvent) => {
    onLog('SUCCESS', 'OAuth: Access token obtained successfully.');
    onAuthSuccess();
  };

  const handleOauthError = (e: OAuthErrorEvent) => {
    const detail = e.detail as { error?: string; error_description?: string; message?: string };
    const msg =
      detail?.error_description ??
      detail?.error ??
      detail?.message ??
      'Unknown OAuth error';
    onLog('ERROR', `OAuth error: ${msg}`);
    onAuthError(msg);
    onPickerVisibleChange(false);
  };

  const mimeTypes = VIEW_TYPE_MIME_TYPES[config.viewType];

  return (
    <section className="panel" id="picker-controls-panel">
      <h2 className="panel-title">
        <span className="panel-icon">📂</span> Picker Controls
      </h2>

      <div className="picker-controls-row">
        <button
          id="open-picker-btn"
          className="btn btn-primary"
          onClick={handleOpen}
          disabled={!isConfigValid}
          title={!isConfigValid ? 'Fill in all required credentials first' : 'Open Google Drive Picker'}
        >
          <span className="btn-icon">🗂️</span>
          Open Google Drive Picker
        </button>

        {!isConfigValid && (
          <p className="picker-hint">
            ⚠️ Fill in API Key, Client ID, and App ID in the Configuration panel before opening the picker.
          </p>
        )}

        {isConfigValid && (
          <p className="picker-hint picker-hint--ready">
            ✓ Ready — View: <strong>{VIEW_TYPE_LABELS[config.viewType]}</strong>
            {config.multiselect ? ' · Multi-select enabled' : ''}
          </p>
        )}
      </div>

      {/* DrivePicker: always mounted when config is valid; visibility is set imperatively via DOM */}
      {isConfigValid && (
        <div ref={wrapperRef} style={{ display: 'none' }}>
          <DrivePicker
            developer-key={config.apiKey}
            client-id={config.clientId}
            app-id={config.appId}
            scope={config.scope}
            multiselect={config.multiselect}
            onPicked={handlePicked}
            onCanceled={handleCanceled}
            onOauthResponse={handleOauthResponse}
            onOauthError={handleOauthError}
          >
            <DrivePickerDocsView
              mime-types={mimeTypes || undefined}
              enable-drives="true"
            />
          </DrivePicker>
        </div>
      )}

      {authStatus === 'authenticated' && (
        <div className="auth-badge">
          <span>🔑</span> OAuth token active
        </div>
      )}
    </section>
  );
};
