import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import {
  registerServiceWorker,
  checkInstallability,
  promptInstall as promptInstallPWA,
  isInstalled,
} from '../utils/service-worker';

interface UseOfflineResult {
  isOffline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  promptInstall: () => Promise<boolean>;
  syncData: () => Promise<void>;
}

export function useOffline(): UseOfflineResult {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(isInstalled());
  const { toast } = useToast();

  useEffect(() => {
    // Register service worker
    registerServiceWorker();
    
    // Check installability
    checkInstallability();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: 'Back Online',
        variant: 'default',
        children: 'Your connection has been restored.',
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: 'You\'re Offline',
        variant: 'destructive',
        children: 'Some features may be limited.',
      });
    };

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setIsInstallable(true);
    };

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsAppInstalled(true);
      toast({
        title: 'App Installed',
        variant: 'default',
        children: 'You can now access the app from your home screen.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  // Function to trigger background sync
  const syncData = async () => {
    if (!navigator.serviceWorker || !('sync' in navigator.serviceWorker)) {
      throw new Error('Service Worker or Background Sync not supported');
    }

    const registration = await navigator.serviceWorker.ready;
    if (!('sync' in registration)) {
      throw new Error('Background Sync not supported');
    }

    try {
      await registration.sync.register('sync-priorities');
      toast({
        title: 'Sync Scheduled',
        variant: 'default',
        children: 'Your data will be synchronized when you\'re back online.',
      });
    } catch (error) {
      console.error('Failed to register sync:', error);
      toast({
        title: 'Sync Failed',
        variant: 'destructive',
        children: 'Unable to schedule data synchronization.',
      });
    }
  };

  return {
    isOffline,
    isInstallable,
    isInstalled: isAppInstalled,
    promptInstall: promptInstallPWA,
    syncData,
  };
}
