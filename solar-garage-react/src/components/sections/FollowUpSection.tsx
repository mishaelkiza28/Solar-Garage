import type { Followup } from '../../types';
import { fmtDate } from '../../utils/format';
import Icon from '../icons/Icon';

interface Props {
  followups: Followup[];
  onLog: () => void;
}

export default function FollowUpSection({ followups, onLog }: Props) {
  return (
    <div className="sec">
      <div className="sec-title sec-title-row">
        <span><Icon name="calendar" /> Follow-up log</span>
        <button className="sec-btn" onClick={onLog}>+ Log</button>
      </div>
      {followups.length === 0 && <div className="doc-empty">No follow-ups logged yet.</div>}
      {followups.map((f) => (
        <div className="fu-row" key={f.id}>
          <span className="fu-icon"><Icon name={f.icon} size={14} /></span>
          <div>
            <div className="fu-text">{f.note}</div>
            <div className="fu-date">{fmtDate(f.logged_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
