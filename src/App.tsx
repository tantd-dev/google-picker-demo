import { useState, useCallback } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { AuthStatusPanel } from './components/AuthStatus';
import { PickerControls } from './components/PickerControls';
import { SelectedFilesTable } from './components/SelectedFilesTable';
import { JsonViewer } from './components/JsonViewer';
import { DebugConsole } from './components/DebugConsole';
import type {
  PickerConfig,
  DriveFile,
  LogEntry,
  LogLevel,
} from './types/google-picker';
import type { AuthStatus as AuthStatusType } from './types/google-picker';
import { createLogEntry } from './utils/logger';
import './styles.css';

const DEFAULT_CONFIG: PickerConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY ?? '',
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
  appId: import.meta.env.VITE_GOOGLE_APP_ID ?? '',
  scope: import.meta.env.VITE_GOOGLE_SCOPE ?? 'https://www.googleapis.com/auth/drive.readonly',
  viewType: 'all',
  multiselect: false,
};

function App() {
  const [config, setConfig] = useState<PickerConfig>(DEFAULT_CONFIG);
  const [authStatus, setAuthStatus] = useState<AuthStatusType>('idle');
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<DriveFile[]>([]);
  const [rawResponse, setRawResponse] = useState<unknown>(null);
  const [logs, setLogs] = useState<LogEntry[]>([
    createLogEntry(
      'INFO',
      DEFAULT_CONFIG.apiKey && DEFAULT_CONFIG.clientId && DEFAULT_CONFIG.appId
        ? 'Đã nạp thông tin cấu hình từ file .env thành công.'
        : 'Cảnh báo: Chưa tìm thấy đầy đủ biến môi trường trong file .env.'
    ),
  ]);
  const [detailFile, setDetailFile] = useState<DriveFile | null>(null);

  const addLog = useCallback((level: LogLevel, message: string) => {
    setLogs((prev) => [...prev, createLogEntry(level, message)]);
  }, []);

  const handleConfigChange = useCallback((newConfig: PickerConfig) => {
    setConfig(newConfig);
  }, []);

  const handleFilesPicked = useCallback(
    (files: DriveFile[], raw: unknown) => {
      setSelectedFiles(files);
      setRawResponse(raw);
      setDetailFile(null);
    },
    []
  );

  const handlePickerCancel = useCallback(() => {
    // picker was cancelled by user
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setAuthStatus('authenticated');
    setAuthError(null);
  }, []);

  const handleAuthError = useCallback((msg: string) => {
    setAuthStatus('error');
    setAuthError(msg);
  }, []);

  return (
    <div className="app">
      <header className="app-header" id="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <img
              src="https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png"
              alt="Google Drive"
              className="header-drive-icon"
              width={36}
              height={36}
            />
          </div>
          <div>
            <h1 className="header-title">Google Drive Picker Playground</h1>
            <p className="header-subtitle">
              Sử dụng cấu hình từ file <code>.env</code> · Thư viện <code>@googleworkspace/drive-picker-react</code>
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="layout">
          {/* Left column */}
          <div className="layout-left">
            <PickerControls
              config={config}
              authStatus={authStatus}
              onFilesPicked={handleFilesPicked}
              onPickerCancel={handlePickerCancel}
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
              onLog={addLog}
            />
            <ConfigPanel config={config} onChange={handleConfigChange} />
            <AuthStatusPanel status={authStatus} error={authError} />
          </div>

          {/* Right column */}
          <div className="layout-right">
            <SelectedFilesTable
              files={selectedFiles}
              onViewDetail={(file) => setDetailFile(file)}
            />
            <JsonViewer
              data={detailFile ?? rawResponse}
              title={detailFile ? `Chi tiết tệp: ${detailFile.name}` : 'Dữ liệu phản hồi gốc (Raw JSON)'}
              onClose={detailFile ? () => setDetailFile(null) : undefined}
            />
            <DebugConsole logs={logs} onClear={() => setLogs([])} />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Google Drive Picker API Demo — Không lưu trữ hoặc gửi thông tin đăng nhập lên bất kỳ máy chủ nào.
        </p>
      </footer>
    </div>
  );
}

export default App;
