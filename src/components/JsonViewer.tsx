import React, { useState } from 'react';

interface JsonViewerProps {
  data: unknown;
  title?: string;
  onClose?: () => void;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, title = 'Raw JSON Response', onClose }) => {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
    }
  };

  if (data === null || data === undefined) {
    return (
      <section className="panel" id="json-viewer-panel">
        <h2 className="panel-title">
          <span className="panel-icon">{ }</span> {title}
        </h2>
        <div className="empty-state">
          <span className="empty-icon">{ }</span>
          <p>No response data yet. Pick some files to see the raw JSON output.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel" id="json-viewer-panel">
      <h2 className="panel-title">
        <span className="panel-icon">{ }</span> {title}
        <div className="panel-actions">
          <button className="btn-sm btn-secondary" onClick={copy} id="copy-json-btn">
            {copied ? '✓ Copied!' : '📋 Copy JSON'}
          </button>
          {onClose && (
            <button className="btn-sm btn-ghost" onClick={onClose} id="close-json-btn">
              ✕ Close
            </button>
          )}
        </div>
      </h2>
      <pre className="json-pre">
        <code>{json}</code>
      </pre>
    </section>
  );
};
