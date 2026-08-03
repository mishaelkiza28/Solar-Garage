import type { ReactNode } from 'react';

interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}

export default function ModalShell({ title, onClose, children, maxWidth = 520 }: ModalShellProps) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth }}>
        <div className="modal-title">
          <span>{title}</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
