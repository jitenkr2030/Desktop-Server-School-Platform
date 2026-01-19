import { createContext, useContext, ReactNode } from 'react';
import { usePlatform, useOfflineMode } from '@/hooks/usePlatform';
import desktopService from '@/lib/desktop-service';

interface PlatformContextType {
  platform: 'desktop' | 'web' | 'mobile';
  isDesktop: boolean;
  isWeb: boolean;
  isOnline: boolean;
  isOfflineMode: boolean;
  isLoading: boolean;
  appVersion: string;
  databaseProvider: 'sqlite' | 'postgresql';
  storageUsed: number;
  storageLimit: number;
  initializeDesktop: () => Promise<void>;
  syncData: () => Promise<void>;
  downloadForOffline: (contentId: string, title: string, type: 'course' | 'lesson' | 'resource') => Promise<boolean>;
  removeOfflineContent: (contentId: string) => Promise<void>;
}

const PlatformContext = createContext<PlatformContextType | null>(null);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const platformInfo = usePlatform();
  const { isOfflineMode, isOnline, saveOfflineData, getOfflineData } = useOfflineMode();
  
  const [storageUsed, setStorageUsed] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (platformInfo.isDesktop && !isInitialized) {
        await desktopService.initialize();
        setIsInitialized(true);
        
        // Calculate storage used
        const storageInfo = await offlineManager.getStorageInfo();
        setStorageUsed(storageInfo.used);
      }
    }
    
    initialize();
  }, [platformInfo.isDesktop, isInitialized]);

  const value: PlatformContextType = {
    platform: platformInfo.platform,
    isDesktop: platformInfo.isDesktop,
    isWeb: platformInfo.isWeb,
    isOnline: platformInfo.isOnline,
    isOfflineMode,
    isLoading: platformInfo.isLoading,
    appVersion: platformInfo.version,
    databaseProvider: 'sqlite', // Will be determined from environment
    storageUsed,
    storageLimit: 5 * 1024 * 1024 * 1024,
    initializeDesktop: async () => {
      await desktopService.initialize();
      setIsInitialized(true);
    },
    syncData: async () => {
      if (platformInfo.isDesktop) {
        await desktopService.syncData();
      }
    },
    downloadForOffline: async (contentId: string, title: string, type) => {
      const success = await offlineManager.downloadForOffline(contentId, title, type);
      if (success) {
        const storageInfo = await offlineManager.getStorageInfo();
        setStorageUsed(storageInfo.used);
      }
      return success;
    },
    removeOfflineContent: async (contentId: string) => {
      await offlineManager.removeFromOffline(contentId);
      const storageInfo = await offlineManager.getStorageInfo();
      setStorageUsed(storageInfo.used);
    },
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatformContext() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatformContext must be used within a PlatformProvider');
  }
  return context;
}

// Import missing dependencies
import { useEffect, useState } from 'react';
import offlineManager from '@/lib/offline-manager';
