/** Best guess from the browser's time zone. Nothing is sent anywhere; the page is the same file for everyone. */
const ZONES: Record<string, string> = {
  'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Berlin': 'DE', 'Europe/Paris': 'FR', 'Europe/Rome': 'IT', 'Europe/Madrid': 'ES', 'Europe/Amsterdam': 'NL',
  'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Kuwait': 'KW', 'Africa/Cairo': 'EG',
  'Europe/Zurich': 'CH', 'Europe/Vienna': 'AT', 'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO', 'Europe/Copenhagen': 'DK', 'Europe/Lisbon': 'PT', 'Atlantic/Madeira': 'PT', 'Atlantic/Azores': 'PT',
  'Asia/Singapore': 'SG', 'Asia/Hong_Kong': 'HK', 'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR', 'Europe/Istanbul': 'TR',
  'America/Sao_Paulo': 'BR', 'America/Fortaleza': 'BR', 'America/Recife': 'BR', 'America/Bahia': 'BR', 'America/Belem': 'BR', 'America/Manaus': 'BR', 'America/Cuiaba': 'BR', 'America/Campo_Grande': 'BR', 'America/Porto_Velho': 'BR', 'America/Rio_Branco': 'BR', 'America/Maceio': 'BR', 'America/Araguaina': 'BR', 'America/Noronha': 'BR',
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
