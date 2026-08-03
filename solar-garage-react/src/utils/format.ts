export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export function fmtDate(d: string | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function fmtBytes(b: number | null | undefined): string {
  if (!b) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export function docIconClass(mime: string | null | undefined): 'pdf' | 'img' | 'xls' | 'doc' | 'other' {
  if (!mime) return 'other';
  if (mime === 'application/pdf') return 'pdf';
  if (mime.startsWith('image/')) return 'img';
  if (mime.includes('sheet') || mime.includes('excel') || mime === 'text/csv') return 'xls';
  if (mime.includes('word') || mime.includes('document')) return 'doc';
  return 'other';
}

export function detectDocCategory(fileName: string): string {
  const lc = fileName.toLowerCase();
  if (lc.includes('proposal') || lc.includes('quotation') || lc.includes('quote')) return 'proposal';
  if (lc.includes('contract') || lc.includes('agreement')) return 'contract';
  if (lc.includes('invoice') || lc.includes('receipt') || lc.includes('boq')) return 'invoice';
  if (lc.includes('survey') || lc.includes('site')) return 'site_survey';
  if (lc.includes('warrant')) return 'warranty';
  if (lc.includes('permit') || lc.includes('certificate')) return 'permit';
  return 'other';
}
