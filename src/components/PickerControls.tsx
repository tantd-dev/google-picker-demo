import React, { useState } from 'react';
import '@googleworkspace/drive-picker-element';
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
  onFilesPicked: (files: DriveFile[], raw: unknown) => void;
  onPickerCancel: () => void;
  onAuthSuccess: () => void;
  onAuthError: (msg: string) => void;
  onLog: (level: 'INFO' | 'SUCCESS' | 'ERROR', msg: string) => void;
}

export const PickerControls: React.FC<PickerControlsProps> = ({
  config,
  authStatus,
  onFilesPicked,
  onPickerCancel,
  onAuthSuccess,
  onAuthError,
  onLog,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cachedToken, setCachedToken] = useState<string | null>(null);

  const isConfigValid = Boolean(config.apiKey && config.clientId && config.appId);

  const handleOpen = () => {
    if (!config.apiKey) {
      onLog('ERROR', 'Thiếu VITE_GOOGLE_API_KEY trong file .env');
      return;
    }
    if (!config.clientId) {
      onLog('ERROR', 'Thiếu VITE_GOOGLE_CLIENT_ID trong file .env');
      return;
    }
    if (!config.appId) {
      onLog('ERROR', 'Thiếu VITE_GOOGLE_APP_ID trong file .env');
      return;
    }

    onLog('INFO', 'Đang mở Google Driver...');
    setIsOpen(true);
  };

  const handleCancelOpening = () => {
    setIsOpen(false);
    onLog('INFO', 'Đã hủy mở Google Drive Picker.');
  };

  const handlePicked = (e: PickerPickedEvent) => {
    const response = e.detail as Record<string, unknown>;
    const docs = (response['docs'] ?? []) as Record<string, unknown>[];

    const files: DriveFile[] = docs.map((raw) => ({
      id: String(raw['id'] ?? ''),
      name: String(raw['name'] ?? 'Unnamed'),
      mimeType: String(raw['mimeType'] ?? ''),
      url: String(raw['url'] ?? raw['embedUrl'] ?? ''),
      description: String(raw['description'] ?? ''),
      sizeBytes: typeof raw['sizeBytes'] === 'number' ? raw['sizeBytes'] : undefined,
      ...raw,
    }));

    onLog('SUCCESS', `Google Drive: Đã chọn ${files.length} tệp — ${files.map((f) => f.name).join(', ')}`);
    onFilesPicked(files, response);
    setIsOpen(false);
  };

  const handleCanceled = (_e: PickerCanceledEvent) => {
    onLog('INFO', 'Google Drive: Người dùng đã đóng hoặc hủy chọn tệp.');
    onPickerCancel();
    setIsOpen(false);
  };

  const handleOauthResponse = (e: OAuthResponseEvent) => {
    const detail = e.detail as { access_token?: string };
    if (detail?.access_token) {
      setCachedToken(detail.access_token);
    }
    onLog('SUCCESS', 'OAuth: Xác thực tài khoản Google thành công.');
    onAuthSuccess();
  };

  const handleOauthError = (e: OAuthErrorEvent) => {
    const detail = e.detail as { error?: string; error_description?: string; message?: string };
    const msg =
      detail?.error_description ??
      detail?.error ??
      detail?.message ??
      'Lỗi xác thực OAuth từ Google';
    onLog('ERROR', `Lỗi OAuth: ${msg}`);
    setCachedToken(null);
    onAuthError(msg);
    setIsOpen(false);
  };

  const mimeTypes = VIEW_TYPE_MIME_TYPES[config.viewType];

  return (
    <section className="panel" id="picker-controls-panel">
      <h2 className="panel-title">
        <span className="panel-icon">📂</span> Thao tác Picker
      </h2>

      <div className="picker-controls-row">
        <button
          id="open-picker-btn"
          className="btn btn-primary btn-drive-open"
          onClick={handleOpen}
          disabled={!isConfigValid || isOpen}
          title={!isConfigValid ? 'Cần cấu hình đầy đủ trong file .env trước' : 'Mở Google Driver'}
        >
          {isOpen ? (
            <>
              <span className="spinner-icon" />
              <span>Đang mở Google Driver...</span>
            </>
          ) : (
            <>
              <svg className="drive-btn-logo" viewBox="0 0 87.3 78" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
              <span>Mở Google Driver</span>
            </>
          )}
        </button>

        {isOpen && (
          <div className="picker-opening-banner">
            <span className="banner-text">
              ⏳ Cửa sổ Google Drive Picker đang được kích hoạt. Hãy chọn tài khoản và cấp quyền nếu được hỏi.
            </span>
            <button
              type="button"
              className="btn-sm btn-ghost"
              onClick={handleCancelOpening}
              title="Đóng tiến trình nếu bị treo"
            >
              Hủy
            </button>
          </div>
        )}

        {!isConfigValid && (
          <p className="picker-hint picker-hint--warning">
            ⚠️ Hãy kiểm tra file <code>.env</code>: cần có <code>VITE_GOOGLE_API_KEY</code>, <code>VITE_GOOGLE_CLIENT_ID</code>, và <code>VITE_GOOGLE_APP_ID</code>.
          </p>
        )}

        {isConfigValid && !isOpen && (
          <p className="picker-hint picker-hint--ready">
            ✓ Sẵn sàng mở · Chế độ xem: <strong>{VIEW_TYPE_LABELS[config.viewType]}</strong>
            {config.multiselect ? ' · Chọn nhiều file' : ''}
          </p>
        )}
      </div>

      {/* Render DrivePicker on demand when user clicks 'Mở Google Driver' */}
      {isConfigValid && isOpen && (
        <div style={{ display: 'none' }}>
          <DrivePicker
            developer-key={config.apiKey}
            client-id={config.clientId}
            app-id={config.appId}
            scope={config.scope}
            multiselect={config.multiselect}
            oauth-token={cachedToken || undefined}
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
          <span>🔑</span> Token OAuth đang hoạt động
        </div>
      )}
    </section>
  );
};
