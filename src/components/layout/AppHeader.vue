<template>
  <header
    class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
  >
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center space-x-4">
        <button
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <svg
            class="w-5 h-5 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ getCurrentViewTitle() }}
          </h2>
          <p
            v-if="currentUser"
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            Welcome back, {{ currentUser.name }}
            <span
              class="inline-flex items-center px-2 py-1 ml-2 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
            >
              {{ currentUser.role }}
            </span>
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Toggle theme"
        >
          <svg
            v-if="isDark"
            class="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
            />
          </svg>
        </button>
        <!-- Notifications -->
        <div class="relative notifications-container">
          <button
            @click="toggleNotifications"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative"
            title="Notifications"
          >
            <svg
              class="w-5 h-5 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v3.5"
              ></path>
            </svg>
            <span
              v-if="notificationStore.unreadCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ notificationStore.unreadCount }}
            </span>
          </button>
          <!-- Notifications Dropdown -->
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
            style="z-index: 9999"
          >
            <div
              class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
            >
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              <button
                v-if="notificationStore.unreadCount > 0"
                @click="notificationStore.markAllAsRead"
                class="text-sm text-blue-600 hover:text-blue-500"
              >
                Mark all read
              </button>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <div
                v-if="notifications.length === 0"
                class="p-4 text-center text-gray-500 dark:text-gray-400"
              >
                No notifications
              </div>
              <div
                v-for="notification in notifications"
                :key="notification?.id || Math.random()"
                :class="[
                  'p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
                  !notification?.read ? 'bg-blue-50 dark:bg-blue-900/10' : '',
                ]"
                @click="
                  notification?.id && markNotificationAsRead(notification.id)
                "
              >
                <div class="flex items-start space-x-3">
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      notification?.bgColor || 'bg-blue-100',
                    ]"
                  >
                    <component
                      :is="notification?.icon || 'BellIcon'"
                      :class="[
                        'w-4 h-4',
                        notification?.color || 'text-blue-600',
                      ]"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      :class="[
                        'text-sm font-medium',
                        !notification?.read
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-gray-300',
                      ]"
                    >
                      {{ notification?.title || 'Notification' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ notification?.message || '' }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {{ formatNotificationTime(notification?.timestamp) }}
                    </p>
                  </div>
                  <button
                    v-if="notification?.id"
                    @click.stop="removeNotification(notification.id)"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div class="relative user-menu-container">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div
              class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center"
            >
              <span class="text-white text-sm font-bold">{{
                currentUser?.name?.charAt(0) || 'U'
              }}</span>
            </div>
            <svg
              class="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <!-- User Dropdown -->

          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
            style="z-index: 9999"
          >
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-3">
                <div
                  class="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center"
                >
                  <span class="text-white text-lg font-bold">{{
                    currentUser?.name?.charAt(0) || 'U'
                  }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-white truncate"
                  >
                    {{ currentUser?.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ currentUser?.email }}
                  </p>
                  <span
                    class="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {{ currentUser?.role }}
                  </span>
                </div>
              </div>
            </div>
            <div class="py-2">
              <button
                @click="openProfileModal"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <span>Profile Settings</span>
              </button>
              <button
                v-if="hasPermission('view_audit_logs')"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <span>Activity Log</span>
              </button>
              <hr class="my-2 border-gray-200 dark:border-gray-700" />
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Modal -->
    <UserProfileModal
      v-if="showProfileModal"
      @close="showProfileModal = false"
    />
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import UserProfileModal from '@/components/modals/UserProfileModal.vue';
import IconComponents from '@/utils/iconComponents';

export default {
  name: 'AppHeader',
  components: {
    UserProfileModal,
    ...IconComponents,
  },
  setup() {
    // Use local reactive state for dropdowns - simpler approach like React useState
    const showNotifications = ref(false);
    const showUserMenu = ref(false);
    const showProfileModal = ref(false); // Get other state from stores
    const uiStore = useUIStore();
    const { currentUser, logout, hasPermission } = useAuthStore();
    const notificationStore = useNotificationStore();

    // Local toggle functions - direct and simple
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      showUserMenu.value = false; // Close other dropdown
    };

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      showNotifications.value = false; // Close other dropdown
    };

    const closeAllDropdowns = () => {
      showNotifications.value = false;
      showUserMenu.value = false;
    };

    // Click outside handler to close dropdowns
    const handleClickOutside = event => {
      // Check if click is outside of dropdown areas
      const notificationDropdown = event.target.closest(
        '.notifications-container'
      );
      const userMenuDropdown = event.target.closest('.user-menu-container');

      if (!notificationDropdown && !userMenuDropdown) {
        closeAllDropdowns();
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
      showUserMenu.value = false;
    };

    const openProfileModal = () => {
      showProfileModal.value = true;
      showUserMenu.value = false;
    };
    return {
      // Local reactive state
      showNotifications,
      showUserMenu,
      showProfileModal,
      // Store state and methods
      isDark: uiStore.isDark,
      sidebarOpen: uiStore.sidebarOpen,
      notifications: notificationStore.recentNotifications,
      notificationStore, // Expose the entire notification store
      currentUser,
      // Methods
      toggleTheme: uiStore.toggleTheme,
      toggleSidebar: uiStore.toggleSidebar,
      toggleNotifications,
      toggleUserMenu,
      getCurrentViewTitle: uiStore.getCurrentViewTitle,
      handleLogout,
      openProfileModal,
      hasPermission,
      markNotificationAsRead: notificationStore.markAsRead,
      markAllNotificationsAsRead: notificationStore.markAllAsRead,
      getUnreadNotificationCount: () => notificationStore.unreadCount,
      removeNotification: notificationStore.removeNotification,
      formatNotificationTime: notificationStore.formatNotificationTime,
    };
  },
};
</script>
