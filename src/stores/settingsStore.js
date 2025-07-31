import { ref, computed } from 'vue';
import { dataService } from '@/services/dataService';
import { useNotificationStore } from '@/stores/notificationStore';
import { useToastStore } from '@/stores/toastStore';

export function useSettingsStore() {
  // Get store instances
  const notificationStore = useNotificationStore();
  const toastStore = useToastStore();

  // Settings state
  const settings = ref({
    // System Settings
    system: {
      appName: 'Employee Management System',
      appVersion: '1.0.0',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      language: 'en',
      maintenanceMode: false,
      allowRegistration: true,
      maxLoginAttempts: 5,
      sessionTimeout: 60, // minutes
      backupEnabled: true,
      backupFrequency: 'daily',
    },

    // Security Settings
    security: {
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSpecialChars: true,
      passwordExpirationDays: 90,
      twoFactorEnabled: false,
      loginNotificationEnabled: true,
      ipWhitelistEnabled: false,
      auditLogRetentionDays: 365,
    },
    // Notification Settings
    notifications: {
      email: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        encryption: 'tls',
        username: '',
        password: '',
        fromEmail: 'noreply@company.com',
      },
      types: {
        welcome: true,
        passwordReset: true,
        accountLockout: true,
        systemAlerts: true,
      },
    },

    // Integration Settings
    integrations: {
      slack: {
        enabled: false,
        webhookUrl: '',
        defaultChannel: '#general',
      },
      teams: {
        enabled: false,
        webhookUrl: '',
      },
      sso: {
        enabled: false,
        provider: 'saml',
        entityId: '',
      },
      ldap: {
        enabled: false,
        serverUrl: '',
        baseDn: '',
      },
    },

    // UI/UX Settings
    interface: {
      theme: 'light',
      primaryColor: '#3b82f6',
      logoUrl: '',
      compactSidebar: false,
      showBreadcrumbs: true,
      language: 'en',
      currency: 'USD',
      numberFormat: '1,234.56',
      rtlLayout: false,
      enableAnimations: true,
      defaultPageSize: 25,
      showRowNumbers: false,
    },
  });

  const isLoading = ref(false);
  const hasUnsavedChanges = ref(false);
  const activeTab = ref('system');

  // Settings categories for navigation
  const settingsCategories = ref([
    {
      id: 'system',
      name: 'System',
      icon: 'CogIcon',
      description: 'General system configuration',
    },
    {
      id: 'security',
      name: 'Security',
      icon: 'ShieldCheckIcon',
      description: 'Security and authentication settings',
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: 'BellIcon',
      description: 'Email and notification preferences',
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: 'PuzzlePieceIcon',
      description: 'Third-party integrations and APIs',
    },
    {
      id: 'interface',
      name: 'Interface',
      icon: 'PaintBrushIcon',
      description: 'UI/UX preferences and themes',
    },
    {
      id: 'users',
      name: 'User Management',
      icon: 'UsersIcon',
      description: 'Manage user accounts and roles',
    },
    {
      id: 'audit',
      name: 'Audit Logs',
      icon: 'DocumentTextIcon',
      description: 'System activity and audit trails',
    },
    {
      id: 'backup',
      name: 'Backup & Recovery',
      icon: 'CloudArrowUpIcon',
      description: 'Data backup and recovery options',
    },
  ]);

  // Computed
  const currentSettings = computed(() => {
    return settings.value[activeTab.value] || {};
  });
  const systemInfo = computed(() => {
    const allUsers = dataService.getAll('users') || [];
    const employees = dataService.getAll('employees') || [];

    return {
      version: settings.value.system.appVersion,
      lastBackup: localStorage.getItem('last_backup_date') || 'Never',
      uptime: '2 days, 14 hours', // Would calculate actual uptime
      storage: {
        used: '45.2 MB',
        total: '100 MB',
        percentage: 45.2,
      },
      users: {
        total: Math.max(allUsers.length, employees.length),
        active: Math.max(
          allUsers.filter(u => u.status === 'active').length,
          employees.filter(e => e.status === 'active').length
        ),
        inactive: Math.max(
          allUsers.filter(u => u.status === 'inactive').length,
          employees.filter(e => e.status === 'inactive').length
        ),
      },
    };
  });

  const auditLogs = ref([
    {
      id: 1,
      timestamp: new Date().toISOString(),
      user: 'admin@company.com',
      action: 'USER_LOGIN',
      details: 'Successful login from 192.168.1.100',
      severity: 'info',
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      user: 'john.doe@company.com',
      action: 'EMPLOYEE_CREATE',
      details: 'Created new employee: Jane Smith',
      severity: 'info',
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      user: 'admin@company.com',
      action: 'SETTINGS_UPDATE',
      details: 'Updated security settings',
      severity: 'warning',
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      user: 'system',
      action: 'BACKUP_COMPLETE',
      details: 'Scheduled backup completed successfully',
      severity: 'success',
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      user: 'unknown',
      action: 'LOGIN_FAILED',
      details: 'Failed login attempt from 192.168.1.200',
      severity: 'error',
    },
  ]); // Load settings from localStorage
  const loadSettings = async () => {
    const savedSettings = localStorage.getItem('ems_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        settings.value = { ...getDefaultSettings(), ...parsed };
      } catch (error) {
        console.error('Failed to load settings:', error);
        settings.value = getDefaultSettings();
      }
    } else {
      settings.value = getDefaultSettings();

      // Add notification for first-time setup
      notificationStore.addNotification(
        'SETTINGS_LOADED',
        'System settings initialized with default values'
      );
    }

    // Apply all settings after loading
    setTimeout(() => applyAllSettings(), 100);
  }; // Save settings to localStorage and apply all changes
  const saveSettings = async () => {
    isLoading.value = true;

    try {
      localStorage.setItem('ems_settings', JSON.stringify(settings.value));
      // Apply all current settings
      await applyAllSettings();

      hasUnsavedChanges.value = false;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500)); // Add notification and toast for settings save
      notificationStore.addNotification(
        'SETTINGS_UPDATED',
        'System settings have been updated'
      );
      toastStore.addToast('Settings saved successfully!', 'success');

      return { success: true, message: 'Settings saved successfully' };
    } catch (error) {
      console.error('Failed to save settings:', error);
      return { success: false, message: 'Failed to save settings' };
    } finally {
      isLoading.value = false;
    }
  };
  // Apply all settings when loading
  const applyAllSettings = async () => {
    for (const category of Object.keys(settings.value)) {
      for (const key of Object.keys(settings.value[category])) {
        await applySettingChange(category, key, settings.value[category][key]);
      }
    }
  }; // Update specific setting with real functionality
  const updateSetting = async (category, key, value) => {
    if (settings.value[category]) {
      settings.value[category][key] = value;
      hasUnsavedChanges.value = true;

      // Apply real-time changes for certain settings
      await applySettingChange(category, key, value);
    }
  };
  // Apply setting changes immediately
  const applySettingChange = async (category, key, value) => {
    switch (category) {
      case 'interface':
        await applyInterfaceChanges(key, value);
        break;
      case 'system':
        await applySystemChanges(key, value);
        break;
      case 'security':
        applySecurityChanges(key, value);
        break;
      case 'notifications':
        applyNotificationChanges(key, value);
        break;
    }
  };
  // Apply interface changes
  const applyInterfaceChanges = async (key, value) => {
    const root = document.documentElement;

    switch (key) {
      case 'theme':
        if (value === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (value === 'light') {
          document.documentElement.classList.remove('dark');
        } else if (value === 'system') {
          const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches;
          if (prefersDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        // Add theme change notification
        notificationStore.addNotification(
          'THEME_CHANGED',
          `Theme changed to ${value}`
        );
        break;

      case 'primaryColor':
        root.style.setProperty('--primary-color', value);
        // Update CSS custom properties for the primary color
        const rgb = hexToRgb(value);
        if (rgb) {
          root.style.setProperty(
            '--primary-rgb',
            `${rgb.r}, ${rgb.g}, ${rgb.b}`
          );
        }
        break;

      case 'language':
        // In a real app, you'd load language files here
        document.documentElement.lang = value;
        console.log(`Language changed to: ${value}`);
        break;

      case 'rtlLayout':
        document.documentElement.dir = value ? 'rtl' : 'ltr';
        break;

      case 'enableAnimations':
        if (value) {
          document.documentElement.classList.remove('no-animations');
        } else {
          document.documentElement.classList.add('no-animations');
        }
        break;
    }
  };
  // Apply system changes
  const applySystemChanges = async (key, value) => {
    switch (key) {
      case 'appName':
        document.title = value;
        break;

      case 'maintenanceMode':
        if (value) {
          // In a real app, you'd redirect to maintenance page          console.log('Maintenance mode enabled - system would redirect to maintenance page')

          // Add maintenance mode notification
          notificationStore.addNotification(
            'MAINTENANCE_MODE',
            'Maintenance mode has been enabled'
          );
        } else {
          console.log('Maintenance mode disabled');

          // Add maintenance mode disabled notification
          notificationStore.addNotification(
            'MAINTENANCE_MODE',
            'Maintenance mode has been disabled'
          );
        }
        break;

      case 'sessionTimeout':
        // Reset session timeout
        console.log(`Session timeout updated to ${value} minutes`);
        // In a real app, you'd update the session management
        break;
    }
  };

  // Apply security changes
  const applySecurityChanges = (key, value) => {
    switch (key) {
      case 'twoFactorEnabled':
        console.log(
          `Two-factor authentication ${value ? 'enabled' : 'disabled'}`
        );
        break;

      case 'maxLoginAttempts':
        console.log(`Maximum login attempts set to ${value}`);
        break;

      case 'passwordMinLength':
        console.log(`Minimum password length set to ${value} characters`);
        break;
    }
  };

  // Apply notification changes
  const applyNotificationChanges = (key, value) => {
    if (key.includes('email')) {
      console.log(`Email notification settings updated: ${key} = ${value}`);
    }
  };

  // Helper function to convert hex to RGB
  const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };
  // Reset settings to defaults
  const resetSettings = (category = null) => {
    if (category && settings.value[category]) {
      // Reset specific category
      const defaultSettings = getDefaultSettings();
      settings.value[category] = { ...defaultSettings[category] };
    } else {
      // Reset all settings
      settings.value = getDefaultSettings();
    }
    hasUnsavedChanges.value = true;
  };

  // Reset all settings to defaults
  const resetToDefaults = async () => {
    settings.value = getDefaultSettings();
    hasUnsavedChanges.value = false;
    await saveSettings();
    return { success: true, message: 'Settings reset to defaults' };
  };
  // Get default settings
  const getDefaultSettings = () => ({
    system: {
      appName: 'Employee Management System',
      appVersion: '1.0.0',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      language: 'en',
      maintenanceMode: false,
      allowRegistration: true,
      maxLoginAttempts: 5,
      sessionTimeout: 60,
      backupEnabled: true,
      backupFrequency: 'daily',
    },
    security: {
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSpecialChars: true,
      passwordExpirationDays: 90,
      twoFactorEnabled: false,
      loginNotificationEnabled: true,
      ipWhitelistEnabled: false,
      auditLogRetentionDays: 365,
    },
    notifications: {
      email: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        encryption: 'tls',
        username: '',
        password: '',
        fromEmail: 'noreply@company.com',
      },
      types: {
        welcome: true,
        passwordReset: true,
        accountLockout: true,
        systemAlerts: true,
      },
    },
    integrations: {
      slack: {
        enabled: false,
        webhookUrl: '',
        defaultChannel: '#general',
      },
      teams: {
        enabled: false,
        webhookUrl: '',
      },
      sso: {
        enabled: false,
        provider: 'saml',
        entityId: '',
      },
      ldap: {
        enabled: false,
        serverUrl: '',
        baseDn: '',
      },
    },
    interface: {
      theme: 'light',
      primaryColor: '#3b82f6',
      logoUrl: '',
      compactSidebar: false,
      showBreadcrumbs: true,
      language: 'en',
      currency: 'USD',
      numberFormat: '1,234.56',
      rtlLayout: false,
      enableAnimations: true,
      defaultPageSize: 25,
      showRowNumbers: false,
    },
  });

  // Export/Import settings
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings.value, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `ems-settings-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importSettings = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          settings.value = { ...settings.value, ...importedSettings };
          hasUnsavedChanges.value = true;
          resolve({ success: true, message: 'Settings imported successfully' });
        } catch (error) {
          reject({ success: false, message: 'Invalid settings file' });
        }
      };
      reader.onerror = () =>
        reject({ success: false, message: 'Failed to read file' });
      reader.readAsText(file);
    });
  };

  // Backup operations
  const createBackup = async () => {
    isLoading.value = true;

    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        version: settings.value.system.appVersion,
        settings: settings.value,
        companies: dataService.getAll('companies'),
        departments: dataService.getAll('departments'),
        employees: dataService.getAll('employees'),
        users: dataService.getAll('users'),
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `ems-backup-${
        new Date().toISOString().split('T')[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update last backup date
      localStorage.setItem('last_backup_date', new Date().toISOString());

      return { success: true, message: 'Backup created successfully' };
    } catch (error) {
      console.error('Backup failed:', error);
      return { success: false, message: 'Backup failed' };
    } finally {
      isLoading.value = false;
    }
  };
  // User management
  const users = computed(() => dataService.getAll('users') || []);
  const addUser = async userData => {
    const newUser = dataService.create('users', {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginAttempts: 0,
    });

    // Add notification and toast
    notificationStore.addNotification(
      'USER_CREATED',
      `New user "${newUser.name}" has been created`
    );
    toastStore.addToast({
      type: 'success',
      title: 'User Created',
      message: `User "${newUser.name}" was successfully created`,
    });
    return newUser;
  };

  const createUser = userData => {
    return addUser(userData);
  };

  const updateUser = async (userId, updates) => {
    const oldUser = dataService.getById('users', userId);
    const updatedUser = dataService.update('users', userId, updates);

    // Add notification and toast
    notificationStore.addNotification(
      'USER_UPDATED',
      `User "${updatedUser.name}" has been updated`
    );
    toastStore.addToast({
      type: 'success',
      title: 'User Updated',
      message: `User "${updatedUser.name}" was successfully updated`,
    });
    return updatedUser;
  };

  const deleteUser = async userId => {
    const user = dataService.getById('users', userId);
    const success = dataService.delete('users', userId);

    if (success && user) {
      // Add notification and toast
      notificationStore.addNotification(
        'USER_DELETED',
        `User "${user.name}" has been deleted`
      );
      toastStore.addToast({
        type: 'success',
        title: 'User Deleted',
        message: `User "${user.name}" was successfully deleted`,
      });
    }

    return success;
  };

  const toggleUserStatus = userId => {
    const user = dataService.getById('users', userId);
    if (user) {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      return updateUser(userId, { status: newStatus });
    }
  };
  // Initialize settings
  loadSettings();

  return {
    // State
    settings,
    isLoading,
    hasUnsavedChanges,
    activeTab,
    auditLogs,

    // Computed
    settingsCategories,
    currentSettings,
    systemInfo,
    users, // Actions
    loadSettings,
    saveSettings,
    updateSetting,
    resetSettings,
    resetToDefaults,
    exportSettings,
    importSettings,
    createBackup,
    addUser,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  };
}
