import type { LogEntry, LogLevel } from '../types/google-picker';

let logCounter = 0;

export function createLogEntry(level: LogLevel, message: string): LogEntry {
  return {
    id: `log-${Date.now()}-${++logCounter}`,
    timestamp: new Date(),
    level,
    message,
  };
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
}
