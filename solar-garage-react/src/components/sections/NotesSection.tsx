import Icon from '../icons/Icon';

export default function NotesSection({ notes }: { notes: string }) {
  return (
    <div className="sec">
      <div className="sec-title"><Icon name="notes" /> Notes</div>
      <div className="notes-text">{notes}</div>
    </div>
  );
}
