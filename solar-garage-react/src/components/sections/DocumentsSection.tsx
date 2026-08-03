import type { ClientDocument } from '../../types';
import { fmtDate, fmtBytes, docIconClass } from '../../utils/format';
import Icon, { type IconName } from '../icons/Icon';

interface Props {
  documents: ClientDocument[];
  onUpload: () => void;
  onDownload: (doc: ClientDocument) => void;
  onDelete: (doc: ClientDocument) => void;
}

const ICON_BY_CLASS: Record<string, IconName> = {
  pdf: 'file',
  img: 'image',
  xls: 'sheet',
  doc: 'word',
  other: 'file',
};

export default function DocumentsSection({ documents, onUpload, onDownload, onDelete }: Props) {
  return (
    <div className="sec">
      <div className="sec-title sec-title-row">
        <span><Icon name="file" /> Documents</span>
        <button className="sec-btn" onClick={onUpload}>+ Upload</button>
      </div>
      {documents.length === 0 && <div className="doc-empty">No documents yet — upload the first one.</div>}
      {documents.map((d) => {
        const cls = docIconClass(d.mime_type);
        return (
          <div className="doc-row" key={d.id}>
            <div className={`doc-icon-wrap ${cls}`}>
              <Icon name={ICON_BY_CLASS[cls]} size={15} />
            </div>
            <div className="doc-info">
              <div className="doc-name" title={d.file_name}>{d.file_name}</div>
              <div className="doc-meta">
                <span className={`doc-cat ${d.category}`}>{d.category.replace('_', ' ')}</span>
                <span>{fmtBytes(d.file_size)}</span>
                <span>{fmtDate(d.created_at)}</span>
              </div>
            </div>
            <div className="doc-actions">
              <button className="doc-btn" onClick={() => onDownload(d)} title="Download">
                <Icon name="download" />
              </button>
              <button className="doc-btn danger" onClick={() => onDelete(d)} title="Delete">
                <Icon name="trash" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
