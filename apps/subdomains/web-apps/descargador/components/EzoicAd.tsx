'use client'

import { useEffect } from 'react'

interface EzoicAdProps {
    placeholderId: number
    className?: string
}

declare global {
    interface Window {
        ezstandalone?: {
            cmd: any[]
            showAds: (...ids: number[]) => void
            define: (...ids: number[]) => void
            enable: () => void
            display: () => void
            isEzoicActive: () => boolean
        }
    }
}

export default function EzoicAd({ placeholderId, className = "" }: EzoicAdProps) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const ez = window.ezstandalone;
            if (ez) {
                ez.cmd = ez.cmd || [];
                ez.cmd.push(function () {
                    if (ez.showAds) {
                        ez.showAds(placeholderId);
                    }
                });
            }
        }
    }, [placeholderId]);

    return (
        <div className={`ezoic-ad-container ${className}`}>
            <div id={`ezoic-pub-ad-placeholder-${placeholderId}`}></div>
        </div>
    )
}
