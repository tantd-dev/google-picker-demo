import React, { useState } from 'react';
import type { DriveFile } from '../types/google-picker';

interface SelectedFilesTableProps {
  files: DriveFile[];
  onViewDetail: (file: DriveFile) => void;
}

function getItemIcon(file: DriveFile): string {
  if (file.isFolder || file.mimeType === 'application/vnd.google-apps.folder') return '📁';
  if (file.mimeType.includes('document')) return '📝';
  if (file.mimeType.includes('spreadsheet')) return '📊';
  if (file.mimeType.includes('presentation')) return '📽️';
  if (file.mimeType.includes('pdf')) return '📕';
  if (file.mimeType.startsWith('image/')) return '🖼️';
  if (file.mimeType.startsWith('video/')) return '🎬';
  return '📄';
}

export const SelectedFilesTable: React.FC<SelectedFilesTableProps> = ({ files, onViewDetail }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // fallback
    }
  };

  const folderCount = files.filter(
    (f) => f.isFolder || f.mimeType === 'application/vnd.google-apps.folder'
  ).length;
  const fileCount = files.length - folderCount;

  if (files.length === 0) {
    return (
      <section className="panel" id="selected-files-panel">
        <h2 className="panel-title">
          <span className="panel-icon">📋</span> Mục đã chọn (Selected Items)
        </h2>
        <div className="empty-state">
          <span className="empty-icon">📁</span>
          <p>Chưa có tệp hoặc thư mục nào được chọn.</p>
          <p className="empty-state-sub">Mở Google Drive và tích chọn checkbox trên thư mục hoặc tệp trong My Drive.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel" id="selected-files-panel">
      <div className="panel-header-with-summary">
        <h2 className="panel-title" style={{ margin: 0 }}>
          <span className="panel-icon">📋</span> Mục đã chọn
          <span className="badge">{files.length}</span>
        </h2>
        <div className="selection-breakdown">
          {folderCount > 0 && (
            <span className="breakdown-pill breakdown-pill--folder">
              📁 {folderCount} thư mục
            </span>
          )}
          {fileCount > 0 && (
            <span className="breakdown-pill breakdown-pill--file">
              📄 {fileCount} tệp
            </span>
          )}
        </div>
      </div>

      <div className="table-wrapper" style={{ marginTop: '12px' }}>
        <table className="files-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên (Name)</th>
              <th>Phân loại</th>
              <th>Item ID</th>
              <th>MIME Type</th>
              <th>Đường dẫn</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, idx) => {
              const isFolder = Boolean(
                file.isFolder || file.mimeType === 'application/vnd.google-apps.folder'
              );
              const icon = getItemIcon(file);

              return (
                <tr key={file.id || idx} className={isFolder ? 'tr-folder' : 'tr-file'}>
                  <td className="td-num">{idx + 1}</td>
                  <td className="td-name" title={file.name}>
                    <div className="item-name-cell">
                      <span className="item-type-icon">{icon}</span>
                      <span className="item-name-text">{file.name}</span>
                    </div>
                  </td>
                  <td className="td-type">
                    {isFolder ? (
                      <span className="type-badge type-badge--folder">📁 Thư mục</span>
                    ) : (
                      <span className="type-badge type-badge--file">📄 Tệp</span>
                    )}
                  </td>
                  <td className="td-id">
                    <code className="code-id" title={file.id}>{file.id}</code>
                  </td>
                  <td className="td-mime">
                    <code className="code-mime">{file.mimeType}</code>
                  </td>
                  <td className="td-url">
                    {file.url ? (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-url"
                        title={file.url}
                      >
                        {isFolder ? 'Mở folder ↗' : 'Mở tệp ↗'}
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="td-actions">
                    <button
                      className="btn-sm btn-secondary"
                      title="Sao chép ID"
                      onClick={() => copyToClipboard(file.id, `id-${file.id}`)}
                      id={`copy-id-${idx}`}
                    >
                      {copied === `id-${file.id}` ? '✓ Đã chép' : '📋 ID'}
                    </button>
                    <button
                      className="btn-sm btn-info"
                      title="Xem JSON chi tiết"
                      onClick={() => onViewDetail(file)}
                      id={`detail-${idx}`}
                    >
                      {'{ }'} JSON
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
