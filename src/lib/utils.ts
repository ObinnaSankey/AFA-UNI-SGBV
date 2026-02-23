export function generateTrackingId(): string {
  const date = new Date();
  const dateStr =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `UNI-${dateStr}-${random}`;
}

export function formatIncidentType(type: string): string {
  const map: Record<string, string> = {
    sexual_harassment: 'Sexual Harassment',
    attempted_assault: 'Attempted Assault',
    assault: 'Assault',
    intimidation_retaliation: 'Intimidation / Retaliation',
    other: 'Other',
  };
  return map[type] || type;
}

export function formatLocationType(type: string): string {
  const map: Record<string, string> = {
    on_campus: 'On Campus',
    off_campus: 'Off Campus',
    online: 'Online / Digital',
    other: 'Other',
  };
  return map[type] || type;
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
}
