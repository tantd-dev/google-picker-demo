import React from 'react';
import { Plus } from 'lucide-react';
import type { DriveFile } from '../types/google-picker';

interface FloatingBasketProps {
  /** All accumulated items in the basket */
  items: DriveFile[];
  /** Whether the Google Picker dialog is currently visible */
  isPickerOpen: boolean;
  /** Remove a single item by its ID */
  onRemoveItem: (id: string) => void;
  /** Clear all items */
  onClearAll: () => void;
  /** Open picker again to add more items */
  onPickMore: () => void;
  /** Finalize the selection — close basket & pass results to main table */
  onConfirm: () => void;
  /** Close/dismiss the basket overlay entirely (cancel) */
  onDismiss: () => void;
}

export const FloatingBasket: React.FC<FloatingBasketProps> = ({
  items,
  isPickerOpen,
  onRemoveItem,
  onClearAll,
  onPickMore,
  onConfirm,
  onDismiss,
}) => {
  const folderCount = items.filter((f) => f.isFolder).length;
  const fileCount = items.length - folderCount;

  return (
    <>
      {/* Backdrop overlay — visible only when picker is NOT showing (so we don't double-dim) */}
      {!isPickerOpen && (
        <div className="basket-backdrop" onClick={onDismiss} />
      )}

      {/* Floating panel */}
      <div className={`basket-panel ${isPickerOpen ? 'basket-panel--with-picker' : 'basket-panel--standalone'}`}>
        {/* Header */}
        <div className="basket-header">
          <div className="basket-header-left">
            <span className="basket-header-icon">🗂️</span>
            <h3 className="basket-title">Giỏ mục đã chọn</h3>
            {items.length > 0 && (
              <span className="basket-count-badge">{items.length}</span>
            )}
          </div>
          <button
            className="basket-close-btn"
            onClick={onDismiss}
            title="Đóng giỏ chọn"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Summary pills */}
        {items.length > 0 && (
          <div className="basket-summary">
            {folderCount > 0 && (
              <span className="basket-pill basket-pill--folder">
                📁 {folderCount} thư mục
              </span>
            )}
            {fileCount > 0 && (
              <span className="basket-pill basket-pill--file">
                📄 {fileCount} tệp
              </span>
            )}
          </div>
        )}

        {/* Items list */}
        <div className="basket-items-scroll">
          {items.length === 0 ? (
            <div className="basket-empty">
              <span className="basket-empty-icon">📂</span>
              <p>Chưa có mục nào được chọn</p>
              <p className="basket-empty-hint">
                Bấm <strong>"Chọn thêm"</strong> để mở Google Drive và chọn thư mục hoặc tệp.
              </p>
            </div>
          ) : (
            <ul className="basket-list">
              {items.map((item, idx) => (
                <li key={item.id} className={`basket-item ${item.isFolder ? 'basket-item--folder' : 'basket-item--file'}`}>
                  <span className="basket-item-num">{idx + 1}</span>
                  <span className="basket-item-icon">
                    {item.isFolder ? '📁' : '📄'}
                  </span>
                  <div className="basket-item-info">
                    <span className="basket-item-name" title={item.name}>
                      {item.name}
                    </span>
                    <span className="basket-item-id" title={item.id}>
                      {item.id}
                    </span>
                  </div>
                  <button
                    className="basket-item-remove"
                    onClick={() => onRemoveItem(item.id)}
                    title={`Xóa "${item.name}" khỏi giỏ`}
                    aria-label={`Xóa ${item.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer actions */}
        <div className="basket-footer">
          <button
            className="basket-btn basket-btn--pick-more"
            onClick={onPickMore}
            disabled={isPickerOpen}
            title="Mở Google Drive Picker để chọn thêm"
          >
            <Plus />
            Chọn thêm
          </button>

          {items.length > 0 && (
            <button
              className="basket-btn basket-btn--clear"
              onClick={onClearAll}
              title="Xóa toàn bộ mục đã chọn"
            >
              Xóa hết
            </button>
          )}

          <button
            className="basket-btn basket-btn--confirm"
            onClick={onConfirm}
            disabled={items.length === 0}
            title={items.length === 0 ? 'Chưa có mục nào để xác nhận' : `Xác nhận ${items.length} mục đã chọn`}
          >
            Xác nhận ({items.length})
          </button>
        </div>
      </div>
    </>
  );
};
