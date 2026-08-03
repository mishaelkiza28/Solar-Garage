import type { Client } from '../types';

interface ClientListProps {
  clients: Client[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function statusLabel(status: Client['status']) {
  if (status === 'installed') return 'Installed';
  if (status === 'prospect') return 'Prospect';
  return 'Inactive';
}

export default function ClientList({ clients, selectedId, onSelect }: ClientListProps) {
  if (!clients.length) {
    return <div className="client-list"><div className="list-msg">No clients found</div></div>;
  }

  return (
    <div className="client-list">
      {clients.map((c) => (
        <div
          key={c.id}
          className={`c-card ${selectedId === c.id ? 'sel' : ''}`}
          onClick={() => onSelect(c.id)}
        >
          <div className={`c-strip ${c.status}`} />
          <div className="c-body">
            <div className="c-name">{c.name}</div>
            <div className="c-sub">{c.location || '—'}</div>
            <div className="c-tags">
              <span className={`tag tag-${c.status}`}>{statusLabel(c.status)}</span>
              {c.project_ref && <span className="tag tag-neutral">{c.project_ref}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
