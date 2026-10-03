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
    createLogEntry('INFO', 'Application initialized.'),
  ]);
  const [pickerVisible, setPickerVisible] = useState(false);
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
    // no-op; picker visible state is managed in PickerControls
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
              POC · Powered by <code>@googleworkspace/drive-picker-react</code> v0.2.0
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="layout">
          {/* Left column */}
          <div className="layout-left">
            <ConfigPanel config={config} onChange={handleConfigChange} />
            <AuthStatusPanel status={authStatus} error={authError} />
            <PickerControls
              config={config}
              authStatus={authStatus}
              pickerVisible={pickerVisible}
              onPickerVisibleChange={setPickerVisible}
              onFilesPicked={handleFilesPicked}
              onPickerCancel={handlePickerCancel}
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
              onLog={addLog}
            />
          </div>

          {/* Right column */}
          <div className="layout-right">
            <SelectedFilesTable
              files={selectedFiles}
              onViewDetail={(file) => setDetailFile(file)}
            />
            <JsonViewer
              data={detailFile ?? rawResponse}
              title={detailFile ? `File Detail: ${detailFile.name}` : 'Raw Picker Response'}
              onClose={detailFile ? () => setDetailFile(null) : undefined}
            />
            <DebugConsole logs={logs} onClear={() => setLogs([])} />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Google Drive Picker API Playground — POC · No credentials are stored or sent to any server.
        </p>
      </footer>
    </div>
  );
}

export default App;
