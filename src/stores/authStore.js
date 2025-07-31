import { ref, computed } from 'vue';
import { dataService } from '@/services/dataService';
import { useNotificationStore } from '@/stores/notificationStore';
import { useToastStore } from '@/stores/toastStore';

const isAuthenticated = ref(false);
const isLoading = ref(true);
const currentUser = ref(null);

// Define role hierarchy and permissions
const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Administrator',
  HR_MANAGER: 'HR Manager',
  DEPARTMENT_HEAD: 'Department Head',
  EMPLOYEE: 'Employee',
  VIEWER: 'Viewer',
};

const PERMISSIONS = {
  // Company management
  CREATE_COMPANY: 'create_company',
  VIEW_COMPANY: 'view_company',
  EDIT_COMPANY: 'edit_company',
  DELETE_COMPANY: 'delete_company',

  // Employee management
  CREATE_EMPLOYEE: 'create_employee',
  VIEW_EMPLOYEE: 'view_employee',
  EDIT_EMPLOYEE: 'edit_employee',
  DELETE_EMPLOYEE: 'delete_employee',
  EDIT_OWN_PROFILE: 'edit_own_profile',
  // Department management
  CREATE_DEPARTMENT: 'create_department',
  VIEW_DEPARTMENT: 'view_department',
  EDIT_DEPARTMENT: 'edit_department',
  DELETE_DEPARTMENT: 'delete_department',
  MANAGE_DEPARTMENT_MEMBERS: 'manage_department_members',

  // Project management
  CREATE_PROJECT: 'create_project',
  VIEW_PROJECT: 'view_project',
  EDIT_PROJECT: 'edit_project',
  DELETE_PROJECT: 'delete_project',
  MANAGE_PROJECT_TEAM: 'manage_project_team',
  VIEW_PROJECT_REPORTS: 'view_project_reports',

  // Reports and analytics
  VIEW_REPORTS: 'view_reports',
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',

  // System settings
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
};

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_COMPANY,
    PERMISSIONS.VIEW_COMPANY,
    PERMISSIONS.EDIT_COMPANY,
    PERMISSIONS.DELETE_COMPANY,
    PERMISSIONS.CREATE_EMPLOYEE,
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.DELETE_EMPLOYEE,
    PERMISSIONS.CREATE_DEPARTMENT,
    PERMISSIONS.VIEW_DEPARTMENT,
    PERMISSIONS.EDIT_DEPARTMENT,
    PERMISSIONS.DELETE_DEPARTMENT,
    PERMISSIONS.MANAGE_DEPARTMENT_MEMBERS,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.MANAGE_PROJECT_TEAM,
    PERMISSIONS.VIEW_PROJECT_REPORTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.EDIT_OWN_PROFILE,
  ],
  [ROLES.HR_MANAGER]: [
    PERMISSIONS.VIEW_COMPANY,
    PERMISSIONS.EDIT_COMPANY,
    PERMISSIONS.CREATE_EMPLOYEE,
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.DELETE_EMPLOYEE,
    PERMISSIONS.CREATE_DEPARTMENT,
    PERMISSIONS.VIEW_DEPARTMENT,
    PERMISSIONS.EDIT_DEPARTMENT,
    PERMISSIONS.DELETE_DEPARTMENT,
    PERMISSIONS.MANAGE_DEPARTMENT_MEMBERS,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.MANAGE_PROJECT_TEAM,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.EDIT_OWN_PROFILE,
  ],
  [ROLES.DEPARTMENT_HEAD]: [
    PERMISSIONS.VIEW_COMPANY,
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.VIEW_DEPARTMENT,
    PERMISSIONS.EDIT_DEPARTMENT,
    PERMISSIONS.MANAGE_DEPARTMENT_MEMBERS,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.MANAGE_PROJECT_TEAM,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EDIT_OWN_PROFILE,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_COMPANY,
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.VIEW_DEPARTMENT,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.EDIT_OWN_PROFILE,
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_COMPANY,
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.VIEW_DEPARTMENT,
    PERMISSIONS.VIEW_PROJECT,
  ],
};

// Sample users for different roles
const SAMPLE_USERS = {
  'admin@company.com': {
    id: 1,
    name: 'John Doe',
    email: 'admin@company.com',
    role: ROLES.ADMIN,
    avatar: null,
    department: 'IT',
    company: 'Tech Corp',
    position: 'System Administrator',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-01-15',
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
  'hr@company.com': {
    id: 2,
    name: 'Sarah Wilson',
    email: 'hr@company.com',
    role: ROLES.HR_MANAGER,
    avatar: null,
    department: 'Human Resources',
    company: 'Tech Corp',
    position: 'HR Manager',
    phone: '+1 (555) 234-5678',
    joinDate: '2023-02-01',
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
  'manager@company.com': {
    id: 3,
    name: 'Mike Johnson',
    email: 'manager@company.com',
    role: ROLES.DEPARTMENT_HEAD,
    avatar: null,
    department: 'Engineering',
    company: 'Tech Corp',
    position: 'Engineering Manager',
    phone: '+1 (555) 345-6789',
    joinDate: '2023-03-01',
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
  'employee@company.com': {
    id: 4,
    name: 'Lisa Chen',
    email: 'employee@company.com',
    role: ROLES.EMPLOYEE,
    avatar: null,
    department: 'Engineering',
    company: 'Tech Corp',
    position: 'Software Developer',
    phone: '+1 (555) 456-7890',
    joinDate: '2023-04-01',
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
};

const loginForm = ref({
  email: 'admin@company.com',
  password: 'password',
  rememberMe: false,
});

export function useAuthStore() {
  // Get store instances
  const notificationStore = useNotificationStore();
  const toastStore = useToastStore();
  const userPermissions = computed(() => {
    if (!currentUser.value?.role) return [];
    return ROLE_PERMISSIONS[currentUser.value.role] || [];
  });

  const hasPermission = permission => {
    return userPermissions.value.includes(permission);
  };

  const hasAnyPermission = permissions => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = permissions => {
    return permissions.every(permission => hasPermission(permission));
  };
  const canAccess = (resource, action = 'view') => {
    const permissionKey = `${action}_${resource}`.toUpperCase();
    return hasPermission(PERMISSIONS[permissionKey]);
  };

  const login = async (credentials = null) => {
    const creds = credentials || loginForm.value;

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // Get users from data service
        const users = dataService.getAll('users');
        const user = users.find(u => u.email === creds.email);

        if (user && creds.password === 'password') {
          // Update last login
          const updatedUser = dataService.update('users', user.id, {
            lastLogin: new Date().toISOString(),
          });

          currentUser.value = { ...updatedUser };
          isAuthenticated.value = true;

          // Store session data
          const sessionData = {
            user: { ...updatedUser },
            timestamp: new Date().toISOString(),
            rememberMe: creds.rememberMe,
          };

          // Store in localStorage for session persistence
          localStorage.setItem('userSession', JSON.stringify(sessionData));

          // Store auth token
          localStorage.setItem('authToken', 'demo-token-' + user.id); // Set current user in data service
          dataService.setCurrentUser(updatedUser);

          // Add login notification and toast
          notificationStore.addNotification(
            'USER_LOGIN',
            `${updatedUser.name} logged in successfully`
          );

          toastStore.addToast({
            type: 'success',
            title: 'Welcome Back!',
            message: `Successfully logged in as ${updatedUser.name}`,
          });
          resolve(updatedUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };
  const logout = async () => {
    const userName = currentUser.value?.name;

    currentUser.value = null;
    isAuthenticated.value = false; // Clear session data
    localStorage.removeItem('userSession');
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberedUser');
    dataService.clearSession();

    // Add logout notification and toast
    if (userName) {
      notificationStore.addNotification(
        'USER_LOGOUT',
        `${userName} logged out`
      );

      toastStore.addToast({
        type: 'info',
        title: 'Logged Out',
        message: `${userName} has been logged out successfully`,
      });
    }

    // Force a brief loading state to show logout is happening
    isLoading.value = true;
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  };

  const updateProfile = async updates => {
    if (!currentUser.value) {
      throw new Error('No user logged in');
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const updatedUser = dataService.update(
            'users',
            currentUser.value.id,
            updates
          );
          currentUser.value = { ...updatedUser };

          // Update session data
          const sessionData = localStorage.getItem('userSession');
          if (sessionData) {
            const session = JSON.parse(sessionData);
            session.user = { ...updatedUser };
            localStorage.setItem('userSession', JSON.stringify(session));
          }

          dataService.setCurrentUser(updatedUser);
          resolve(updatedUser);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  };
  const changePassword = async (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currentPassword === 'password') {
          // In a real app, this would hash the password
          updateProfile({ password: newPassword })
            .then(() => resolve(true))
            .catch(reject);
        } else {
          reject(new Error('Current password is incorrect'));
        }
      }, 1000);
    });
  };

  const initializeAuth = () => {
    try {
      // Check for active session first
      const userSession = localStorage.getItem('userSession');
      const authToken = localStorage.getItem('authToken');

      if (userSession && authToken) {
        const sessionData = JSON.parse(userSession);
        const sessionAge =
          Date.now() - new Date(sessionData.timestamp).getTime();
        const maxSessionAge = sessionData.rememberMe
          ? 30 * 24 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000; // 30 days or 1 day

        if (sessionAge < maxSessionAge) {
          // Get fresh user data from data service
          const user = dataService.getById('users', sessionData.user.id);
          if (user) {
            currentUser.value = user;
            isAuthenticated.value = true;
            dataService.setCurrentUser(user);
            return;
          }
        }
      }

      // Session expired or invalid, clear it
      logout();
    } catch (error) {
      console.error('Error initializing auth:', error);
      logout();
    }
  };

  const setLoading = loading => {
    isLoading.value = loading;
  };

  const getRoleDisplayName = role => {
    return role || 'Unknown Role';
  };

  const isHigherRole = (role1, role2) => {
    const roleHierarchy = [
      ROLES.VIEWER,
      ROLES.EMPLOYEE,
      ROLES.DEPARTMENT_HEAD,
      ROLES.HR_MANAGER,
      ROLES.ADMIN,
      ROLES.SUPER_ADMIN,
    ];
    return roleHierarchy.indexOf(role1) > roleHierarchy.indexOf(role2);
  };

  return {
    // State
    isAuthenticated,
    isLoading,
    currentUser,
    loginForm,
    userPermissions,

    // Constants
    ROLES,
    PERMISSIONS,
    SAMPLE_USERS,

    // Methods
    login,
    logout,
    updateProfile,
    changePassword,
    setLoading,
    initializeAuth,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    getRoleDisplayName,
    isHigherRole,
  };
}
