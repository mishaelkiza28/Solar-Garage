import type { NavFilter } from '../types';
import Icon from './icons/Icon';

interface SidebarProps {
  filter: NavFilter;
  onFilterChange: (f: NavFilter) => void;
  counts: { all: number; installed: number; prospect: number; overdue: number };
  userEmail: string | null;
  onSignOut: () => void;
  onAddClient: () => void;
}

const NAV_ITEMS: { key: NavFilter; label: string; icon: 'users' | 'panel' | 'userPlus' }[] = [
  { key: 'all', label: 'All clients', icon: 'users' },
  { key: 'installed', label: 'Installed', icon: 'panel' },
  { key: 'prospect', label: 'Prospects', icon: 'userPlus' },
];

export default function Sidebar({ filter, onFilterChange, counts, userEmail, onSignOut, onAddClient }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-eye">Solar Garage</div>
        <div className="sb-name">Client Manager</div>
      </div>

      <div className="nav-sec">Clients</div>
      {NAV_ITEMS.map((item) => (
        <div
          key={item.key}
          className={`nav-item ${filter === item.key ? 'active' : ''}`}
          onClick={() => onFilterChange(item.key)}
        >
          <Icon name={item.icon} size={16} />
          {item.label}
          <span className="nav-badge">{counts[item.key]}</span>
        </div>
      ))}

      <div className="nav-sec">Quick access</div>
      <div className={`nav-item ${filter === 'overdue' ? 'active' : ''}`} onClick={() => onFilterChange('overdue')}>
        <Icon name="tool" size={16} />
        Overdue O&amp;M
        <span className="nav-badge">{counts.overdue}</span>
      </div>

      <div className="sb-footer">
        <button className="add-btn" onClick={onAddClient}>
          <Icon name="plus" size={14} />
          Add client
        </button>
      </div>

      {userEmail && (
        <div className="sb-user">
          <div className="sb-user-email" title={userEmail}>{userEmail}</div>
          <button className="sb-signout" onClick={onSignOut}>Sign out</button>
        </div>
      )}
    </aside>
  );
}
