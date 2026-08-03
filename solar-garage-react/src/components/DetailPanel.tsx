import type { Client, ClientDetailData, ClientDocument } from '../types';
import { initials } from '../utils/format';
import ContactSection from './sections/ContactSection';
import SystemSpecsSection from './sections/SystemSpecsSection';
import OMScheduleSection from './sections/OMScheduleSection';
import FollowUpSection from './sections/FollowUpSection';
import DocumentsSection from './sections/DocumentsSection';
import NotesSection from './sections/NotesSection';
import Icon from './icons/Icon';

interface Props {
  client: Client;
  detail: ClientDetailData;
  onEdit: () => void;
  onDelete: () => void;
  onLogFollowup: () => void;
  onAddOmTask: () => void;
  onMarkOmDone: (taskId: string) => void;
  onUploadDoc: () => void;
  onDownloadDoc: (doc: ClientDocument) => void;
  onDeleteDoc: (doc: ClientDocument) => void;
}

function statusLabel(status: Client['status']) {
  if (status === 'installed') return 'Installed';
  if (status === 'prospect') return 'Prospect';
  return 'Inactive';
}

export default function DetailPanel({
  client, detail, onEdit, onDelete, onLogFollowup, onAddOmTask, onMarkOmDone, onUploadDoc, onDownloadDoc, onDeleteDoc,
}: Props) {
  const { spec, omTasks, followups, documents } = detail;

  return (
    <div className="detail-panel">
      <div className="d-hdr">
        <div className="avatar">{initials(client.name)}</div>
        <div>
          <div className="d-name">{client.name}</div>
          <div className="d-loc">{client.location || ''}</div>
          <div className="d-tags">
            <span className={`tag tag-${client.status}`}>{statusLabel(client.status)}</span>
            {client.project_ref && <span className="tag tag-neutral">{client.project_ref}</span>}
            {spec && <span className="tag tag-neutral">{spec.system_size}</span>}
            {documents.length > 0 && (
              <span className="tag tag-neutral">{documents.length} doc{documents.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </div>

      <ContactSection client={client} />

      {spec && <SystemSpecsSection spec={spec} />}

      {(client.status === 'installed' || omTasks.length > 0) && (
        <OMScheduleSection tasks={omTasks} onAddTask={onAddOmTask} onMarkDone={onMarkOmDone} />
      )}

      <FollowUpSection followups={followups} onLog={onLogFollowup} />

      <DocumentsSection documents={documents} onUpload={onUploadDoc} onDownload={onDownloadDoc} onDelete={onDeleteDoc} />

      {client.notes && <NotesSection notes={client.notes} />}

      <div className="action-bar">
        <button className="action-btn primary" onClick={onEdit}>
          <Icon name="user" size={13} /> Edit client
        </button>
        {client.status === 'prospect' && (
          <button className="action-btn blue" onClick={onLogFollowup}>
            <Icon name="calendar" size={13} /> Log follow-up
          </button>
        )}
        {client.status === 'installed' && (
          <button className="action-btn" onClick={onAddOmTask}>
            <Icon name="tool" size={13} /> Add O&amp;M task
          </button>
        )}
        <button className="action-btn" onClick={onUploadDoc}>
          <Icon name="upload" size={13} /> Upload document
        </button>
        <button className="action-btn danger" onClick={onDelete}>
          <Icon name="trash" size={13} /> Delete
        </button>
      </div>
    </div>
  );
}
