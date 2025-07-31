import { ref, computed } from 'vue'

// Singleton instance
let storeInstance = null

export function useNotificationStore() {
  // Return existing instance if available
  if (storeInstance) {
    return storeInstance
  }

  // Notifications state
  const notifications = ref([])
  const isNotificationPanelOpen = ref(false)
  // Computed
  const recentNotifications = computed(() => 
    notifications.value
      .filter(n => n && n.id && n.timestamp) // Filter out invalid notifications
      .slice(0, 10)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  )
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => n && n.id && !n.read)
  )

  const unreadCount = computed(() => 
    unreadNotifications.value.length
  )

  // Notification types and their configurations
  const notificationTypes = {
    USER_LOGIN: {
      icon: 'UserIcon',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      title: 'User Login'
    },
    USER_LOGOUT: {
      icon: 'ArrowRightOnRectangleIcon',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      title: 'User Logout'
    },
    EMPLOYEE_CREATED: {
      icon: 'UserPlusIcon',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      title: 'Employee Created'
    },
    EMPLOYEE_UPDATED: {
      icon: 'PencilSquareIcon',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      title: 'Employee Updated'
    },
    EMPLOYEE_DELETED: {
      icon: 'TrashIcon',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      title: 'Employee Deleted'
    },
    COMPANY_CREATED: {
      icon: 'BuildingOfficeIcon',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      title: 'Company Created'
    },
    COMPANY_UPDATED: {
      icon: 'PencilSquareIcon',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      title: 'Company Updated'
    },
    DEPARTMENT_CREATED: {
      icon: 'RectangleGroupIcon',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      title: 'Department Created'
    },
    DEPARTMENT_UPDATED: {
      icon: 'PencilSquareIcon',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      title: 'Department Updated'
    },
    SETTINGS_UPDATED: {
      icon: 'CogIcon',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      title: 'Settings Updated'
    },
    BACKUP_CREATED: {
      icon: 'CloudArrowUpIcon',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      title: 'Backup Created'
    },
    SETTINGS_IMPORTED: {
      icon: 'ArrowDownTrayIcon',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      title: 'Settings Imported'
    },
    USER_CREATED: {
      icon: 'UserPlusIcon',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      title: 'User Created'
    },
    USER_UPDATED: {
      icon: 'PencilSquareIcon',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      title: 'User Updated'
    },
    USER_STATUS_CHANGED: {
      icon: 'UserIcon',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      title: 'User Status Changed'
    },
    REPORT_GENERATED: {
      icon: 'DocumentChartBarIcon',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      title: 'Report Generated'
    },
    REPORT_EXPORTED: {
      icon: 'ArrowDownTrayIcon',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      title: 'Report Exported'
    },
    THEME_CHANGED: {
      icon: 'SwatchIcon',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      title: 'Theme Changed'
    },
    MAINTENANCE_MODE: {
      icon: 'ExclamationTriangleIcon',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      title: 'Maintenance Mode'
    }
  }  // Add notification
  const addNotification = (type, message, details = {}) => {
    const notification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      message,
      details,
      timestamp: new Date().toISOString(),
      read: false,
      ...notificationTypes[type]
    }

    notifications.value.unshift(notification)
    
    // Keep only last 100 notifications
    if (notifications.value.length > 100) {
      notifications.value = notifications.value.slice(0, 100)
    }

    // Save to localStorage
    saveNotifications()
    
    return notification
  }  // Mark notification as read
  const markAsRead = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      saveNotifications()
    }
  }
  // Mark all as read
  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
    saveNotifications()
  }
  // Clear all notifications
  const clearAllNotifications = () => {
    notifications.value = []
    saveNotifications()
  }
  // Remove notification
  const removeNotification = (notificationId) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index > -1) {
      notifications.value.splice(index, 1)
      saveNotifications()
    }
  }

  // Toggle notification panel
  const toggleNotificationPanel = () => {
    isNotificationPanelOpen.value = !isNotificationPanelOpen.value
  }

  // Save notifications to localStorage
  const saveNotifications = () => {
    localStorage.setItem('ems_notifications', JSON.stringify({
      notifications: notifications.value,
      unreadCount: unreadCount.value
    }))
  }
  // Load notifications from localStorage
  const loadNotifications = () => {
    const saved = localStorage.getItem('ems_notifications')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        notifications.value = data.notifications || []
        // Note: unreadCount is computed, so we don't set it directly
      } catch (error) {
        console.error('Failed to load notifications:', error)
      }
    }
  }

  // Get notification type configuration
  const getNotificationConfig = (type) => {
    return notificationTypes[type] || {
      icon: 'BellIcon',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      title: 'Notification'
    }
  }

  // Format notification time
  const formatNotificationTime = (timestamp) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return notificationTime.toLocaleDateString()
  }
  // Initialize
  loadNotifications()

  // Create and store the singleton instance
  storeInstance = {
    // State
    notifications,
    unreadCount,
    isNotificationPanelOpen,
    
    // Computed
    recentNotifications,
    unreadNotifications,
    
    // Actions
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    removeNotification,
    toggleNotificationPanel,
    getNotificationConfig,
    formatNotificationTime
  }

  return storeInstance
}
