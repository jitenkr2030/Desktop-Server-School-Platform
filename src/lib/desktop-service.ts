import { invoke } from '@tauri-apps/api/core';
import { sep } from '@tauri-apps/api/path';

export interface DatabaseConfig {
  path: string;
  provider: 'sqlite' | 'postgresql';
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingChanges: number;
}

export interface DownloadProgress {
  contentId: string;
  progress: number;
  status: 'downloading' | 'completed' | 'failed';
}

class DesktopService {
  private isDesktop = false;

  async initialize(): Promise<void> {
    try {
      // Check if running in Tauri environment
      await invoke('get_app_version');
      this.isDesktop = true;
      console.log('Desktop mode initialized');
    } catch (error) {
      console.log('Running in web mode');
      this.isDesktop = false;
    }
  }

  get isDesktopMode(): boolean {
    return this.isDesktop;
  }

  async getDatabasePath(): Promise<string> {
    if (!this.isDesktop) {
      return '/tmp/school-platform.db';
    }
    return await invoke('get_database_path');
  }

  async getAppDataDir(): Promise<string> {
    if (!this.isDesktop) {
      return '/tmp/school-platform';
    }
    return await invoke('get_app_data_dir');
  }

  async checkNetworkStatus(): Promise<boolean> {
    if (!this.isDesktop) {
      return navigator.onLine;
    }
    return await invoke('check_network_status');
  }

  async syncData(): Promise<SyncStatus> {
    if (!this.isDesktop) {
      return {
        isOnline: navigator.onLine,
        lastSync: null,
        pendingChanges: 0,
      };
    }
    return await invoke('sync_data');
  }

  async downloadContent(contentId: string, url: string): Promise<DownloadProgress> {
    if (!this.isDesktop) {
      return {
        contentId,
        progress: 100,
        status: 'completed',
      };
    }
    return await invoke('download_content', { contentId, url });
  }

  async showNotification(title: string, body: string): Promise<void> {
    if (!this.isDesktop) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      }
      return;
    }
    return await invoke('show_notification', { title, body });
  }

  async getAppVersion(): Promise<string> {
    if (!this.isDesktop) {
      return '1.0.0-web';
    }
    return await invoke('get_app_version');
  }

  async getPlatformInfo(): Promise<{ os: string; arch: string }> {
    if (!this.isDesktop) {
      return {
        os: navigator.platform,
        arch: navigator.userAgent,
      };
    }
    return await invoke('platform_info');
  }

  async restartApp(): Promise<void> {
    if (this.isDesktop) {
      return await invoke('restart_app');
    }
    window.location.reload();
  }

  // Database utilities for desktop
  async executeQuery<T>(query: string, params?: Record<string, unknown>): Promise<T[]> {
    if (!this.isDesktop) {
      console.warn('Database queries only available in desktop mode');
      return [];
    }
    const result = await invoke<{ data: T[] }>('execute_database_query', { query });
    return result.data || [];
  }
}

export const desktopService = new DesktopService();
export default desktopService;
