// env.ts
// Utility to get environment-based URLs for login/auth system


// Use VITE_SERVER_ENV from .env, fallback to import.meta.env.MODE
const getBaseDomain = () => {
  const env = import.meta.env.VITE_SERVER_ENV || import.meta.env.MODE;
  if (env === 'production') {
    return 'graveyardjokes.com';
  }
  if (env === 'test' || env === 'testing') {
    return 'graveyardjokes.test';
  }
  // Default to development
  return 'graveyardjokes.local';
};

export const getAuthSystemUrl = () => `http://auth-system.${getBaseDomain()}`;
export const getProjectUrl = (subdomain: string) => `http://${subdomain}.${getBaseDomain()}`;

export const getLoginUrl = (subdomain: string) => {
  const authUrl = getAuthSystemUrl();
  const returnUrl = getProjectUrl(subdomain);
  return `${authUrl}/login?return_url=${returnUrl}`;
};
