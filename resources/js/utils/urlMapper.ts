export const getEnvironmentUrl = (url: string): string => {
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

    // If we're on local development, replace .com with .local
    if (currentHost.includes('.local') || currentHost === 'localhost') {
        return url.replace(/\.com/g, '.local');
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
    return `/storage/og-cache/${safeName}.png`;
};
