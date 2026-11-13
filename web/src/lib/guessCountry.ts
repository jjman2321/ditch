/** Best guess from the browser's time zone. Nothing is sent anywhere; the page is the same file for everyone. */
const ZONES: Record<string, string> = {
  'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Berlin': 'DE', 'Europe/Paris': 'FR', 'Europe/Rome': 'IT', 'Europe/Madrid': 'ES', 'Europe/Amsterdam': 'NL',
  'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Kuwait': 'KW', 'Africa/Cairo': 'EG',
  'Pacific/Auckland': 'NZ', 'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA', 'America/Winnipeg': 'CA', 'America/Halifax': 'CA', 'America/St_Johns': 'CA',
};
export function guessCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (ZONES[tz]) return ZONES[tz];
    if (tz.startsWith('Australia/')) return 'AU';
    if (tz.startsWith('America/')) return 'US';
  } catch {}
  return 'US';
}
