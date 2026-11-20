// Universal Links for the Ditch app (team N5XRM284PV). Plaid sends people back here after they log in on
// their bank's own site or app (OAuth); iOS hands /plaid/oauth to Ditch so Plaid Link picks up where it left off.
// Must be JSON, at this exact path, with no redirect.

const AASA = {
  applinks: {
    details: [{ appIDs: ['N5XRM284PV.app.ditchsubs.ditch'], components: [{ '/': '/plaid/oauth*', comment: 'Plaid bank sign-in return' }] }],
  },
};

export function GET() {
  return new Response(JSON.stringify(AASA), { headers: { 'content-type': 'application/json' } });
}
