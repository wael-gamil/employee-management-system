<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-all duration-300">
    <!-- Loading Screen -->
    <LoadingScreen v-if="isLoading" />

    <!-- Login Screen -->
    <LoginScreen v-else-if="!isAuthenticated" />

    <!-- Main Application -->
    <MainLayout v-else />

    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import LoadingScreen from '@/components/LoadingScreen.vue'
import LoginScreen from '@/components/LoginScreen.vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import ToastContainer from '@/components/ToastContainer.vue'

export default {
  name: 'EmployeeManagementSystem',  components: {
    LoadingScreen,
    LoginScreen,
    MainLayout,
    ToastContainer
  },
  setup() {
    const { 
      isLoading, 
      isAuthenticated, 
      setLoading, 
      initializeAuth 
    } = useAuthStore()
      const { 
      initializeTheme, 
      closeAllDropdowns,
      redirectToAuthorizedView 
    } = useUIStore()

    onMounted(async () => {
      // Initialize theme
      initializeTheme()
      
      // Initialize authentication (check for stored session)
      initializeAuth()
      
      // Simulate initial loading
      setTimeout(async () => {
        setLoading(false)
        
        // Redirect to authorized view if user is authenticated
        if (isAuthenticated.value) {
          redirectToAuthorizedView()
          
          // Add some initial sample notifications if user is authenticated
          try {
            const { useNotificationStore } = await import('@/stores/notificationStore');
            const notificationStore = useNotificationStore();
            
            // Add some sample notifications for demonstration
            setTimeout(() => {
              notificationStore.addNotification('SYSTEM_STARTUP', 'Employee Management System initialized successfully');
            }, 1000);
            
            setTimeout(() => {
              notificationStore.addNotification('BACKUP_CREATED', 'Daily system backup completed successfully');
            }, 2000);
          } catch (error) {
            console.warn('Could not add initial notifications:', error);
          }
        }
      }, 2000)

      // Close dropdowns when clicking outside
      document.addEventListener('click', (e) => {
        // Check if the click is outside dropdown elements
        const isDropdownClick = e.target.closest('.dropdown-container') || 
                               e.target.closest('[data-dropdown]') ||
                               e.target.closest('button[data-dropdown-toggle]')
        
        if (!isDropdownClick) {
          closeAllDropdowns()
        }
      })

      // Handle escape key to close dropdowns
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeAllDropdowns()
        }
      })
    })

    return {
      isLoading,
      isAuthenticated
    }
  }
}
</script>

<style scoped>
/* Custom animations and transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
