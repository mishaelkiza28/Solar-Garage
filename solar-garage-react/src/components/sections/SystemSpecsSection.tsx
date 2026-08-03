import type { SystemSpec } from '../../types';
import { fmtDate } from '../../utils/format';
import Icon from '../icons/Icon';

export default function SystemSpecsSection({ spec }: { spec: SystemSpec }) {
  const rows: [string, string | null][] = [
    ['System size', spec.system_size],
    ['Panels', spec.panels],
    ['Inverter', spec.inverter],
    ['Battery bank', spec.battery],
    ['Mount type', spec.mount_type],
    ['Grid config', spec.grid_config],
    ['Install date', fmtDate(spec.install_date)],
  ];

  return (
    <div className="sec">
      <div className="sec-title"><Icon name="panel" /> System specs</div>
      {rows.map(([label, value]) => (
        <div className="field" key={label}>
          <span className="field-l">{label}</span>
          <span className="field-v">{value || '—'}</span>
        </div>
      ))}
    </div>
  );
}
