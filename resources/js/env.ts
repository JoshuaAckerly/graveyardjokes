// env.ts — re-exports from the shared @gj/env package.
// getEnvVar is also exported for direct env var access (used by CDN/asset URL lookups).
export { getEnvVar } from '@gj/env';
import { createEnvResolver } from '@gj/env';

export const { getProjectUrl, getMainSiteUrl } = createEnvResolver('graveyardjokes.com');
