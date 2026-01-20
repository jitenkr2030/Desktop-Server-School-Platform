import { desktopService } from '@/lib/desktop-service';

export interface OfflineContent {
  id: string;
  title: string;
  type: 'course' | 'lesson' | 'resource';
  size: number;
  downloadedAt: string;
  path: string;
}

export interface StorageInfo {
  used: number;
  available: number;
  limit: number;
}

class OfflineManager {
  private contentCache: Map<string, OfflineContent> = new Map();
  private readonly STORAGE_LIMIT = 5 * 1024 * 1024 * 1024; // 5GB default

  async initialize(): Promise<void> {
    await desktopService.initialize();
    await this.loadCachedContent();
  }

  private async loadCachedContent(): Promise<void> {
    // Load cached content from localStorage
    const cached = localStorage.getItem('offline_content');
    if (cached) {
      const contents: OfflineContent[] = JSON.parse(cached);
      contents.forEach((content) => {
        this.contentCache.set(content.id, content);
      });
    }
  }

  private saveCachedContent(): void {
    const contents = Array.from(this.contentCache.values());
    localStorage.setItem('offline_content', JSON.stringify(contents));
  }

  async downloadForOffline(contentId: string, title: string, type: OfflineContent['type']): Promise<boolean> {
    try {
      const contentDir = await desktopService.getAppDataDir();
      const contentPath = `${contentDir}/offline/${contentId}`;
      
      // Add to cache
      const content: OfflineContent = {
        id: contentId,
        title,
        type,
        size: 0,
        downloadedAt: new Date().toISOString(),
        path: contentPath,
      };
      
      this.contentCache.set(contentId, content);
      this.saveCachedContent();
      
      return true;
    } catch (error) {
      console.error('Failed to download for offline:', error);
      return false;
    }
  }

  async removeFromOffline(contentId: string): Promise<boolean> {
    try {
      this.contentCache.delete(contentId);
      this.saveCachedContent();
      return true;
    } catch (error) {
      console.error('Failed to remove from offline:', error);
      return false;
    }
  }

  getOfflineContent(): OfflineContent[] {
    return Array.from(this.contentCache.values());
  }

  async isContentOffline(contentId: string): Promise<boolean> {
    return this.contentCache.has(contentId);
  }

  async getStorageInfo(): Promise<StorageInfo> {
    const contentDir = await desktopService.getAppDataDir();
    
    // Calculate used space
    let used = 0;
    for (const content of this.contentCache.values()) {
      used += content.size;
    }
    
    return {
      used,
      available: this.STORAGE_LIMIT - used,
      limit: this.STORAGE_LIMIT,
    };
  }

  async clearAllOffline(): Promise<void> {
    this.contentCache.clear();
    this.saveCachedContent();
  }
}

export const offlineManager = new OfflineManager();
export default offlineManager;
