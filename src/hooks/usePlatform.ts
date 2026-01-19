import { useEffect, useState } from 'react';

export type Platform = 'desktop' | 'web' | 'mobile';

interface PlatformInfo {
  platform: Platform;
  os: string;
  arch: string;
  version: string;
  isOnline: boolean;
}

export function usePlatform() {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    platform: 'web',
    os: '',
    arch: '',
    version: '1.0.0',
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function detectPlatform() {
      try {
        // Try to detect Tauri desktop environment
        const { platform, os, arch, version } = await import('@/lib/desktop-service');
        
        const info = await platform.getPlatformInfo();
        const appVersion = await platform.getAppVersion();
        const isOnline = await platform.checkNetworkStatus();
        
        setPlatformInfo({
          platform: 'desktop',
          os: info.os,
          arch: info.arch,
          version: appVersion,
          isOnline,
        });
      } catch (error) {
        // Running in web environment
        setPlatformInfo({
          platform: 'web',
          os: navigator.platform,
          arch: navigator.userAgent,
          version: '1.0.0-web',
          isOnline: navigator.onLine,
        });
      } finally {
        setIsLoading(false);
      }
    }

    detectPlatform();

    // Listen for online/offline events
    const handleOnline = () => setPlatformInfo(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPlatformInfo(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    ...platformInfo,
    isLoading,
    isDesktop: platformInfo.platform === 'desktop',
    isWeb: platformInfo.platform === 'web',
    isMobile: platformInfo.platform === 'mobile',
  };
}

export function useOfflineMode() {
  const { isOnline, isDesktop } = usePlatform();
  const [offlineData, setOfflineData] = useState<Map<string, unknown>>(new Map());

  const isOfflineMode = !isOnline && isDesktop;

  const saveOfflineData = (key: string, data: unknown) => {
    if (isOfflineMode) {
      setOfflineData(prev => {
        const newData = new Map(prev);
        newData.set(key, { data, timestamp: Date.now() });
        localStorage.setItem('offline_cache', JSON.stringify(Array.from(newData.entries())));
        return newData;
      });
    }
  };

  const getOfflineData = <T>(key: string): T | null => {
    if (!isOfflineMode) return null;
    
    const cached = offlineData.get(key);
    if (cached) {
      return (cached as { data: T }).data;
    }
    
    // Try to get from localStorage
    const stored = localStorage.getItem('offline_cache');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const entry = parsed.find(([k]: [string, unknown]) => k === key);
        if (entry) {
          return entry[1]?.data || null;
        }
      } catch (e) {
        console.error('Failed to parse offline cache:', e);
      }
    }
    
    return null;
  };

  return {
    isOfflineMode,
    isOnline,
    saveOfflineData,
    getOfflineData,
  };
}
