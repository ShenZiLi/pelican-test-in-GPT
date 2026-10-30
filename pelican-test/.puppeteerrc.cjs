// Only the official Chrome headless shell is needed by the offline tools.
module.exports = {
  chrome: { skipDownload: true },
  'chrome-headless-shell': { skipDownload: false },
  firefox: { skipDownload: true }
};
