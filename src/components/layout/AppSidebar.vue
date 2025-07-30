<template>
  <div :class="['bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 z-30', sidebarOpen ? 'w-64' : 'w-16']">
    <div class="p-4">
      <div class="flex items-center space-x-3">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <div v-show="sidebarOpen" class="transition-all duration-300">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">EMS</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">Management System</p>
        </div>
      </div>
    </div>

    <nav class="mt-8">
      <div v-for="item in menuItems" :key="item.id" class="px-4 mb-2">
        <button 
          @click="currentView = item.id"
          :class="[
            'w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-700',
            currentView === item.id ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span v-show="sidebarOpen" class="font-medium">{{ item.name }}</span>
        </button>
      </div>
    </nav>

    <div class="absolute bottom-4 left-4 right-4">
      <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-bold">{{ currentUser.name.charAt(0) }}</span>
        </div>
        <div v-show="sidebarOpen" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ currentUser.name }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ currentUser.role }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import IconComponents from '@/utils/iconComponents'

export default {
  name: 'AppSidebar',
  components: {
    ...IconComponents
  },
  setup() {
    const { sidebarOpen, currentView, menuItems } = useUIStore()
    const { currentUser } = useAuthStore()

    return {
      sidebarOpen,
      currentView,
      menuItems,
      currentUser
    }
  }
}
</script>
