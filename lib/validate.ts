// Real USCIS receipt format: 3-letter service center prefix + 10 digits
const VALID_PREFIXES = ['IOE','EAC','WAC','LIN','SRC','MSC','NBC','YSC','LRC','FLN','HLG','SSC'];
const RE = /^[A-Z]{3}[0-9]{10}$/;

export function validateReceipt(raw: string): { ok: boolean; value: string; error?: string } {
  const value = raw.trim().toUpperCase();
  if (value.length !== 13) return { ok: false, value, error: 'Receipt number must be 13 characters' };
  if (!RE.test(value)) return { ok: false, value, error: 'Format: 3 letters followed by 10 digits' };
  if (!VALID_PREFIXES.includes(value.slice(0, 3)))
    return { ok: false, value, error: `"${value.slice(0, 3)}" is not a known USCIS service center` };
  return { ok: true, value };
}
