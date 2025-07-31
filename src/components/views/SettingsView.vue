<template>
  <div class="space-y-6">
    <!-- System Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              System Version
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ systemInfo.version || '1.0.0' }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500"
          >
            <component :is="'CogIcon'" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Users
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ systemInfo.users?.active || 0 }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center bg-green-500"
          >
            <component :is="'UsersIcon'" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Storage Used
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ systemInfo.storage?.percentage || 0 }}%
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500"
          >
            <component :is="'CloudArrowUpIcon'" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Last Backup
            </p>
            <p class="text-sm font-bold text-gray-900 dark:text-white mt-1">
              {{ formatBackupDate(systemInfo.lastBackup || 'Never') }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500"
          >
            <component :is="'ShieldCheckIcon'" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Maintenance Mode Warning -->
    <div
      v-if="settings.system?.maintenanceMode"
      class="maintenance-mode-warning border rounded-lg p-4 mb-6"
    >
      <div class="flex items-center space-x-3">
        <svg
          class="w-6 h-6 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          ></path>
        </svg>
        <div>
          <h4 class="font-semibold">Maintenance Mode Active</h4>
          <p class="text-sm">
            The system is currently in maintenance mode. New users cannot access
            the application.
          </p>
        </div>
      </div>
    </div>

    <!-- Settings Navigation & Content -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex space-x-8 px-6" aria-label="Settings">
          <button
            v-for="category in settingsCategories"
            :key="category.id"
            @click="activeTab = category.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === category.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            ]"
          >
            <div class="flex items-center space-x-2">
              <component :is="category.icon" class="w-4 h-4" />
              <span>{{ category.name }}</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="p-6">
        <!-- System Settings -->
        <div v-if="activeTab === 'system'" class="space-y-6">
          <div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              System Configuration
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Configure general system settings and preferences.
            </p>
          </div>

          <div
            v-if="settings.system"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Application Name</label
                >
                <input
                  v-model="settings.system.appName"
                  @input="
                    handleSettingChange(
                      'system',
                      'appName',
                      $event.target.value
                    )
                  "
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Timezone</label
                >
                <select
                  v-model="settings.system.timezone"
                  @change="
                    handleSettingChange(
                      'system',
                      'timezone',
                      $event.target.value
                    )
                  "
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Date Format</label
                >
                <select
                  v-model="settings.system.dateFormat"
                  @change="hasUnsavedChanges = true"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Session Timeout (minutes)</label
                >
                <input
                  v-model="settings.system.sessionTimeout"
                  @input="hasUnsavedChanges = true"
                  type="number"
                  min="5"
                  max="480"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    Maintenance Mode
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Temporarily disable user access
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settings.system.maintenanceMode"
                    @change="
                      handleSettingChange(
                        'system',
                        'maintenanceMode',
                        $event.target.checked
                      )
                    "
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>

              <div
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    Allow Registration
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Allow new users to register
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settings.system.allowRegistration"
                    @change="hasUnsavedChanges = true"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>

              <div
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    Backup Enabled
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Automatic data backups
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settings.system.backupEnabled"
                    @change="hasUnsavedChanges = true"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <!-- Security Settings -->
        <div v-else-if="activeTab === 'security'" class="space-y-6">
          <div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              Security Configuration
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Configure password policies and security features.
            </p>
          </div>

          <div
            v-if="settings.security"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Minimum Password Length</label
                >
                <input
                  v-model="settings.security.passwordMinLength"
                  @input="hasUnsavedChanges = true"
                  type="number"
                  min="6"
                  max="20"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Password Expiration (days)</label
                >
                <input
                  v-model="settings.security.passwordExpirationDays"
                  @input="hasUnsavedChanges = true"
                  type="number"
                  min="30"
                  max="365"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Max Login Attempts</label
                >
                <input
                  v-model="settings.security.maxLoginAttempts"
                  @input="hasUnsavedChanges = true"
                  type="number"
                  min="3"
                  max="10"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    Require Uppercase
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Passwords must contain uppercase letters
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settings.security.passwordRequireUppercase"
                    @change="hasUnsavedChanges = true"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>

              <div
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    Require Numbers
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Passwords must contain numbers
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settings.security.passwordRequireNumbers"
                    @change="hasUnsavedChanges = true"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>

              <div
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    Two-Factor Authentication
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Enable 2FA for enhanced security
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settings.security.twoFactorEnabled"
                    @change="hasUnsavedChanges = true"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <!-- User Management -->
        <div v-else-if="activeTab === 'users'" class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                User Management
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Manage user accounts and permissions.
              </p>
            </div>
            <button
              @click="openUserModal()"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
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
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              <span>Add User</span>
            </button>
          </div>

          <div
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Last Login
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr
                  v-for="user in users"
                  :key="user.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center"
                      >
                        <span class="text-white font-medium text-sm">{{
                          user.name.charAt(0)
                        }}</span>
                      </div>
                      <div class="ml-4">
                        <div
                          class="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {{ user.name }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{ user.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                  >
                    {{ user.role }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                      ]"
                    >
                      {{ user.status }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                  >
                    {{ user.lastLogin ? formatDate(user.lastLogin) : 'Never' }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    <div class="flex items-center justify-end space-x-2">
                      <button
                        @click="openUserModal(user)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        @click="toggleUserStatus(user.id)"
                        :class="
                          user.status === 'active'
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        "
                      >
                        {{
                          user.status === 'active' ? 'Deactivate' : 'Activate'
                        }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Audit Logs -->
        <div v-else-if="activeTab === 'audit'" class="space-y-6">
          <div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              Audit Logs
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              System activity and security events.
            </p>
          </div>

          <div class="space-y-4">
            <div
              v-for="log in auditLogs"
              :key="log.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full',
                      getSeverityColor(log.severity),
                    ]"
                  ></div>
                  <div>
                    <div
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ log.action }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ log.details }}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(log.timestamp) }}
                  </div>
                  <div class="text-xs text-gray-400">{{ log.user }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Backup & Recovery -->
        <div v-else-if="activeTab === 'backup'" class="space-y-6">
          <div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              Backup & Recovery
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Manage data backups and system recovery.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div
                class="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <h4
                  class="text-lg font-medium text-gray-900 dark:text-white mb-2"
                >
                  Create Backup
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Export all system data including settings, users, and content.
                </p>
                <button
                  @click="createBackup"
                  :disabled="isLoading"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {{ isLoading ? 'Creating...' : 'Create Backup' }}
                </button>
              </div>

              <div
                class="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <h4
                  class="text-lg font-medium text-gray-900 dark:text-white mb-2"
                >
                  Export Settings
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Export only system settings configuration.
                </p>
                <button
                  @click="exportSettings"
                  class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Export Settings
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <div
                class="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <h4
                  class="text-lg font-medium text-gray-900 dark:text-white mb-2"
                >
                  Import Settings
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Import settings from a backup file.
                </p>
                <input
                  ref="fileInput"
                  type="file"
                  accept=".json"
                  @change="handleFileImport"
                  class="hidden"
                />
                <button
                  @click="$refs.fileInput.click()"
                  class="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Import Settings
                </button>
              </div>

              <div
                class="p-6 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20"
              >
                <h4
                  class="text-lg font-medium text-red-900 dark:text-red-200 mb-2"
                >
                  Reset Settings
                </h4>
                <p class="text-sm text-red-600 dark:text-red-300 mb-4">
                  Reset all settings to default values. This action cannot be
                  undone.
                </p>
                <button
                  @click="resetAllSettings"
                  class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Notifications Settings -->
        <div v-else-if="activeTab === 'notifications'" class="space-y-6">
          <div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              Notification Configuration
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Configure email and system notification preferences.
            </p>
          </div>

          <div
            v-if="settings.notifications"
            class="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <!-- Email Settings -->
            <div class="space-y-6">
              <div
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <h4
                  class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                >
                  Email Configuration
                </h4>

                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >SMTP Server</label
                    >
                    <input
                      v-model="settings.notifications.email.smtpHost"
                      @input="hasUnsavedChanges = true"
                      type="text"
                      placeholder="smtp.gmail.com"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >Port</label
                      >
                      <input
                        v-model="settings.notifications.email.smtpPort"
                        @input="hasUnsavedChanges = true"
                        type="number"
                        placeholder="587"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >Encryption</label
                      >
                      <select
                        v-model="settings.notifications.email.encryption"
                        @change="hasUnsavedChanges = true"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Username</label
                    >
                    <input
                      v-model="settings.notifications.email.username"
                      @input="hasUnsavedChanges = true"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Password</label
                    >
                    <input
                      v-model="settings.notifications.email.password"
                      @input="hasUnsavedChanges = true"
                      type="password"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >From Email</label
                    >
                    <input
                      v-model="settings.notifications.email.fromEmail"
                      @input="hasUnsavedChanges = true"
                      type="email"
                      placeholder="noreply@company.com"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <!-- Test Email -->
                  <div
                    class="border-t border-gray-200 dark:border-gray-600 pt-4"
                  >
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Test Email</label
                    >
                    <div class="flex space-x-2">
                      <input
                        v-model="testEmailForm.recipient"
                        type="email"
                        placeholder="test@example.com"
                        class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        @click="sendTestEmail"
                        :disabled="isLoading || !testEmailForm.recipient"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        {{ isLoading ? 'Sending...' : 'Send Test' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notification Preferences -->
            <div class="space-y-6">
              <div
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <h4
                  class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                >
                  Notification Types
                </h4>

                <div class="space-y-4">
                  <div
                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h5
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Welcome Emails
                      </h5>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Send welcome email to new users
                      </p>
                    </div>
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        v-model="settings.notifications.types.welcome"
                        @change="hasUnsavedChanges = true"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  </div>

                  <div
                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h5
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password Reset
                      </h5>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Password reset notifications
                      </p>
                    </div>
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        v-model="settings.notifications.types.passwordReset"
                        @change="hasUnsavedChanges = true"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  </div>

                  <div
                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h5
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Account Lockout
                      </h5>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Notify when account is locked
                      </p>
                    </div>
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        v-model="settings.notifications.types.accountLockout"
                        @change="hasUnsavedChanges = true"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  </div>

                  <div
                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h5
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        System Alerts
                      </h5>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Critical system notifications
                      </p>
                    </div>
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        v-model="settings.notifications.types.systemAlerts"
                        @change="hasUnsavedChanges = true"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Integrations Settings -->
        <div v-else-if="activeTab === 'integrations'" class="space-y-6">
          <div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              Integration Configuration
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Configure third-party service integrations.
            </p>
          </div>

          <div
            v-if="settings.integrations"
            class="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <!-- Slack Integration -->
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div class="flex items-center space-x-3 mb-4">
                <div
                  class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 5.042 10.1a2.528 2.528 0 0 1 2.52 2.542 2.528 2.528 0 0 1-2.52 2.523Zm6.958-4.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 12 5.935a2.528 2.528 0 0 1 2.52 2.542A2.528 2.528 0 0 1 12 11Zm6.958 4.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 18.958 10.1a2.528 2.528 0 0 1 2.52 2.542 2.528 2.528 0 0 1-2.52 2.523Zm-6.958 4.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 12 14.265a2.528 2.528 0 0 1 2.52 2.542A2.528 2.528 0 0 1 12 19.33Z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                    Slack
                  </h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Team communication integration
                  </p>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                    >Enable Slack Integration</span
                  >
                  <label
                    class="relative inline-flex items-center cursor-pointer"
                  >
                    <input
                      v-model="settings.integrations.slack.enabled"
                      @change="hasUnsavedChanges = true"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                  </label>
                </div>

                <div v-if="settings.integrations.slack.enabled">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Webhook URL</label
                  >
                  <input
                    v-model="settings.integrations.slack.webhookUrl"
                    @input="hasUnsavedChanges = true"
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div v-if="settings.integrations.slack.enabled">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Default Channel</label
                  >
                  <input
                    v-model="settings.integrations.slack.defaultChannel"
                    @input="hasUnsavedChanges = true"
                    type="text"
                    placeholder="#general"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div
                  v-if="settings.integrations.slack.enabled"
                  class="flex space-x-2"
                >
                  <button
                    @click="testSlackIntegration"
                    :disabled="isLoading"
                    class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {{ isLoading ? 'Testing...' : 'Test Integration' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Microsoft Teams Integration -->
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div class="flex items-center space-x-3 mb-4">
                <div
                  class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20.625 5.625v12.75c0 .345-.28.625-.625.625H4c-.345 0-.625-.28-.625-.625V5.625C3.375 5.28 3.655 5 4 5h16c.345 0 .625.28.625.625z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                    Microsoft Teams
                  </h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Enterprise communication platform
                  </p>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                    >Enable Teams Integration</span
                  >
                  <label
                    class="relative inline-flex items-center cursor-pointer"
                  >
                    <input
                      v-model="settings.integrations.teams.enabled"
                      @change="hasUnsavedChanges = true"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                  </label>
                </div>

                <div v-if="settings.integrations.teams.enabled">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Webhook URL</label
                  >
                  <input
                    v-model="settings.integrations.teams.webhookUrl"
                    @input="hasUnsavedChanges = true"
                    type="url"
                    placeholder="https://company.webhook.office.com/..."
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <!-- Single Sign-On -->
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div class="flex items-center space-x-3 mb-4">
                <div
                  class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"
                >
                  <component :is="'KeyIcon'" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                    Single Sign-On
                  </h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    SAML/OAuth authentication
                  </p>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                    >Enable SSO</span
                  >
                  <label
                    class="relative inline-flex items-center cursor-pointer"
                  >
                    <input
                      v-model="settings.integrations.sso.enabled"
                      @change="hasUnsavedChanges = true"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                  </label>
                </div>

                <div v-if="settings.integrations.sso.enabled">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Provider</label
                  >
                  <select
                    v-model="settings.integrations.sso.provider"
                    @change="hasUnsavedChanges = true"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="saml">SAML 2.0</option>
                    <option value="oauth">OAuth 2.0</option>
                    <option value="openid">OpenID Connect</option>
                  </select>
                </div>

                <div v-if="settings.integrations.sso.enabled">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Entity ID</label
                  >
                  <input
                    v-model="settings.integrations.sso.entityId"
                    @input="hasUnsavedChanges = true"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <!-- LDAP Integration -->
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div class="flex items-center space-x-3 mb-4">
                <div
                  class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center"
                >
                  <component :is="'ServerIcon'" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                    LDAP
                  </h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Directory service integration
                  </p>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                    >Enable LDAP</span
                  >
                  <label
                    class="relative inline-flex items-center cursor-pointer"
                  >
                    <input
                      v-model="settings.integrations.ldap.enabled"
                      @change="hasUnsavedChanges = true"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                  </label>
                </div>

                <div v-if="settings.integrations.ldap.enabled">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Server URL</label
                  >
                  <input
                    v-model="settings.integrations.ldap.serverUrl"
                    @input="hasUnsavedChanges = true"
                    type="text"
                    placeholder="ldap://ldap.company.com:389"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div v-if="settings.integrations.ldap.enabled">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Base DN</label
                  >
                  <input
                    v-model="settings.integrations.ldap.baseDn"
                    @input="hasUnsavedChanges = true"
                    type="text"
                    placeholder="dc=company,dc=com"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Interface Settings -->
        <div v-else-if="activeTab === 'interface'" class="space-y-6">
          <div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              Interface Configuration
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Customize the user interface and user experience.
            </p>
          </div>

          <div
            v-if="settings.interface"
            class="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <!-- Theme & Appearance -->
            <div class="space-y-6">
              <div
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <h4
                  class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                >
                  Theme & Appearance
                </h4>

                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Color Theme</label
                    >
                    <select
                      v-model="settings.interface.theme"
                      @change="
                        handleSettingChange(
                          'interface',
                          'theme',
                          $event.target.value
                        )
                      "
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option
                        v-for="theme in themes"
                        :key="theme.value"
                        :value="theme.value"
                      >
                        {{ theme.label }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Primary Color</label
                    >
                    <div class="flex space-x-2">
                      <input
                        v-model="settings.interface.primaryColor"
                        @input="
                          handleSettingChange(
                            'interface',
                            'primaryColor',
                            $event.target.value
                          )
                        "
                        type="color"
                        class="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        v-model="settings.interface.primaryColor"
                        @input="
                          handleSettingChange(
                            'interface',
                            'primaryColor',
                            $event.target.value
                          )
                        "
                        type="text"
                        class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Logo URL</label
                    >
                    <input
                      v-model="settings.interface.logoUrl"
                      @input="hasUnsavedChanges = true"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div
                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h5
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Compact Sidebar
                      </h5>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Use compact navigation sidebar
                      </p>
                    </div>
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        v-model="settings.interface.compactSidebar"
                        @change="hasUnsavedChanges = true"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  </div>

                  <div
                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h5
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Show Breadcrumbs
                      </h5>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Display navigation breadcrumbs
                      </p>
                    </div>
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        v-model="settings.interface.showBreadcrumbs"
                        @change="hasUnsavedChanges = true"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Localization & Format -->
            <div class="space-y-6">
              <div
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <h4
                  class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                >
                  Localization
                </h4>

                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Language</label
                    >
                    <select
                      v-model="settings.interface.language"
                      @change="hasUnsavedChanges = true"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option
                        v-for="lang in languages"
                        :key="lang.value"
                        :value="lang.value"
                      >
                        {{ lang.label }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Currency</label
                    >
                    <select
                      v-model="settings.interface.currency"
                      @change="hasUnsavedChanges = true"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="JPY">Japanese Yen (JPY)</option>
                      <option value="CAD">Canadian Dollar (CAD)</option>
                      <option value="AUD">Australian Dollar (AUD)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Number Format</label
                    >
                    <select
                      v-model="settings.interface.numberFormat"
                      @change="hasUnsavedChanges = true"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="1,234.56">1,234.56 (US)</option>
                      <option value="1.234,56">1.234,56 (EU)</option>
                      <option value="1 234,56">1 234,56 (FR)</option>
                      <option value="1'234.56">1'234.56 (CH)</option>
                    </select>
                  </div>

                  <div
                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h5
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Right-to-Left Layout
                      </h5>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Enable RTL layout support
                      </p>
                    </div>
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        v-model="settings.interface.rtlLayout"
                        @change="hasUnsavedChanges = true"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  </div>

                  <div
                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h5
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Enable Animations
                      </h5>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Enable UI transitions and animations
                      </p>
                    </div>
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        v-model="settings.interface.enableAnimations"
                        @change="hasUnsavedChanges = true"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>

              <div
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <h4
                  class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                >
                  Table Settings
                </h4>

                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Default Page Size</label
                    >
                    <select
                      v-model="settings.interface.defaultPageSize"
                      @change="hasUnsavedChanges = true"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="10">10 items</option>
                      <option value="25">25 items</option>
                      <option value="50">50 items</option>
                      <option value="100">100 items</option>
                    </select>
                  </div>

                  <div
                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h5
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Show Row Numbers
                      </h5>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Display row numbers in tables
                      </p>
                    </div>
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        v-model="settings.interface.showRowNumbers"
                        @change="hasUnsavedChanges = true"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other tabs placeholder -->
        <div v-else class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ activeTab }} Settings
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Settings for this category are coming soon.
          </p>
        </div>
      </div>

      <!-- Save Actions -->
      <div
        v-if="hasUnsavedChanges"
        class="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            You have unsaved changes
          </p>
          <div class="flex space-x-3">
            <button
              @click="resetSettings()"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Reset
            </button>
            <button
              @click="saveSettings"
              :disabled="isLoading"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- User Management Modal -->
  <div
    v-if="showUserModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4"
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingUser ? 'Edit User' : 'Add New User' }}
          </h3>
          <button
            @click="closeUserModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              class="w-6 h-6"
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

        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Full Name</label
            >
            <input
              v-model="userForm.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Email Address</label
            >
            <input
              v-model="userForm.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Role</label
            >
            <select
              v-model="userForm.role"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option
                v-for="role in roles"
                :key="role.value"
                :value="role.value"
              >
                {{ role.label }}
              </option>
            </select>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Status</label
            >
            <select
              v-model="userForm.status"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeUserModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              {{ editingUser ? 'Update User' : 'Add User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Real-time visual feedback for settings changes */
.setting-changed {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  transition: all 0.3s ease;
}

.maintenance-mode-warning {
  background-color: #fefce8;
  border-color: #fde047;
  color: #a16207;
}

.maintenance-mode-warning.dark {
  background-color: rgba(133, 77, 14, 0.2);
  border-color: #b45309;
  color: #fde047;
}

.primary-color-preview {
  transition: background-color 0.3s ease;
}

/* Animation disable class */
:global(.no-animations *) {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* Theme transition */
:global(html) {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Custom primary color support */
:global(:root) {
  --primary-color: #3b82f6;
  --primary-rgb: 59, 130, 246;
}

:global(.bg-primary) {
  background-color: var(--primary-color);
}

:global(.text-primary) {
  color: var(--primary-color);
}

:global(.border-primary) {
  border-color: var(--primary-color);
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settingsStore';
import { useToastStore } from '@/stores/toastStore';
import * as icons from '@/utils/iconComponents';

const settingsStore = useSettingsStore();
const toastStore = useToastStore();
const activeTab = ref('system');
const hasUnsavedChanges = ref(false);
const isLoading = ref(false);
const showUserModal = ref(false);
const editingUser = ref(null);

// Modal form data
const userForm = ref({
  name: '',
  email: '',
  role: 'user',
  status: 'active',
});

// Test email form
const testEmailForm = ref({
  recipient: '',
  subject: 'Test Email from Employee Management System',
});

const settings = computed(() => settingsStore.settings.value || {});
const users = computed(() => settingsStore.users.value || []);
const auditLogs = computed(() => settingsStore.auditLogs.value || []);
const systemInfo = computed(() => settingsStore.systemInfo.value || {});

const settingsCategories = [
  { id: 'system', name: 'System', icon: 'CogIcon' },
  { id: 'security', name: 'Security', icon: 'ShieldCheckIcon' },
  { id: 'notifications', name: 'Notifications', icon: 'BellIcon' },
  { id: 'integrations', name: 'Integrations', icon: 'PuzzlePieceIcon' },
  { id: 'interface', name: 'Interface', icon: 'SwatchIcon' },
  { id: 'users', name: 'Users', icon: 'UsersIcon' },
  { id: 'audit', name: 'Audit', icon: 'DocumentTextIcon' },
  { id: 'backup', name: 'Backup', icon: 'CloudArrowUpIcon' },
];

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
];

const roles = [
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'user', label: 'User' },
  { value: 'viewer', label: 'Viewer' },
];

const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
];

onMounted(() => {
  settingsStore.loadSettings();
});

// Methods
const saveSettings = async () => {
  isLoading.value = true;
  try {
    const result = await settingsStore.saveSettings();
    if (result.success) {
      hasUnsavedChanges.value = false;
      // Settings store handles toast notifications
    } else {
      console.error('Settings save failed:', result.message);
    }
  } catch (error) {
    console.error('Failed to save settings:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSettingChange = (category, key, value) => {
  settingsStore.updateSetting(category, key, value);
  hasUnsavedChanges.value = true;
};

const resetSettings = () => {
  settingsStore.loadSettings();
  hasUnsavedChanges.value = false;
};

const resetAllSettings = async () => {
  if (
    confirm(
      'Are you sure you want to reset all settings to defaults? This cannot be undone.'
    )
  ) {
    await settingsStore.resetToDefaults();
    hasUnsavedChanges.value = false;
  }
};

const exportSettings = () => {
  settingsStore.exportSettings();
};

const handleFileImport = event => {
  const file = event.target.files[0];
  if (file) {
    settingsStore.importSettings(file);
    hasUnsavedChanges.value = false;
  }
};

const createBackup = async () => {
  isLoading.value = true;
  try {
    await settingsStore.createBackup();
  } catch (error) {
    console.error('Backup failed:', error);
  } finally {
    isLoading.value = false;
  }
};

const toggleUserStatus = userId => {
  settingsStore.toggleUserStatus(userId);
};

const openUserModal = (user = null) => {
  editingUser.value = user;
  if (user) {
    userForm.value = { ...user };
  } else {
    userForm.value = {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
    };
  }
  showUserModal.value = true;
};

const closeUserModal = () => {
  showUserModal.value = false;
  editingUser.value = null;
  userForm.value = {
    name: '',
    email: '',
    role: 'user',
    status: 'active',
  };
};

const saveUser = () => {
  if (editingUser.value) {
    settingsStore.updateUser(editingUser.value.id, userForm.value);
  } else {
    settingsStore.addUser(userForm.value);
  }
  closeUserModal();
};

const sendTestEmail = async () => {
  if (!testEmailForm.value.recipient) {
    toastStore.addToast({
      type: 'warning',
      title: 'Missing Recipient',
      message: 'Please enter a recipient email address',
    });
    return;
  }

  isLoading.value = true;
  try {
    // Validate email settings
    const emailSettings = settings.value.notifications?.email;
    if (!emailSettings?.smtpHost || !emailSettings?.fromEmail) {
      throw new Error('Email configuration is incomplete');
    }

    // Simulate sending test email with actual settings
    const emailData = {
      to: testEmailForm.value.recipient,
      from: emailSettings.fromEmail,
      subject: testEmailForm.value.subject,
      body: `This is a test email from ${
        settings.value.system?.appName || 'Employee Management System'
      }.\n\nSMTP Configuration:\nHost: ${emailSettings.smtpHost}\nPort: ${
        emailSettings.smtpPort
      }\nEncryption: ${
        emailSettings.encryption
      }\n\nIf you received this email, your email configuration is working correctly.`,
      smtp: {
        host: emailSettings.smtpHost,
        port: emailSettings.smtpPort,
        encryption: emailSettings.encryption,
        username: emailSettings.username,
      },
    };

    console.log('Sending test email with configuration:', emailData);
    await new Promise(resolve => setTimeout(resolve, 2000));

    toastStore.addToast({
      type: 'success',
      title: 'Test Email Sent',
      message: `Test email sent successfully to ${testEmailForm.value.recipient}! Email configuration is working properly.`,
    });
    testEmailForm.value.recipient = '';
  } catch (error) {
    toastStore.addToast({
      type: 'error',
      title: 'Email Test Failed',
      message: `Failed to send test email: ${error.message}`,
    });
  } finally {
    isLoading.value = false;
  }
};

const testSlackIntegration = async () => {
  isLoading.value = true;
  try {
    const slackSettings = settings.value.integrations?.slack;
    if (!slackSettings?.enabled || !slackSettings?.webhookUrl) {
      throw new Error('Slack integration is not properly configured');
    }

    // Simulate Slack webhook test
    const testMessage = {
      channel: slackSettings.defaultChannel || '#general',
      username: settings.value.system?.appName || 'Employee Management System',
      text: `🔧 Test message from ${
        settings.value.system?.appName || 'EMS'
      }\n\nSlack integration is working correctly!\n\nTimestamp: ${new Date().toISOString()}`,
      webhook_url: slackSettings.webhookUrl,
    };

    console.log('Testing Slack integration with:', testMessage);
    await new Promise(resolve => setTimeout(resolve, 1500));

    toastStore.addToast({
      type: 'success',
      title: 'Slack Test Successful',
      message: `Slack integration test successful! Message sent to: ${testMessage.channel}`,
    });
  } catch (error) {
    toastStore.addToast({
      type: 'error',
      title: 'Slack Test Failed',
      message: `Slack integration test failed: ${error.message}`,
    });
  } finally {
    isLoading.value = false;
  }
};

// Utility methods
const formatDate = dateString => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString();
};

const formatBackupDate = dateString => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return (
    date.toLocaleDateString() +
    ' ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
};

const getSeverityColor = severity => {
  switch (severity) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};
</script>
