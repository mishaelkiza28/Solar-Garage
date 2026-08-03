import type { Client } from '../../types';
import Icon from '../icons/Icon';

export default function ContactSection({ client }: { client: Client }) {
  return (
    <div className="sec">
      <div className="sec-title"><Icon name="user" /> Contact details</div>
      <div className="field">
        <span className="field-l"><Icon name="phone" /> &nbsp;Phone</span>
        <span className="field-v">{client.phone || '—'}</span>
      </div>
      <div className="field">
        <span className="field-l"><Icon name="mail" /> &nbsp;Email</span>
        <span className="field-v" style={{ fontSize: 12 }}>{client.email || '—'}</span>
      </div>
      <div className="field">
        <span className="field-l"><Icon name="map" /> &nbsp;Location</span>
        <span className="field-v">{client.location || '—'}</span>
      </div>
    </div>
  );
}
