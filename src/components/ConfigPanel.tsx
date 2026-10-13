// import React, { useState } from 'react';
import React from 'react';
import type { PickerConfig, ViewType } from '../types/google-picker';
import { VIEW_TYPE_LABELS } from '../types/google-picker';

interface ConfigPanelProps {
  config: PickerConfig;
  onChange: (config: PickerConfig) => void;
}

const VIEW_TYPES: ViewType[] = ['all', 'folders', 'docs', 'sheets', 'slides', 'images', 'pdfs'];

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  const update = (field: keyof PickerConfig, value: string | boolean) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <section className="panel" id="config-panel">
      <h2 className="panel-title">
        <span className="panel-icon">⚙️</span> Cấu hình Picker
      </h2>

      <div className="config-grid" style={{ marginTop: '14px' }}>
        <div className="form-group">
          <label htmlFor="view-type" className="form-label">
            Chế độ xem (View Filter)
            <span className="form-hint">Lọc loại tệp/thư mục hiển thị trong Google Picker</span>
          </label>
          <select
            id="view-type"
            className="form-select"
            value={config.viewType}
            onChange={(e) => update('viewType', e.target.value as ViewType)}
          >
            {VIEW_TYPES.map((vt) => (
              <option key={vt} value={vt}>
                {VIEW_TYPE_LABELS[vt]}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="form-group">
          <label htmlFor="view-mode" className="form-label">
            Kiểu hiển thị danh sách (Layout Mode)
            <span className="form-hint">Dạng danh sách truyền thống hoặc dạng lưới thẻ thumbnail</span>
          </label>
          <select
            id="view-mode"
            className="form-select"
            value={config.viewMode || 'list'}
            onChange={(e) => update('viewMode', e.target.value as 'list' | 'grid')}
          >
            <option value="list">📋 Danh sách chi tiết (List Mode)</option>
            <option value="grid">🖼️ Lưới xem trước thẻ hình ảnh (Grid Thumbnail Mode)</option>
          </select>
        </div> */}

        {/* <div className="form-group">
          <label htmlFor="picker-title" className="form-label">
            Tiêu đề Popup Picker
            <span className="form-hint">Tiêu đề hiển thị ở thanh trên cùng của cửa sổ Google Picker</span>
          </label>
          <input
            id="picker-title"
            type="text"
            className="form-input"
            value={config.title}
            placeholder="Ví dụ: 📂 Chọn tệp từ Google Drive"
            onChange={(e) => update('title', e.target.value)}
          />
        </div> */}

        {/* <div className="form-group">
          <label htmlFor="picker-locale" className="form-label">
            Ngôn ngữ hiển thị (Locale)
            <span className="form-hint">Dịch toàn bộ nút bấm, tên cột và hướng dẫn trong popup</span>
          </label>
          <select
            id="picker-locale"
            className="form-select"
            value={config.locale || 'vi'}
            onChange={(e) => update('locale', e.target.value)}
          >
            <option value="vi">🇻🇳 Tiếng Việt (vi)</option>
            <option value="en">🇺🇸 Tiếng Anh (en)</option>
          </select>
        </div> */}

        {/* <div className="form-group form-group--checkbox">
          <label htmlFor="multiselect" className="form-label form-label--inline">
            <input
              id="multiselect"
              type="checkbox"
              className="form-checkbox"
              checked={config.multiselect}
              onChange={(e) => update('multiselect', e.target.checked)}
            />
            <span>
              <strong>Cho phép chọn nhiều mục cùng lúc (Multi-select)</strong>
              <span className="form-hint" style={{ display: 'block', marginTop: '2px' }}>
                Hiển thị ô checkbox trên từng tệp và thư mục trong danh sách
              </span>
            </span>
          </label>
        </div> */}

        <div className="form-group form-group--checkbox">
          <label htmlFor="select-folder-enabled" className="form-label form-label--inline">
            <input
              id="select-folder-enabled"
              type="checkbox"
              className="form-checkbox"
              checked={config.selectFolderEnabled}
              onChange={(e) => update('selectFolderEnabled', e.target.checked)}
            />
            <span>
              <strong>Cho phép chọn / checkbox Thư mục (Folders)</strong>
              <span className="form-hint" style={{ display: 'block', marginTop: '2px' }}>
                Bật checkbox trên các thư mục trong My Drive để pick được thư mục
              </span>
            </span>
          </label>
        </div>

        {/* <div className="form-group form-group--checkbox">
          <label htmlFor="include-shared-drives" className="form-label form-label--inline">
            <input
              id="include-shared-drives"
              type="checkbox"
              className="form-checkbox"
              checked={config.includeSharedDrives}
              onChange={(e) => update('includeSharedDrives', e.target.checked)}
            />
            <span>
              <strong>Bao gồm Bộ nhớ dùng chung (Shared drives)</strong>
              <span className="form-hint" style={{ display: 'block', marginTop: '2px' }}>
                Hiển thị tab Bộ nhớ dùng chung song song cùng My Drive
              </span>
            </span>
          </label>
        </div> */}

        {/* <div className="form-group form-group--checkbox">
          <label htmlFor="include-starred" className="form-label form-label--inline">
            <input
              id="include-starred"
              type="checkbox"
              className="form-checkbox"
              checked={config.includeStarred}
              onChange={(e) => update('includeStarred', e.target.checked)}
            />
            <span>
              <strong>Thêm tab Có gắn dấu sao (Starred)</strong>
              <span className="form-hint" style={{ display: 'block', marginTop: '2px' }}>
                Hiển thị tab riêng để duyệt nhanh các file đã được đánh dấu sao quan trọng
              </span>
            </span>
          </label>
        </div> */}
      </div>

      {/* Collapsible advanced manual override */}
      {/* <div className="override-accordion">
        <button
          type="button"
          className="override-toggle-btn"
          onClick={() => setShowOverride(!showOverride)}
        >
          <span>{showOverride ? '▼' : '►'} Chỉnh sửa thủ công (nếu không dùng .env)</span>
        </button>

        {showOverride && (
          <div className="override-content">
            <div className="form-group">
              <label htmlFor="manual-api-key" className="form-label">
                API Key
              </label>
              <input
                id="manual-api-key"
                type="text"
                className="form-input"
                value={config.apiKey}
                onChange={(e) => update('apiKey', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="manual-client-id" className="form-label">
                OAuth Client ID
              </label>
              <input
                id="manual-client-id"
                type="text"
                className="form-input"
                value={config.clientId}
                onChange={(e) => update('clientId', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="manual-app-id" className="form-label">
                App ID / Project Number
              </label>
              <input
                id="manual-app-id"
                type="text"
                className="form-input"
                value={config.appId}
                onChange={(e) => update('appId', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="manual-scope" className="form-label">
                OAuth Scope
              </label>
              <input
                id="manual-scope"
                type="text"
                className="form-input"
                value={config.scope}
                onChange={(e) => update('scope', e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn-sm btn-secondary"
              style={{ marginTop: '6px' }}
              onClick={handleResetToEnv}
            >
              🔄 Khôi phục lại từ file .env
            </button>
          </div>
        )}
      </div> */}
    </section>
  );
};
