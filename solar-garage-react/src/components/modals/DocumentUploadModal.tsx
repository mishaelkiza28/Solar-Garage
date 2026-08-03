import { useRef, useState, type DragEvent } from 'react';
import ModalShell from './ModalShell';
import Icon from '../icons/Icon';
import { fmtBytes, detectDocCategory } from '../../utils/format';
import type { DocCategory } from '../../types';

interface Props {
  onClose: () => void;
  onUpload: (file: File, category: DocCategory, uploadedBy: string) => Promise<void>;
}

const MAX_BYTES = 10 * 1024 * 1024;

export default function DocumentUploadModal({ onClose, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocCategory>('other');
  const [uploadedBy, setUploadedBy] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const rampRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (f.size > MAX_BYTES) {
      alert('File exceeds 10 MB limit');
      return;
    }
    setFile(f);
    setCategory(detectDocCategory(f.name) as DocCategory);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    let pct = 0;
    rampRef.current = window.setInterval(() => {
      pct = Math.min(pct + Math.random() * 12, 90);
      setProgress(pct);
    }, 200);

    try {
      await onUpload(file, category, uploadedBy.trim());
      if (rampRef.current) window.clearInterval(rampRef.current);
      setProgress(100);
      setTimeout(onClose, 400);
    } catch (e) {
      if (rampRef.current) window.clearInterval(rampRef.current);
      setUploading(false);
      setProgress(0);
      alert('Upload failed: ' + (e as Error).message);
    }
  }

  return (
    <ModalShell title="Upload document" onClose={onClose} maxWidth={460}>
      <div
        className={`doc-drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.txt,.csv"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="doc-drop-icon"><Icon name="upload" size={28} /></div>
        <div className="doc-drop-text">Drop a file here or <span>browse</span></div>
        <div className="doc-drop-hint">PDF, Word, Excel, images · max 10 MB</div>
      </div>

      {file && (
        <div className="doc-selected-file" style={{ display: 'flex' }}>
          <Icon name="file" size={16} className="doc-selected-icon" />
          <span className="doc-selected-name">{file.name}</span>
          <span className="doc-selected-size">{fmtBytes(file.size)}</span>
          <button onClick={() => setFile(null)} className="doc-clear-btn">×</button>
        </div>
      )}

      {uploading && (
        <div className="doc-upload-progress visible">
          <div className="doc-progress-label">{file?.name}</div>
          <div className="doc-progress-bar-track">
            <div className="doc-progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value as DocCategory)}>
            <option value="proposal">Proposal</option>
            <option value="contract">Contract</option>
            <option value="invoice">Invoice</option>
            <option value="site_survey">Site survey</option>
            <option value="warranty">Warranty</option>
            <option value="permit">Permit</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Uploaded by</label>
          <input className="form-input" value={uploadedBy} onChange={(e) => setUploadedBy(e.target.value)} placeholder="Your name" />
        </div>
      </div>

      <div className="modal-footer">
        <button className="action-btn" onClick={onClose}>Cancel</button>
        <button className="action-btn primary" onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </ModalShell>
  );
}
