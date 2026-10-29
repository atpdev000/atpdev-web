import { useState, useEffect } from 'react';
import { Filesystem } from '@capacitor/filesystem';

export function usePermissions() {
    const [hasPermissions, setHasPermissions] = useState(false);

    useEffect(() => {
        checkAndRequestPermissions();
    }, []);

    const checkAndRequestPermissions = async () => {
        try {
            // Verificar permisos de almacenamiento
            const checkResult = await Filesystem.checkPermissions();

            if (checkResult.publicStorage === 'granted') {
                setHasPermissions(true);
            } else {
                // Solicitar permisos
                const requestResult = await Filesystem.requestPermissions();
                setHasPermissions(requestResult.publicStorage === 'granted');
            }
        } catch (error) {
            console.error('Error checking permissions:', error);
            setHasPermissions(false);
        }
    };

    return { hasPermissions, requestPermissions: checkAndRequestPermissions };
}
