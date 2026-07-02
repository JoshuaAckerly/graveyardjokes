export const getEnvironmentUrl = (url: string): string => {
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

    // On test environments we currently reuse production-captured screenshots.
    // This maps incoming project URLs to the .com cache naming convention.
    if (currentHost.includes('.test')) {
        return url.replace(/graveyardjokes\.(com|local|test)/g, 'graveyardjokes.com');
    }

    // For staging/testing environments, you could add similar logic
    // if (currentHost.includes('staging')) {
    //     return url.replace(/\.com/g, '.staging.com');
    // }

    // Return original URL for production
    return url;
};

export const getScreenshotPath = (url: string): string => {
    const envUrl = getEnvironmentUrl(url);
    const safeName = envUrl.replace(/^https?:\/\//, '').replace(/[\\/:*?"<>|]/g, '_');
    return `/api/og-cache/${safeName}.png`;
};
