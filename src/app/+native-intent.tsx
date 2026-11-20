// Links that open the app from outside (Universal Links, ditchsubs.app).
// /plaid/oauth is Plaid's return address after someone logs in on their bank's own site or app. Plaid Link
// picks it up by itself, so the router must not navigate: stay on the bank screen underneath. If the app was
// closed in the meantime, start on Home.
export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }): string | null {
  try {
    const p = path.startsWith('http') ? new URL(path).pathname : path;
    if (p.startsWith('/plaid/oauth')) return initial ? '/' : null;
  } catch {
    return '/';
  }
  return path;
}
