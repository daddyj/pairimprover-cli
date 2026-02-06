/**
 * Configuration for pAIrImprover CLI
 */

export const config = {
  // API endpoint - points to your private backend
  apiEndpoint:
    process.env.PAIRIMPROVER_API ||
    "https://www.pairimprover.com/api/analyze",

  // CLI version
  version: "0.1.0",

  // Default settings
  defaults: {
    autoOpen: false, // Don't auto-open browser by default (dashboard not ready)
  },

  // URLs
  urls: {
    website: "https://www.pairimprover.com",
    pricing: "https://www.pairimprover.com/pricing",
    docs: "https://github.com/daddyj/pairimprover-cli",
  },
};
