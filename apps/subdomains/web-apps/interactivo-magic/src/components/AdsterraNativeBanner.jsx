import { useEffect } from 'react';

/**
 * Adsterra Native Banner Component
 * Integrates seamlessly with content for natural ad placement
 */
const AdsterraNativeBanner = ({ className = '' }) => {
    useEffect(() => {
        // Load script only once when component mounts
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://pl28641624.effectivegatecpm.com/03cd60e3277c2822e7710e0fb1a28cb0/invoke.js';

        // Append to document body
        document.body.appendChild(script);

        // Cleanup function
        return () => {
            // Remove script on unmount to avoid duplicates
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div className={`adsterra-native-banner ${className}`}>
            <div id="container-03cd60e3277c2822e7710e0fb1a28cb0"></div>
        </div>
    );
};

export default AdsterraNativeBanner;
