// Mobile Push Notification Service

import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

// Push Notification Configuration
interface PushNotificationConfig {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: Record<string, string>
  actions?: NotificationAction[]
  priority?: 'high' | 'normal'
  ttl?: number // Time to live in seconds
}

interface NotificationAction {
  action: string
  title: string
  icon?: string
  destructive?: boolean
  foreground?: boolean
}

// Device Registration
interface DeviceRegistration {
  id: string
  userId: string
  tenantId?: string
  deviceToken: string
  platform: 'ios' | 'android' | 'web'
  appVersion: string
  osVersion: string
  lastActive: Date
  preferences: NotificationPreferences
}

interface NotificationPreferences {
  enabled: boolean
  categories: {
    verification: boolean
    documents: boolean
    deadlines: boolean
    announcements: boolean
    messages: boolean
  }
  quietHours?: {
    enabled: boolean
    start: string // HH:mm format
    end: string
    timezone: string
  }
}

// Push Notification Service
export class PushNotificationService {
  private apnProvider: any // Would be initialized with actual provider
  private fcmProvider: any // Would be initialized with actual provider
  private webPush: any // Would be initialized with web-push library

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders(): void {
    // In production, initialize actual push notification providers
    // Example: OneSignal, Firebase Cloud Messaging, Apple Push Notification Service
    
    // For now, we simulate the initialization
    console.log('Push notification providers initialized')
  }

  // Device Registration
  async registerDevice(
    userId: string,
    tenantId: string | undefined,
    deviceToken: string,
    platform: 'ios' | 'android' | 'web',
    metadata: { appVersion: string; osVersion: string }
  ): Promise<DeviceRegistration> {
    // Check if device already registered
    const existing = await prisma.pushDevice.findFirst({
      where: { deviceToken }
    })

    if (existing) {
      // Update existing registration
      return prisma.pushDevice.update({
        where: { id: existing.id },
        data: {
          userId,
          tenantId,
          lastActive: new Date(),
          preferences: {
            enabled: true,
            categories: {
              verification: true,
              documents: true,
              deadlines: true,
              announcements: true,
              messages: true
            }
          }
        }
      }) as Promise<DeviceRegistration>
    }

    // Create new registration
    return prisma.pushDevice.create({
      data: {
        id: uuidv4(),
        userId,
        tenantId,
        deviceToken,
        platform,
        appVersion: metadata.appVersion,
        osVersion: metadata.osVersion,
        lastActive: new Date(),
        preferences: {
          enabled: true,
          categories: {
            verification: true,
            documents: true,
            deadlines: true,
            announcements: true,
            messages: true
          }
        }
      }
    }) as Promise<DeviceRegistration>
  }

  async unregisterDevice(deviceToken: string): Promise<void> {
    await prisma.pushDevice.deleteMany({
      where: { deviceToken }
    })
  }

  async updateDevicePreferences(
    deviceToken: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    const device = await prisma.pushDevice.findFirst({
      where: { deviceToken }
    })

    if (!device) {
      throw new Error('Device not found')
    }

    await prisma.pushDevice.update({
      where: { id: device.id },
      data: {
        preferences: { ...device.preferences, ...preferences } as any,
        lastActive: new Date()
      }
    })
  }

  // Push Notification Sending
  async sendNotification(
    userId: string,
    config: PushNotificationConfig,
    category?: keyof NotificationPreferences['categories']
  ): Promise<PushResult> {
    // Get user's registered devices
    const devices = await prisma.pushDevice.findMany({
      where: {
        userId,
        'preferences->enabled': true
      }
    })

    if (devices.length === 0) {
      return { success: 0, failed: 0, results: [] }
    }

    // Filter devices based on category preferences
    const eligibleDevices = category
      ? devices.filter(d => d.preferences.categories?.[category] !== false)
      : devices

    const results: DeviceResult[] = []

    for (const device of eligibleDevices) {
      try {
        let result: 'success' | 'failed'
        
        if (device.platform === 'ios') {
          result = await this.sendToAPNs(device.deviceToken, config)
        } else if (device.platform === 'android') {
          result = await this.sendToFCM(device.deviceToken, config)
        } else {
          result = await this.sendToWebPush(device.deviceToken, config)
        }

        results.push({
          deviceId: device.id,
          platform: device.platform,
          result
        })

        // Update device last active on success
        if (result === 'success') {
          await prisma.pushDevice.update({
            where: { id: device.id },
            data: { lastActive: new Date() }
          })
        }
      } catch (error) {
        results.push({
          deviceId: device.id,
          platform: device.platform,
          result: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const success = results.filter(r => r.result === 'success').length
    const failed = results.filter(r => r.result === 'failed').length

    return { success, failed, results }
  }

  async sendToTenant(
    tenantId: string,
    config: PushNotificationConfig,
    category?: keyof NotificationPreferences['categories']
  ): Promise<PushResult> {
    const devices = await prisma.pushDevice.findMany({
      where: {
        tenantId,
        'preferences->enabled': true
      }
    })

    // Aggregate results from all users in tenant
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { users: true }
    })

    if (!tenant) {
      return { success: 0, failed: 0, results: [] }
    }

    // Send to all users in the tenant
    let totalSuccess = 0
    let totalFailed = 0
    const allResults: DeviceResult[] = []

    for (const user of tenant.users) {
      const result = await this.sendNotification(user.clerkId, config, category)
      totalSuccess += result.success
      totalFailed += result.failed
      allResults.push(...result.results)
    }

    return { success: totalSuccess, failed: totalFailed, results: allResults }
  }

  async sendBroadcast(
    config: PushNotificationConfig,
    category?: keyof NotificationPreferences['categories']
  ): Promise<PushResult> {
    const devices = await prisma.pushDevice.findMany({
      where: {
        'preferences->enabled': true
      }
    })

    let totalSuccess = 0
    let totalFailed = 0
    const allResults: DeviceResult[] = []

    // Group devices by user
    const userDevices = new Map<string, any[]>()
    for (const device of devices) {
      const devices = userDevices.get(device.userId) || []
      devices.push(device)
      userDevices.set(device.userId, devices)
    }

    // Send to each user once
    for (const [userId, userDeviceList] of userDevices) {
      const result = await this.sendNotification(userId, config, category)
      totalSuccess += result.success
      totalFailed += result.failed
      allResults.push(...result.results)
    }

    return { success: totalSuccess, failed: totalFailed, results: allResults }
  }

  // Platform-specific sending methods
  private async sendToAPNs(deviceToken: string, config: PushNotificationConfig): Promise<'success' | 'failed'> {
    // In production, this would use actual APNs service
    // Example: node-apn or similar
    
    try {
      // Simulate APNs send
      console.log(`Sending APNs notification to ${deviceToken.substring(0, 10)}...`)
      await new Promise(resolve => setTimeout(resolve, 100))
      return 'success'
    } catch (error) {
      console.error('APNs send failed:', error)
      return 'failed'
    }
  }

  private async sendToFCM(deviceToken: string, config: PushNotificationConfig): Promise<'success' | 'failed'> {
    // In production, this would use Firebase Cloud Messaging
    
    try {
      console.log(`Sending FCM notification to ${deviceToken.substring(0, 10)}...`)
      await new Promise(resolve => setTimeout(resolve, 100))
      return 'success'
    } catch (error) {
      console.error('FCM send failed:', error)
      return 'failed'
    }
  }

  private async sendToWebPush(deviceToken: string, config: PushNotificationConfig): Promise<'success' | 'failed'> {
    // In production, this would use web-push library
    
    try {
      console.log(`Sending Web Push notification to subscriber...`)
      await new Promise(resolve => setTimeout(resolve, 100))
      return 'success'
    } catch (error) {
      console.error('Web Push send failed:', error)
      return 'failed'
    }
  }

  // Template-based notifications
  async sendVerificationStatusUpdate(
    userId: string,
    tenantId: string,
    tenantName: string,
    status: 'APPROVED' | 'REJECTED' | 'REQUIRES_MORE_INFO' | 'UNDER_REVIEW'
  ): Promise<PushResult> {
    const config = this.getStatusNotificationConfig(tenantName, status)
    return this.sendNotification(userId, config, 'verification')
  }

  async sendDeadlineReminder(
    userId: string,
    tenantId: string,
    tenantName: string,
    daysRemaining: number
  ): Promise<PushResult> {
    const title = daysRemaining === 1 ? 'Final Day!' : `${daysRemaining} Days Left`
    const body = daysRemaining === 1
      ? `Complete your verification for ${tenantName} today to maintain access.`
      : `Your verification for ${tenantName} is due in ${daysRemaining} days.`

    const config: PushNotificationConfig = {
      title,
      body,
      priority: daysRemaining <= 3 ? 'high' : 'normal',
      ttl: daysRemaining * 24 * 60 * 60, // TTL in seconds
      data: {
        type: 'DEADLINE_REMINDER',
        tenantId,
        daysRemaining: daysRemaining.toString()
      },
      actions: [
        {
          action: 'open_verification',
          title: 'Complete Now',
          foreground: true
        }
      ]
    }

    return this.sendNotification(userId, config, 'deadlines')
  }

  async sendDocumentUpdate(
    userId: string,
    tenantId: string,
    documentType: string,
    status: 'APPROVED' | 'REJECTED' | 'REVIEWED'
  ): Promise<PushResult> {
    const title = this.getDocumentStatusTitle(status)
    const body = this.getDocumentStatusBody(documentType, status)

    const config: PushNotificationConfig = {
      title,
      body,
      priority: status === 'REJECTED' ? 'high' : 'normal',
      data: {
        type: 'DOCUMENT_UPDATE',
        tenantId,
        documentType,
        status
      },
      actions: [
        {
          action: 'view_documents',
          title: 'View Details',
          foreground: true
        }
      ]
    }

    return this.sendNotification(userId, config, 'documents')
  }

  async sendAnnouncement(
    userId: string,
    tenantId: string | undefined,
    title: string,
    message: string,
    priority: 'high' | 'normal' = 'normal'
  ): Promise<PushResult> {
    const config: PushNotificationConfig = {
      title,
      body: message,
      priority,
      data: {
        type: 'ANNOUNCEMENT',
        announcementId: uuidv4()
      },
      actions: [
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }

    return this.sendNotification(userId, config, 'announcements')
  }

  // Helper methods
  private getStatusNotificationConfig(
    tenantName: string,
    status: string
  ): PushNotificationConfig {
    const configs: Record<string, PushNotificationConfig> = {
      APPROVED: {
        title: 'Verification Approved!',
        body: `Congratulations! Your verification for ${tenantName} has been approved. You now have full access.`,
        priority: 'normal',
        data: { type: 'APPROVED', tenantName }
      },
      REJECTED: {
        title: 'Verification Update',
        body: `We regret that your verification for ${tenantName} could not be approved. Please check for more details.`,
        priority: 'high',
        data: { type: 'REJECTED', tenantName }
      },
      REQUIRES_MORE_INFO: {
        title: 'More Information Needed',
        body: `Additional information is required to complete your verification for ${tenantName}.`,
        priority: 'high',
        data: { type: 'REQUIRES_MORE_INFO', tenantName }
      },
      UNDER_REVIEW: {
        title: 'Under Review',
        body: `Your verification for ${tenantName} is now being reviewed.`,
        priority: 'normal',
        data: { type: 'UNDER_REVIEW', tenantName }
      }
    }

    return configs[status] || configs.UNDER_REVIEW
  }

  private getDocumentStatusTitle(status: string): string {
    const titles: Record<string, string> = {
      APPROVED: 'Document Approved',
      REJECTED: 'Document Needs Attention',
      REVIEWED: 'Document Reviewed'
    }
    return titles[status] || 'Document Update'
  }

  private getDocumentStatusBody(documentType: string, status: string): string {
    const typeLabel = documentType.replace(/_/g, ' ').toLowerCase()
    
    const bodies: Record<string, string> = {
      APPROVED: `Your ${typeLabel} has been approved.`,
      REJECTED: `Your ${typeLabel} was not accepted. Please review the feedback and upload a new document.`,
      REVIEWED: `Your ${typeLabel} has been reviewed.`
    }

    return bodies[status] || 'Your document status has been updated.'
  }

  // Statistics
  async getNotificationStats(userId: string): Promise<NotificationStats> {
    const sentNotifications = await prisma.notificationLog.count({
      where: { userId }
    })

    const readNotifications = await prisma.notificationLog.count({
      where: {
        userId,
        readAt: { not: null }
      }
    })

    const devices = await prisma.pushDevice.count({
      where: { userId }
    })

    return {
      totalSent: sentNotifications,
      totalRead: readNotifications,
      readRate: sentNotifications > 0 ? (readNotifications / sentNotifications * 100).toFixed(1) + '%' : 'N/A',
      registeredDevices: devices
    }
  }
}

// Types
interface PushResult {
  success: number
  failed: number
  results: DeviceResult[]
}

interface DeviceResult {
  deviceId: string
  platform: string
  result: 'success' | 'failed'
  error?: string
}

interface NotificationStats {
  totalSent: number
  totalRead: number
  readRate: string
  registeredDevices: number
}

// Export singleton
export const pushNotificationService = new PushNotificationService()

// Client-side hook for push notifications (to be used in React components)
export const usePushNotifications = () => {
  // This would be a custom React hook in a real implementation
  // For now, it's a placeholder showing the intended API
  
  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('Push notifications not supported')
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    if ('serviceWorker' in navigator) {
      return navigator.serviceWorker.register('/sw.js')
    }
    return null
  }

  const subscribe = async (
    userId: string,
    tenantId: string | undefined
  ): Promise<PushSubscription | null> => {
    const sw = await registerServiceWorker()
    if (!sw) return null

    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    })

    // Send subscription to server
    await fetch('/api/notifications/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        userId,
        tenantId
      })
    })

    return subscription
  }

  const unsubscribe = async (): Promise<void> => {
    const sw = await navigator.serviceWorker.ready
    const subscription = await sw.pushManager.getSubscription()
    
    if (subscription) {
      await subscription.unsubscribe()
      await fetch('/api/notifications/unregister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        })
      })
    }
  }

  return {
    requestPermission,
    registerServiceWorker,
    subscribe,
    unsubscribe
  }
}
