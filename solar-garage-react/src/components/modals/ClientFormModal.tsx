import { useState } from 'react';
import ModalShell from './ModalShell';
import type { Client, ClientStatus, SystemSpec } from '../../types';

export interface ClientFormValues {
  name: string;
  phone: string;
  email: string;
  location: string;
  status: ClientStatus;
  project_ref: string;
  notes: string;
  size: string;
  panels: string;
  inverter: string;
  battery: string;
  mount: string;
  grid: string;
  installDate: string;
}

interface Props {
  client: Client | null; // null = adding a new client
  existingSpec: SystemSpec | null;
  onClose: () => void;
  onSave: (values: ClientFormValues) => Promise<void>;
}

function toValues(client: Client | null, spec: SystemSpec | null): ClientFormValues {
  return {
    name: client?.name || '',
    phone: client?.phone || '',
    email: client?.email || '',
    location: client?.location || '',
    status: client?.status || 'prospect',
    project_ref: client?.project_ref || '',
    notes: client?.notes || '',
    size: spec?.system_size || '',
    panels: spec?.panels || '',
    inverter: spec?.inverter || '',
    battery: spec?.battery || '',
    mount: spec?.mount_type || '',
    grid: spec?.grid_config || '',
    installDate: spec?.install_date || '',
  };
}

export default function ClientFormModal({ client, existingSpec, onClose, onSave }: Props) {
  const [values, setValues] = useState<ClientFormValues>(() => toValues(client, existingSpec));
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ClientFormValues>(key: K, val: ClientFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSave() {
    if (!values.name.trim()) return;
    setSaving(true);
    await onSave(values);
    setSaving(false);
  }

  return (
    <ModalShell title={client ? 'Edit client' : 'Add client'} onClose={onClose}>
      <div className="form-section-title">Client info</div>
      <div className="form-group">
        <label className="form-label">Full name *</label>
        <input className="form-input" value={values.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Akello Grace" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" value={values.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+256 7xx xxx xxx" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={values.email} onChange={(e) => set('email', e.target.value)} placeholder="name@example.com" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" value={values.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Kampala, Uganda" />
        </div>
        <div className="form-group">
          <label className="form-label">Status *</label>
          <select className="form-select" value={values.status} onChange={(e) => set('status', e.target.value as ClientStatus)}>
            <option value="prospect">Prospect</option>
            <option value="installed">Installed</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Project reference</label>
        <input className="form-input" value={values.project_ref} onChange={(e) => set('project_ref', e.target.value)} placeholder="e.g. Project 220" />
      </div>
      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea className="form-textarea" value={values.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Internal notes about this client…" />
      </div>

      {values.status === 'installed' && (
        <>
          <hr className="form-divider" />
          <div className="form-section-title">System specs</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">System size</label>
              <input className="form-input" value={values.size} onChange={(e) => set('size', e.target.value)} placeholder="e.g. 6.15 kWp" />
            </div>
            <div className="form-group">
              <label className="form-label">Install date</label>
              <input className="form-input" type="date" value={values.installDate} onChange={(e) => set('installDate', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Panels</label>
            <input className="form-input" value={values.panels} onChange={(e) => set('panels', e.target.value)} placeholder="e.g. JA Solar 410W × 15" />
          </div>
          <div className="form-group">
            <label className="form-label">Inverter</label>
            <input className="form-input" value={values.inverter} onChange={(e) => set('inverter', e.target.value)} placeholder="e.g. Deye 5kW Hybrid" />
          </div>
          <div className="form-group">
            <label className="form-label">Battery bank</label>
            <input className="form-input" value={values.battery} onChange={(e) => set('battery', e.target.value)} placeholder="e.g. Deye LFP 100Ah × 2 (parallel)" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mount type</label>
              <select className="form-select" value={values.mount} onChange={(e) => set('mount', e.target.value)}>
                <option value="">Select…</option>
                <option>Roof-mounted</option>
                <option>Ground-mounted</option>
                <option>Pole-mounted</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Grid config</label>
              <select className="form-select" value={values.grid} onChange={(e) => set('grid', e.target.value)}>
                <option value="">Select…</option>
                <option>Hybrid</option>
                <option>Off-grid</option>
                <option>Grid-tied</option>
              </select>
            </div>
          </div>
        </>
      )}

      <div className="modal-footer">
        <button className="action-btn" onClick={onClose}>Cancel</button>
        <button className="action-btn primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save client'}
        </button>
      </div>
    </ModalShell>
  );
}
