// Real-Time Notification Service using WebSocket

import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

// Notification Types
export type NotificationType =
  | 'VERIFICATION_STATUS_CHANGED'
  | 'DOCUMENT_REVIEWED'
  | 'APPROVED'
  | 'REJECTED'
  | 'REQUIRES_MORE_INFO'
  | 'DEADLINE_REMINDER'
  | 'SYSTEM_ANNOUNCEMENT'
  | 'NEW_MESSAGE'

export interface NotificationPayload {
  id: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  timestamp: Date
  read: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

interface ConnectedClient {
  id: string
  userId: string
  tenantId?: string
  role: 'ADMIN' | 'TENANT' | 'USER'
  connectedAt: Date
  lastActivity: Date
  subscriptions: Set<string>
}

// Notification Event Types
interface NotificationEvents {
  'subscribe': (channels: string[]) => void
  'unsubscribe': (channels: string[]) => void
  'notification': (notification: NotificationPayload) => void
  'read': (notificationId: string) => void
  'markAllRead': () => void
  'error': (error: { message: string; code: string }) => void
}

interface AdminEvents {
  'broadcast': (notification: NotificationPayload) => void
  'sendToTenant': (tenantId: string, notification: NotificationPayload) => void
  'sendToRole': (role: string, notification: NotificationPayload) => void
  'getConnectedClients': () => ConnectedClient[]
  'getStatistics': () => NotificationStatistics
}

// Real-Time Notification Manager
export class NotificationManager {
  private io: SocketIOServer | null = null
  private clients: Map<string, ConnectedClient> = new Map()
  private notificationHistory: Map<string, NotificationPayload[]> = new Map()
  private maxHistoryPerChannel: number = 100

  initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    })

    this.setupEventHandlers()
    console.log('Notification manager initialized')
  }

  private setupEventHandlers(): void {
    if (!this.io) return

    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`)

      // Handle client authentication
      socket.on('authenticate', (data: { userId: string; tenantId?: string; role: string }) => {
        this.handleAuthentication(socket, data)
      })

      // Handle subscription to channels
      socket.on('subscribe', (channels: string[]) => {
        this.handleSubscription(socket, channels)
      })

      socket.on('unsubscribe', (channels: string[]) => {
        this.handleUnsubscription(socket, channels)
      })

      // Handle notification acknowledgment
      socket.on('markRead', (notificationId: string) => {
        this.handleMarkRead(socket, notificationId)
      })

      socket.on('markAllRead', () => {
        this.handleMarkAllRead(socket)
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnection(socket)
      })
    })
  }

  private handleAuthentication(socket: Socket, data: { userId: string; tenantId?: string; role: string }): void {
    const client: ConnectedClient = {
      id: socket.id,
      userId: data.userId,
      tenantId: data.tenantId,
      role: data.role as 'ADMIN' | 'TENANT' | 'USER',
      connectedAt: new Date(),
      lastActivity: new Date(),
      subscriptions: new Set(['notifications'])
    }

    this.clients.set(socket.id, client)
    socket.emit('authenticated', { clientId: socket.id })
    console.log(`Client ${socket.id} authenticated as ${data.role}`)
  }

  private handleSubscription(socket: Socket, channels: string[]): void {
    const client = this.clients.get(socket.id)
    if (!client) {
      socket.emit('error', { message: 'Not authenticated', code: 'AUTH_REQUIRED' })
      return
    }

    channels.forEach(channel => {
      client.subscriptions.add(channel)
      socket.join(channel)
    })

    // Send recent notifications for each subscribed channel
    channels.forEach(channel => {
      const history = this.notificationHistory.get(channel) || []
      socket.emit('notificationHistory', { channel, notifications: history.slice(-10) })
    })

    console.log(`Client ${socket.id} subscribed to: ${channels.join(', ')}`)
  }

  private handleUnsubscription(socket: Socket, channels: string[]): void {
    const client = this.clients.get(socket.id)
    if (!client) return

    channels.forEach(channel => {
      client.subscriptions.delete(channel)
      socket.leave(channel)
    })

    console.log(`Client ${socket.id} unsubscribed from: ${channels.join(', ')}`)
  }

  private handleMarkRead(socket: Socket, notificationId: string): void {
    const client = this.clients.get(socket.id)
    if (!client) return

    // Update notification in all channels the client is subscribed to
    client.subscriptions.forEach(channel => {
      const history = this.notificationHistory.get(channel)
      if (history) {
        const notification = history.find(n => n.id === notificationId)
        if (notification) {
          notification.read = true
        }
      }
    })
  }

  private handleMarkAllRead(socket: Socket): void {
    const client = this.clients.get(socket.id)
    if (!client) return

    client.subscriptions.forEach(channel => {
      const history = this.notificationHistory.get(channel)
      if (history) {
        history.forEach(n => { n.read = true })
      }
    })
  }

  private handleDisconnection(socket: Socket): void {
    this.clients.delete(socket.id)
    console.log(`Client disconnected: ${socket.id}`)
  }

  // Public methods for sending notifications
  sendToChannel(channel: string, notification: Omit<NotificationPayload, 'id' | 'timestamp'>): void {
    if (!this.io) return

    const fullNotification: NotificationPayload = {
      ...notification,
      id: uuidv4(),
      timestamp: new Date()
    }

    // Store in history
    this.storeNotification(channel, fullNotification)

    // Broadcast to channel
    this.io.to(channel).emit('notification', fullNotification)
    console.log(`Notification sent to channel ${channel}: ${notification.type}`)
  }

  sendToTenant(tenantId: string, notification: Omit<NotificationPayload, 'id' | 'timestamp'>): void {
    this.sendToChannel(`tenant:${tenantId}`, notification)
  }

  sendToUser(userId: string, notification: Omit<NotificationPayload, 'id' | 'timestamp'>): void {
    this.sendToChannel(`user:${userId}`, notification)
  }

  sendToRole(role: 'ADMIN' | 'TENANT', notification: Omit<NotificationPayload, 'id' | 'timestamp'>): void {
    // Find all clients with this role
    this.clients.forEach((client, socketId) => {
      if (client.role === role) {
        const socket = this.io?.sockets.sockets.get(socketId)
        socket?.emit('notification', {
          ...notification,
          id: uuidv4(),
          timestamp: new Date()
        })
      }
    })
  }

  broadcast(notification: Omit<NotificationPayload, 'id' | 'timestamp'>): void {
    if (!this.io) return

    const fullNotification: NotificationPayload = {
      ...notification,
      id: uuidv4(),
      timestamp: new Date()
    }

    // Store in global history
    this.storeNotification('global', fullNotification)

    // Broadcast to all connected clients
    this.io.emit('notification', fullNotification)
    console.log(`Broadcast notification: ${notification.type}`)
  }

  private storeNotification(channel: string, notification: NotificationPayload): void {
    const history = this.notificationHistory.get(channel) || []
    history.push(notification)

    // Trim history to max size
    while (history.length > this.maxHistoryPerChannel) {
      history.shift()
    }

    this.notificationHistory.set(channel, history)
  }

  // Statistics and monitoring
  getStatistics(): NotificationStatistics {
    const clientCount = this.clients.size
    const roleDistribution: Record<string, number> = {}

    this.clients.forEach(client => {
      roleDistribution[client.role] = (roleDistribution[client.role] || 0) + 1
    })

    return {
      connectedClients: clientCount,
      roleDistribution,
      channels: Array.from(this.notificationHistory.keys()),
      historySize: Array.from(this.notificationHistory.values()).reduce((sum, h) => sum + h.length, 0),
      uptime: process.uptime()
    }
  }

  getConnectedClients(): ConnectedClient[] {
    return Array.from(this.clients.values())
  }

  // Helper methods for creating specific notifications
  createStatusChangeNotification(
    tenantId: string,
    tenantName: string,
    oldStatus: string,
    newStatus: string
  ): NotificationPayload {
    const type = this.getStatusNotificationType(newStatus)
    const message = this.getStatusMessage(newStatus, tenantName)

    return {
      id: '',
      type,
      title: this.getStatusTitle(newStatus),
      message,
      data: { tenantId, tenantName, oldStatus, newStatus },
      timestamp: new Date(),
      read: false,
      priority: this.getStatusPriority(newStatus)
    }
  }

  private getStatusNotificationType(status: string): NotificationType {
    const mapping: Record<string, NotificationType> = {
      'APPROVED': 'APPROVED',
      'REJECTED': 'REJECTED',
      'REQUIRES_MORE_INFO': 'REQUIRES_MORE_INFO',
      'UNDER_REVIEW': 'DOCUMENT_REVIEWED'
    }
    return mapping[status] || 'VERIFICATION_STATUS_CHANGED'
  }

  private getStatusTitle(status: string): string {
    const titles: Record<string, string> = {
      'APPROVED': 'Verification Approved!',
      'REJECTED': 'Verification Update',
      'REQUIRES_MORE_INFO': 'Additional Information Required',
      'UNDER_REVIEW': 'Documents Under Review',
      'PENDING': 'Application Received'
    }
    return titles[status] || 'Status Update'
  }

  private getStatusMessage(status: string, tenantName: string): string {
    const messages: Record<string, string> = {
      'APPROVED': `Congratulations! Your verification for ${tenantName} has been approved. You now have full access to all platform features.`,
      'REJECTED': `We regret to inform you that your verification for ${tenantName} could not be approved at this time.`,
      'REQUIRES_MORE_INFO': `Additional information is required to complete your verification for ${tenantName}.`,
      'UNDER_REVIEW': `Your verification documents for ${tenantName} are now being reviewed by our team.`,
      'PENDING': `We have received your verification application for ${tenantName} and it is being processed.`
    }
    return messages[status] || `Your verification status has been updated to ${status}.`
  }

  private getStatusPriority(status: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    const priorities: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = {
      'APPROVED': 'LOW',
      'REJECTED': 'HIGH',
      'REQUIRES_MORE_INFO': 'MEDIUM',
      'UNDER_REVIEW': 'LOW',
      'PENDING': 'LOW'
    }
    return priorities[status] || 'MEDIUM'
  }
}

interface NotificationStatistics {
  connectedClients: number
  roleDistribution: Record<string, number>
  channels: string[]
  historySize: number
  uptime: number
}

// Export singleton
export const notificationManager = new NotificationManager()

// Utility function for creating notification templates
export function createNotificationTemplate(
  type: NotificationType,
  data: Record<string, any>
): Omit<NotificationPayload, 'id' | 'timestamp'> {
  const templates: Record<NotificationType, Omit<NotificationPayload, 'id' | 'timestamp'>> = {
    VERIFICATION_STATUS_CHANGED: {
      type,
      title: 'Status Updated',
      message: 'Your verification status has been updated.',
      data,
      read: false,
      priority: 'MEDIUM'
    },
    DOCUMENT_REVIEWED: {
      type,
      title: 'Document Reviewed',
      message: 'One of your verification documents has been reviewed.',
      data,
      read: false,
      priority: 'LOW'
    },
    APPROVED: {
      type,
      title: 'Verification Approved!',
      message: 'Congratulations! Your verification has been approved.',
      data,
      read: false,
      priority: 'LOW'
    },
    REJECTED: {
      type,
      title: 'Verification Not Approved',
      message: 'Unfortunately, your verification could not be approved.',
      data,
      read: false,
      priority: 'HIGH'
    },
    REQUIRES_MORE_INFO: {
      type,
      title: 'More Information Needed',
      message: 'Additional information is required for your verification.',
      data,
      read: false,
      priority: 'MEDIUM'
    },
    DEADLINE_REMINDER: {
      type,
      title: 'Deadline Reminder',
      message: 'Your verification deadline is approaching.',
      data,
      read: false,
      priority: 'MEDIUM'
    },
    SYSTEM_ANNOUNCEMENT: {
      type,
      title: 'System Announcement',
      message: 'A system announcement has been made.',
      data,
      read: false,
      priority: 'LOW'
    },
    NEW_MESSAGE: {
      type,
      title: 'New Message',
      message: 'You have a new message.',
      data,
      read: false,
      priority: 'MEDIUM'
    }
  }

  return templates[type]
}
