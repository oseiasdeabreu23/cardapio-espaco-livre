import type { LicenseRow } from './types';

export type LicenseGate =
  | { allowed: true; license: LicenseRow }
  | { allowed: false; reason: 'not_configured' | 'inactive'; license: LicenseRow | null };

export function evaluateLicense(license: LicenseRow | null): LicenseGate {
  if (!license) {
    return { allowed: false, reason: 'not_configured', license: null };
  }
  if (license.valido === true && license.status === 'ativo') {
    return { allowed: true, license };
  }
  return { allowed: false, reason: 'inactive', license };
}
