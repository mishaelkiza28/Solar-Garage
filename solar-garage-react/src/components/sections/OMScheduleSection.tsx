import type { OMTask } from '../../types';
import { fmtDate } from '../../utils/format';
import Icon from '../icons/Icon';
import { DEMO } from '../../lib/supabase';

interface Props {
  tasks: OMTask[];
  onAddTask: () => void;
  onMarkDone: (taskId: string) => void;
}

export default function OMScheduleSection({ tasks, onAddTask, onMarkDone }: Props) {
  return (
    <div className="sec">
      <div className="sec-title sec-title-row">
        <span><Icon name="tool" /> O&amp;M schedule</span>
        <button className="sec-btn" onClick={onAddTask}>+ Add task</button>
      </div>
      {tasks.length === 0 && <div className="doc-empty">No tasks scheduled yet.</div>}
      {tasks.map((t) => (
        <div className="om-row" key={t.id}>
          <div className={`om-dot ${t.state}`} />
          <div className="om-label">{t.label}</div>
          {t.state === 'overdue' && <span className="om-badge overdue">Overdue</span>}
          <div className="om-date">{fmtDate(t.due_date)}</div>
          {!DEMO && t.state !== 'done' && (
            <button className="sec-btn" style={{ marginLeft: 6 }} onClick={() => onMarkDone(t.id)} title="Mark done">
              ✓
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
