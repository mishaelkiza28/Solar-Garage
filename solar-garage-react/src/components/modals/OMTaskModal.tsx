import { useState } from 'react';
import ModalShell from './ModalShell';
import type { OMState } from '../../types';

interface Props {
  onClose: () => void;
  onSave: (label: string, dueDate: string, state: OMState) => Promise<void>;
}

export default function OMTaskModal({ onClose, onSave }: Props) {
  const [label, setLabel] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [state, setState] = useState<OMState>('upcoming');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!label.trim() || !dueDate) return;
    setSaving(true);
    await onSave(label.trim(), dueDate, state);
    setSaving(false);
  }

  return (
    <ModalShell title="Add O&M task" onClose={onClose} maxWidth={420}>
      <div className="form-group">
        <label className="form-label">Task label *</label>
        <input className="form-input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. 6-month inspection" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Due date *</label>
          <input className="form-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">State</label>
          <select className="form-select" value={state} onChange={(e) => setState(e.target.value as OMState)}>
            <option value="upcoming">Upcoming</option>
            <option value="done">Done</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <button className="action-btn" onClick={onClose}>Cancel</button>
        <button className="action-btn primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Add task'}
        </button>
      </div>
    </ModalShell>
  );
}
