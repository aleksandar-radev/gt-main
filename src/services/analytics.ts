let analyticsEnabled = false;

export const enableAnalytics = () => {
    analyticsEnabled = true;
    // Placeholder for initializing analytics scripts after consent.
};

export const disableAnalytics = () => {
    if (!analyticsEnabled) {
        return;
    }
    analyticsEnabled = false;
    // Placeholder for disabling analytics scripts or clearing pending events.
};

export const isAnalyticsEnabled = () => analyticsEnabled;
