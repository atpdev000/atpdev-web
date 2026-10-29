import { LocalNotifications } from '@capacitor/local-notifications';
import { useEffect } from 'react';
import { usePlatform } from './usePlatform';

export function useNotifications() {
    const { isNative } = usePlatform();

    useEffect(() => {
        if (isNative) {
            // Crear canal para Android 8+ (Requerido para que se muestren)
            LocalNotifications.createChannel({
                id: 'downloads',
                name: 'Descargas Completadas',
                description: 'Notifica cuando una descarga ha finalizado',
                importance: 5,
                visibility: 1,
                vibration: true,
            }).catch(err => console.error('Error creating notification channel:', err));

            // Solicitar permisos explícitos al montar
            LocalNotifications.requestPermissions();
        }
    }, [isNative]);

    const scheduleNotification = async (title: string, body: string) => {
        if (!isNative) return;

        try {
            // Verificar permisos antes de cada notificación
            let permStatus = await LocalNotifications.checkPermissions();

            if (permStatus.display !== 'granted') {
                permStatus = await LocalNotifications.requestPermissions();
            }

            if (permStatus.display !== 'granted') {
                console.warn('Permisos de notificación no concedidos');
                return;
            }

            const id = Math.floor(Math.random() * 1000000);
            await LocalNotifications.schedule({
                notifications: [
                    {
                        title,
                        body,
                        id,
                        channelId: 'downloads',
                        schedule: { at: new Date(Date.now() + 100) },
                        sound: undefined,
                        actionTypeId: '',
                        extra: null
                    }
                ]
            });
            console.log('Notificación programada:', title);
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    };

    return { scheduleNotification };
}
