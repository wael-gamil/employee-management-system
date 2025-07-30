<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
      <div class="text-center mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
        <p class="text-gray-600 dark:text-gray-300">Sign in to your account</p>
      </div>

      <!-- Demo Users Selection -->
      <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Demo Users</h3>
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="(user, email) in SAMPLE_USERS" 
            :key="email"
            @click="selectDemoUser(email)"
            class="text-xs p-2 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
          >
            {{ user.role }}
          </button>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input 
            v-model="loginForm.email" 
            type="email" 
            required
            :disabled="isLoading"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your email"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <div class="relative">
            <input 
              v-model="loginForm.password" 
              :type="showPassword ? 'text' : 'password'"
              required
              :disabled="isLoading"
              class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
            >
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input 
              v-model="loginForm.rememberMe"
              type="checkbox" 
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :disabled="isLoading"
            >
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">Remember me</span>
          </label>
          <a href="#" class="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
        </div>
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <!-- Demo Instructions -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Use password: <span class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">password</span> for all demo users
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'LoginScreen',
  setup() {
    const { loginForm, login, SAMPLE_USERS, isLoading } = useAuthStore()
    const error = ref('')
    const showPassword = ref(false)

    const selectDemoUser = (email) => {
      loginForm.value.email = email
      loginForm.value.password = 'password'
      error.value = ''
    }

    const handleLogin = async () => {
      if (isLoading.value) return
      
      error.value = ''
      
      try {
        await login()
        // Login successful - the auth store will handle state changes
      } catch (err) {
        error.value = err.message || 'Login failed. Please try again.'
      }
    }

    return {
      loginForm,
      error,
      showPassword,
      isLoading,
      SAMPLE_USERS,
      handleLogin,
      selectDemoUser
    }
  }
}
</script>
