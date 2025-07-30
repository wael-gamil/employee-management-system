import { reactive, computed, toRefs } from 'vue';
import { useAuthStore } from './authStore';

// Create a reactive state object for global UI state
const state = reactive({
  isDark: false,
  sidebarOpen: true,
  currentView: 'dashboard',
  // Dropdown states are now handled locally in components
  notifications: [
    {
      id: 1,
      title: 'System Update',
      message: 'New features have been deployed',
      time: '1 hour ago',
      type: 'info',
      read: false,
    },
    {
      id: 2,
      title: 'Backup Complete',
      message: 'Daily backup completed successfully',
      time: '3 hours ago',
      type: 'success',
      read: false,
    },
    {
      id: 3,
      title: 'New User Registration',
      message: '5 new users registered today',
      time: '6 hours ago',
      type: 'info',
      read: true,
    },
  ],
});

// Define all menu items with their required permissions
const allMenuItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'DashboardIcon',
    permissions: [], // Dashboard is always accessible
    description: 'Overview and key metrics',
  },
  {
    id: 'companies',
    name: 'Companies',
    icon: 'CompanyIcon',
    permissions: ['view_company'],
    description: 'Manage company information',
  },
  {
    id: 'employees',
    name: 'Employees',
    icon: 'EmployeeIcon',
    permissions: ['view_employee'],
    description: 'Employee management and profiles',
  },
  {
    id: 'departments',
    name: 'Departments',
    icon: 'DepartmentIcon',
    permissions: ['view_department'],
    description: 'Department structure and management',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: 'ProjectIcon',
    permissions: ['view_project'],
    description: 'Project management and tracking',
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: 'ReportIcon',
    permissions: ['view_reports'],
    description: 'Analytics and reporting',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'SettingsIcon',
    permissions: ['manage_settings'],
    description: 'System configuration and preferences',
  },
];

export function useUIStore() {
  const authStore = useAuthStore();
  // Computed property for filtered menu items based on user permissions
  const menuItems = computed(() => {
    if (!authStore.currentUser) {
      return allMenuItems.filter(item => item.id === 'dashboard');
    }

    return allMenuItems.filter(item => {
      // Dashboard is always accessible
      if (item.id === 'dashboard') return true;

      // Check if user has any of the required permissions
      if (item.permissions.length === 0) return true;

      return authStore.hasAnyPermission(item.permissions);
    });
  });

  const toggleTheme = () => {
    state.isDark = !state.isDark;
    document.documentElement.classList.toggle('dark', state.isDark);
    localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
  };

  const getCurrentViewTitle = () => {
    const view = allMenuItems.find(item => item.id === state.currentView);
    return view ? view.name : 'Dashboard';
  };

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      state.isDark = true;
      document.documentElement.classList.add('dark');
    }
  };
  const toggleSidebar = () => {
    state.sidebarOpen = !state.sidebarOpen;
  };

  const markNotificationAsRead = notificationId => {
    const notification = state.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  };

  const markAllNotificationsAsRead = () => {
    state.notifications.forEach(notification => {
      notification.read = true;
    });
  };

  const getUnreadNotificationCount = () => {
    return state.notifications.filter(n => !n.read).length;
  };

  const addNotification = notification => {
    state.notifications.unshift({
      id: Date.now(),
      read: false,
      time: 'Just now',
      type: 'info',
      ...notification,
    });
  };

  const removeNotification = notificationId => {
    const index = state.notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      state.notifications.splice(index, 1);
    }
  };

  const canAccessView = viewId => {
    const menuItem = allMenuItems.find(item => item.id === viewId);
    if (!menuItem) return false;

    if (menuItem.id === 'dashboard') return true;
    if (menuItem.permissions.length === 0) return true;

    return authStore.hasAnyPermission(menuItem.permissions);
  };

  const redirectToAuthorizedView = () => {
    if (!canAccessView(state.currentView)) {
      // Find the first accessible view
      const accessibleView = menuItems.value[0];
      if (accessibleView) {
        state.currentView = accessibleView.id;
      }
    }
  };

  // Use toRefs to maintain reactivity when destructuring
  return {
    ...toRefs(state),

    // Computed
    menuItems, // Methods
    toggleTheme,
    toggleSidebar,
    getCurrentViewTitle,
    initializeTheme,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    addNotification,
    removeNotification,
    canAccessView,
    redirectToAuthorizedView,
  };
}
