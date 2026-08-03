import { useState } from 'react';
import ModalShell from './ModalShell';
import type { FollowupIcon } from '../../types';

interface Props {
  onClose: () => void;
  onSave: (note: string, icon: FollowupIcon, date: string) => Promise<void>;
}

export default function FollowUpModal({ onClose, onSave }: Props) {
  const [note, setNote] = useState('');
  const [icon, setIcon] = useState<FollowupIcon>('phone');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!note.trim()) return;
    setSaving(true);
    await onSave(note.trim(), icon, date);
    setSaving(false);
  }

  return (
    <ModalShell title="Log follow-up" onClose={onClose} maxWidth={420}>
      <div className="form-group">
        <label className="form-label">Note *</label>
        <textarea
          className="form-textarea"
          style={{ minHeight: 90 }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What happened or what was discussed…"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select" value={icon} onChange={(e) => setIcon(e.target.value as FollowupIcon)}>
            <option value="phone">Phone call</option>
            <option value="mail">Email</option>
            <option value="user">In-person</option>
            <option value="file">Document / proposal</option>
            <option value="clock">Waiting / follow-up</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className="modal-footer">
        <button className="action-btn" onClick={onClose}>Cancel</button>
        <button className="action-btn primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Log it'}
        </button>
      </div>
    </ModalShell>
  );
}
