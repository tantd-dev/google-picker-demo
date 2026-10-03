import React, { useState } from 'react';
import type { DriveFile } from '../types/google-picker';

interface SelectedFilesTableProps {
  files: DriveFile[];
  onViewDetail: (file: DriveFile) => void;
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

  if (files.length === 0) {
    return (
      <section className="panel" id="selected-files-panel">
        <h2 className="panel-title">
          <span className="panel-icon">📋</span> Selected Files
        </h2>
        <div className="empty-state">
          <span className="empty-icon">📁</span>
          <p>No files selected yet. Open the picker and choose some files.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel" id="selected-files-panel">
      <h2 className="panel-title">
        <span className="panel-icon">📋</span> Selected Files
        <span className="badge">{files.length}</span>
      </h2>
      <div className="table-wrapper">
        <table className="files-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>File ID</th>
              <th>MIME Type</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, idx) => (
              <tr key={file.id || idx}>
                <td className="td-num">{idx + 1}</td>
                <td className="td-name" title={file.name}>{file.name}</td>
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
                      Open ↗
                    </a>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="td-actions">
                  <button
                    className="btn-sm btn-secondary"
                    title="Copy File ID"
                    onClick={() => copyToClipboard(file.id, `id-${file.id}`)}
                    id={`copy-id-${idx}`}
                  >
                    {copied === `id-${file.id}` ? '✓' : '📋'} ID
                  </button>
                  <button
                    className="btn-sm btn-info"
                    title="View raw JSON"
                    onClick={() => onViewDetail(file)}
                    id={`detail-${idx}`}
                  >
                    {} JSON
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
