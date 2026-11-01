import React, { useEffect } from 'react';

/**
 * EzoicAd Component
 * @param {string} id - The placeholder ID provided by Ezoic (e.g., '101', '102')
 * @param {string} className - Optional CSS classes
 */
const EzoicAd = ({ id, className = "" }) => {
    const placeholderId = `ezoic-pub-ad-placeholder-${id}`;

    useEffect(() => {
        try {
            if (window.ezstandalone) {
                window.ezstandalone.define(id);
                if (!window.ezstandalone.enabled) {
                    window.ezstandalone.enable();
                    window.ezstandalone.display();
                } else {
                    window.ezstandalone.refresh();
                }
            }
        } catch (e) {
            console.warn('Ezoic ezstandalone error:', e);
        }
    }, [id]);

    return (
        <div
            id={placeholderId}
            className={`ezoic-ad-container ${className}`}
            style={{ minHeight: '100px', display: 'flex', justifyContent: 'center', margin: '1rem 0' }}
        >
            {/* Ezoic ad will be injected here */}
        </div>
    );
};

export default EzoicAd;
