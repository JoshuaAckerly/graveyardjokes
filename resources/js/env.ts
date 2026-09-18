// env.ts — re-exports from the local env module (formerly the shared @gj/env package).
// getEnvVar is also exported for direct env var access (used by CDN/asset URL lookups).
export { getEnvVar } from './lib/env';
import { createEnvResolver } from './lib/env';

export const { getProjectUrl, getMainSiteUrl } = createEnvResolver('graveyardjokes.com');
