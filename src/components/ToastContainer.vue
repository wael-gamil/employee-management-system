<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'max-w-sm bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 transition-all duration-300 transform',
        getToastClasses(toast.type)
      ]"
    >
      <div class="flex items-start space-x-3">
        <div :class="['flex-shrink-0', getIconClasses(toast.type)]">
          <component :is="getToastIcon(toast.type)" class="w-5 h-5" />
        </div>        <div class="flex-1 min-w-0">
          <p v-if="toast.title" :class="['text-sm font-medium', getTextClasses(toast.type)]">
            {{ toast.title }}
          </p>
          <p :class="['text-sm', toast.title ? 'font-normal text-opacity-90' : 'font-medium', getTextClasses(toast.type)]">
            {{ toast.message }}
          </p>
        </div>
        <button
          @click="removeToast(toast.id)"
          :class="['flex-shrink-0 hover:opacity-75', getTextClasses(toast.type)]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useToastStore } from '@/stores/toastStore'
import IconComponents from '@/utils/iconComponents'

export default {
  name: 'ToastContainer',
  components: {
    ...IconComponents
  },
  setup() {
    const { toasts, removeToast } = useToastStore()

    const getToastClasses = (type) => {
      const classes = {
        success: 'border-green-200 dark:border-green-700',
        error: 'border-red-200 dark:border-red-700',
        warning: 'border-yellow-200 dark:border-yellow-700',
        info: 'border-blue-200 dark:border-blue-700'
      }
      return classes[type] || classes.info
    }

    const getIconClasses = (type) => {
      const classes = {
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500'
      }
      return classes[type] || classes.info
    }

    const getTextClasses = (type) => {
      const classes = {
        success: 'text-green-800 dark:text-green-200',
        error: 'text-red-800 dark:text-red-200',
        warning: 'text-yellow-800 dark:text-yellow-200',
        info: 'text-blue-800 dark:text-blue-200'
      }
      return classes[type] || classes.info
    }

    const getToastIcon = (type) => {
      const icons = {
        success: 'CheckCircleIcon',
        error: 'ExclamationTriangleIcon',
        warning: 'ExclamationTriangleIcon',
        info: 'BellIcon'
      }
      return icons[type] || icons.info
    }

    return {
      toasts,
      removeToast,
      getToastClasses,
      getIconClasses,
      getTextClasses,
      getToastIcon
    }
  }
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
