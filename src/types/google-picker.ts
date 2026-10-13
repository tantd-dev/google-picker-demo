// Google Picker type definitions
// Note: google.picker types are available globally via @types/google.picker

export type ViewMode = 'list' | 'grid';

export interface PickerConfig {
  apiKey: string;
  clientId: string;
  appId: string;
  scope: string;
  viewType: ViewType;
  viewMode: ViewMode;
  multiselect: boolean;
  selectFolderEnabled: boolean;
  includeSharedDrives: boolean;
  includeStarred: boolean;
  locale: string;
  title: string;
}

export type ViewType =
  | 'all'
  | 'folders'
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
  type?: string;
  isFolder?: boolean;
  iconUrl?: string;
  parentId?: string;
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
  folders: 'application/vnd.google-apps.folder',
  docs: 'application/vnd.google-apps.document',
  sheets: 'application/vnd.google-apps.spreadsheet',
  slides: 'application/vnd.google-apps.presentation',
  images: 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml',
  pdfs: 'application/pdf',
};

export const VIEW_TYPE_LABELS: Record<ViewType, string> = {
  all: 'Tất cả (Tệp & Thư mục)',
  folders: 'Chỉ thư mục (Folders only)',
  docs: 'Google Docs',
  sheets: 'Google Sheets',
  slides: 'Google Slides',
  images: 'Hình ảnh (Images)',
  pdfs: 'Tài liệu PDF',
};
