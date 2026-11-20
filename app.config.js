// Wraps app.json. One switch for builds made before Apple's signing profile has the Associated Domains
// capability (the Plaid OAuth return link, applinks:ditchsubs.app): with DITCH_SKIP_ASSOCIATED_DOMAINS=1
// (an EAS environment variable) the build leaves it out instead of failing. Remove the variable once
// Associated Domains is on for app.ditchsubs.ditch at developer.apple.com (docs/STATUS.md).
module.exports = ({ config }) => {
  if (process.env.DITCH_SKIP_ASSOCIATED_DOMAINS === '1' && config.ios) {
    const { associatedDomains: _skipped, ...ios } = config.ios;
    return { ...config, ios };
  }
  return config;
};
