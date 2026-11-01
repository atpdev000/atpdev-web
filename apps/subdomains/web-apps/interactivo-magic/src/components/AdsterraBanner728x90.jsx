import { useEffect } from 'react';

/**
 * Adsterra Banner 728x90 Component
 * Traditional banner format for header/footer placement
 */
const AdsterraBanner728x90 = ({ className = '' }) => {
    useEffect(() => {
        // Set banner options
        window.atOptions = {
            'key': 'fdc11629d7b5477d7b2ddb57fe8d212e',
            'format': 'iframe',
            'height': 90,
            'width': 728,
            'params': {}
        };

        // Load script
        const script = document.createElement('script');
        script.src = 'https://www.highperformanceformat.com/fdc11629d7b5477d7b2ddb57fe8d212e/invoke.js';

        // Find the banner container and append script
        const container = document.getElementById('adsterra-banner-728x90-container');
        if (container) {
            container.appendChild(script);
        }

        // Cleanup function
        return () => {
            if (container && container.contains(script)) {
                container.removeChild(script);
            }
            // Clean up global atOptions
            delete window.atOptions;
        };
    }, []);

    return (
        <div className={`adsterra-banner-728 ${className}`}>
            <div
                id="adsterra-banner-728x90-container"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '90px',
                    width: '100%',
                    maxWidth: '728px',
                    margin: '0 auto'
                }}
            />
        </div>
    );
};

export default AdsterraBanner728x90;
