import { ref } from 'vue'

// Singleton instance
let storeInstance = null

export function useToastStore() {
  // Return existing instance if available
  if (storeInstance) {
    return storeInstance
  }

  const toasts = ref([])

  const addToast = (toast) => {
    // Handle both object format and legacy string format
    let toastObj
    if (typeof toast === 'string') {
      // Legacy format: addToast(message, type, duration)
      const type = arguments[1] || 'info'
      const duration = arguments[2] || 4000
      toastObj = { message: toast, type, duration }
    } else if (toast && typeof toast === 'object') {
      // New object format
      toastObj = {
        message: toast.message || toast.title || 'Notification',
        type: toast.type || 'info',
        duration: toast.duration || 4000,
        title: toast.title
      }
    } else {
      console.warn('Invalid toast format:', toast)
      return
    }

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const finalToast = {
      id,
      ...toastObj,
      timestamp: new Date().toISOString()
    }

    toasts.value.push(finalToast)

    // Auto remove after duration
    if (finalToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, finalToast.duration)
    }

    return finalToast
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  // Create and store the singleton instance
  storeInstance = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts
  }

  return storeInstance
}
