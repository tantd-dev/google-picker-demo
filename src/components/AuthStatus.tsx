import React from 'react';
import type { AuthStatus } from '../types/google-picker';

interface AuthStatusPanelProps {
  status: AuthStatus;
  error: string | null;
}

type StatusConfig = { icon: string; label: string; className: string };

const STATUS_CONFIG: Record<AuthStatus, StatusConfig> = {
  idle: { icon: '○', label: 'Chưa xác thực (Chờ mở Picker)', className: 'auth-status--idle' },
  authenticated: { icon: '●', label: 'Đã xác thực tài khoản Google', className: 'auth-status--ok' },
  error: { icon: '✕', label: 'Lỗi xác thực OAuth', className: 'auth-status--error' },
};

export const AuthStatusPanel: React.FC<AuthStatusPanelProps> = ({ status, error }) => {
  const cfg = STATUS_CONFIG[status];

  return (
    <section className="panel" id="auth-status-panel">
      <h2 className="panel-title">
        <span className="panel-icon">🔐</span> Trạng thái xác thực Google
      </h2>
      <div className={`auth-status ${cfg.className}`}>
        <span className="auth-status-icon">{cfg.icon}</span>
        <span className="auth-status-label">{cfg.label}</span>
      </div>
      {status === 'idle' && (
        <p className="auth-hint">
          Quy trình xác thực OAuth 2.0 sẽ tự động kích hoạt khi bạn nhấn nút <strong>"Mở Google Driver"</strong>.
        </p>
      )}
      {status === 'authenticated' && (
        <p className="auth-hint auth-hint--success">
          ✓ Token OAuth đã được cấp. Google Drive Picker đã sẵn sàng.
        </p>
      )}
      {status === 'error' && error && (
        <div className="auth-error">
          <strong>Chi tiết lỗi:</strong> {error}
          <p className="auth-error-hint">
            Vui lòng kiểm tra Client ID trong file <code>.env</code> và đảm bảo URL hiện tại (ví dụ <code>http://localhost:5173</code>) đã được thêm vào mục <strong>Authorized JavaScript origins</strong> trong Google Cloud Console.
          </p>
        </div>
      )}
    </section>
  );
};
