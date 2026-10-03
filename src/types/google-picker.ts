// Google Picker type definitions
// Note: google.picker types are available globally via @types/google.picker

export interface PickerConfig {
  apiKey: string;
  clientId: string;
  appId: string;
  scope: string;
  viewType: ViewType;
  multiselect: boolean;
}

export type ViewType =
  | 'all'
  | 'docs'
  | 'sheets'
  | 'slides'
  | 'images'
  | 'pdfs';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  url?: string;
  description?: string;
  sizeBytes?: number;
  [key: string]: unknown;
}

export type LogLevel = 'INFO' | 'SUCCESS' | 'ERROR' | 'WARN';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
}

export type AuthStatus = 'idle' | 'authenticated' | 'error';

export interface AppState {
  config: PickerConfig;
  authStatus: AuthStatus;
  authError: string | null;
  selectedFiles: DriveFile[];
  rawResponse: unknown | null;
  logs: LogEntry[];
  pickerVisible: boolean;
}

// View type to MIME type mappings
export const VIEW_TYPE_MIME_TYPES: Record<ViewType, string> = {
  all: '',
  docs: 'application/vnd.google-apps.document',
  sheets: 'application/vnd.google-apps.spreadsheet',
  slides: 'application/vnd.google-apps.presentation',
  images: 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml',
  pdfs: 'application/pdf',
};

export const VIEW_TYPE_LABELS: Record<ViewType, string> = {
  all: 'All Files',
  docs: 'Google Docs',
  sheets: 'Google Sheets',
  slides: 'Google Slides',
  images: 'Images',
  pdfs: 'PDFs',
};
