<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">Profile Settings</h2>
              <p class="text-blue-100">Manage your account information</p>
            </div>
          </div>
          <button 
            @click="$emit('close')"
            class="text-white hover:text-blue-200 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- Profile Picture and Basic Info -->
        <div class="flex items-center space-x-6 mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div class="relative">
            <div class="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-3xl font-bold">{{ currentUser?.name?.charAt(0) || 'U' }}</span>
            </div>
            <button 
              v-if="hasPermission('edit_own_profile')"
              class="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              title="Change avatar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ currentUser?.name }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ currentUser?.position }}</p>
            <div class="flex items-center space-x-2 mt-2">
              <span class="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {{ currentUser?.role }}
              </span>
              <span v-if="currentUser?.isActive" class="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button 
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div v-if="activeTab === 'personal'">
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input 
                  v-model="profileForm.name"
                  type="text" 
                  :disabled="!hasPermission('edit_own_profile') || isUpdating"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input 
                  v-model="profileForm.email"
                  type="email" 
                  disabled
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  placeholder="Email cannot be changed"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input 
                  v-model="profileForm.phone"
                  type="tel" 
                  :disabled="!hasPermission('edit_own_profile') || isUpdating"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your phone number"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
                <input 
                  v-model="profileForm.position"
                  type="text" 
                  :disabled="!hasPermission('edit_own_profile') || isUpdating"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your position"
                >
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                <input 
                  v-model="profileForm.department"
                  type="text" 
                  disabled
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  placeholder="Department assignment cannot be changed"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Join Date</label>
                <input 
                  :value="formatDate(currentUser?.joinDate)"
                  type="text" 
                  disabled
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                >
              </div>
            </div>

            <div v-if="hasPermission('edit_own_profile')" class="flex justify-end">
              <button 
                type="submit"
                :disabled="isUpdating"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg v-if="isUpdating" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isUpdating ? 'Updating...' : 'Update Profile' }}</span>
              </button>
            </div>
          </form>
        </div>

        <div v-else-if="activeTab === 'security'">
          <form @submit.prevent="changePassword" class="space-y-6">
            <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div class="flex">
                <svg class="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Security Notice</h3>
                  <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>Make sure your new password is strong and unique. It should contain at least 8 characters with a mix of letters, numbers, and symbols.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                <input 
                  v-model="passwordForm.currentPassword"
                  type="password" 
                  required
                  :disabled="isChangingPassword"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your current password"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <input 
                  v-model="passwordForm.newPassword"
                  type="password" 
                  required
                  :disabled="isChangingPassword"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your new password"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                <input 
                  v-model="passwordForm.confirmPassword"
                  type="password" 
                  required
                  :disabled="isChangingPassword"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Confirm your new password"
                >
              </div>
            </div>

            <div v-if="passwordError" class="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
              <p class="text-sm text-red-700 dark:text-red-300">{{ passwordError }}</p>
            </div>

            <div class="flex justify-end">
              <button 
                type="submit"
                :disabled="isChangingPassword || !isPasswordFormValid"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg v-if="isChangingPassword" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isChangingPassword ? 'Changing...' : 'Change Password' }}</span>
              </button>
            </div>
          </form>
        </div>

        <div v-else-if="activeTab === 'activity'">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
            </div>
            
            <div class="space-y-3">
              <div v-for="activity in activityLog" :key="activity.id" class="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div :class="[
                  'w-2 h-2 rounded-full mt-2',
                  activity.type === 'login' ? 'bg-green-500' : 
                  activity.type === 'update' ? 'bg-blue-500' : 
                  activity.type === 'security' ? 'bg-yellow-500' : 'bg-gray-500'
                ]"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.action }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ activity.timestamp }}</p>
                  <p v-if="activity.details" class="text-xs text-gray-600 dark:text-gray-300 mt-1">{{ activity.details }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="absolute top-4 right-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg shadow-lg">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-sm font-medium">{{ successMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'UserProfileModal',
  emits: ['close'],
  setup() {
    const { currentUser, updateProfile: authUpdateProfile, changePassword: authChangePassword, hasPermission } = useAuthStore()
    
    const activeTab = ref('personal')
    const isUpdating = ref(false)
    const isChangingPassword = ref(false)
    const successMessage = ref('')
    const passwordError = ref('')

    const tabs = [
      { id: 'personal', name: 'Personal Info' },
      { id: 'security', name: 'Security' },
      { id: 'activity', name: 'Activity Log' }
    ]

    const profileForm = ref({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
    })

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const activityLog = ref([
      {
        id: 1,
        action: 'Logged in',
        type: 'login',
        timestamp: 'Today at 9:30 AM',
        details: 'From Chrome on Windows'
      },
      {
        id: 2,
        action: 'Profile updated',
        type: 'update',
        timestamp: 'Yesterday at 2:15 PM',
        details: 'Changed phone number'
      },
      {
        id: 3,
        action: 'Password changed',
        type: 'security',
        timestamp: '3 days ago at 11:45 AM',
        details: 'Security settings updated'
      },
      {
        id: 4,
        action: 'Logged in',
        type: 'login',
        timestamp: '5 days ago at 8:20 AM',
        details: 'From Firefox on Windows'
      }
    ])

    const isPasswordFormValid = computed(() => {
      return passwordForm.value.currentPassword && 
             passwordForm.value.newPassword && 
             passwordForm.value.confirmPassword &&
             passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
             passwordForm.value.newPassword.length >= 8
    })

    const initializeForm = () => {
      if (currentUser.value) {
        profileForm.value = {
          name: currentUser.value.name || '',          email: currentUser.value.email || '',
          phone: currentUser.value.phone || '',
          position: currentUser.value.position || '',
          department: currentUser.value.department || '',
        }
      }
    }

    const updateProfile = async () => {
      if (!hasPermission('edit_own_profile')) return
      
      isUpdating.value = true
      try {
        await authUpdateProfile(profileForm.value)
        showSuccessMessage('Profile updated successfully!')
      } catch (error) {
        console.error('Failed to update profile:', error)
      } finally {
        isUpdating.value = false
      }
    }

    const changePassword = async () => {
      passwordError.value = ''
      
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordError.value = 'New passwords do not match'
        return
      }

      if (passwordForm.value.newPassword.length < 8) {
        passwordError.value = 'Password must be at least 8 characters long'
        return
      }

      isChangingPassword.value = true
      try {
        await authChangePassword(passwordForm.value.currentPassword, passwordForm.value.newPassword)
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        showSuccessMessage('Password changed successfully!')
      } catch (error) {
        passwordError.value = error.message || 'Failed to change password'
      } finally {
        isChangingPassword.value = false
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const showSuccessMessage = (message) => {
      successMessage.value = message
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }

    onMounted(() => {
      initializeForm()
    })

    return {
      currentUser,
      activeTab,
      tabs,
      profileForm,
      passwordForm,
      activityLog,
      isUpdating,
      isChangingPassword,
      successMessage,
      passwordError,
      isPasswordFormValid,
      hasPermission,
      updateProfile,
      changePassword,
      formatDate
    }
  }
}
</script>
