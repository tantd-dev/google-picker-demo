import React, { useRef, useEffect } from 'react';
import type { LogEntry } from '../types/google-picker';
import { formatTimestamp } from '../utils/logger';

interface DebugConsoleProps {
  logs: LogEntry[];
  onClear: () => void;
}

const LEVEL_COLORS: Record<LogEntry['level'], string> = {
  INFO: 'log-info',
  SUCCESS: 'log-success',
  ERROR: 'log-error',
  WARN: 'log-warn',
};

export const DebugConsole: React.FC<DebugConsoleProps> = ({ logs, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <section className="panel panel--console" id="debug-console-panel">
      <h2 className="panel-title">
        <span className="panel-icon">🖥️</span> Debug Console
        <div className="panel-actions">
          <span className="log-count">{logs.length} entries</span>
          <button className="btn-sm btn-ghost" onClick={onClear} id="clear-logs-btn">
            🗑 Clear Logs
          </button>
        </div>
      </h2>
      <div className="console-output" id="console-output">
        {logs.length === 0 ? (
          <div className="console-empty">Waiting for activity...</div>
        ) : (
          logs.map((entry) => (
            <div key={entry.id} className={`log-entry ${LEVEL_COLORS[entry.level]}`}>
              <span className="log-time">{formatTimestamp(entry.timestamp)}</span>
              <span className="log-badge log-badge--{entry.level.toLowerCase()}">{entry.level}</span>
              <span className="log-msg">{entry.message}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </section>
  );
};
