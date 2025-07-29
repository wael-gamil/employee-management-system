<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-all duration-300">
    <!-- Loading Screen -->
    <div v-if="isLoading" class="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">Loading Employee Management System...</p>
      </div>
    </div>

    <!-- Login Screen -->
    <div v-else-if="!isAuthenticated" class="min-h-screen flex items-center justify-center p-4">
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

        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input 
              v-model="loginForm.email" 
              type="email" 
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="Enter your email"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input 
              v-model="loginForm.password" 
              type="password" 
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="Enter your password"
            >
          </div>
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">Remember me</span>
            </label>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
          </div>
          <button 
            type="submit" 
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>

    <!-- Main Application -->
    <div v-else class="flex h-screen">
      <!-- Sidebar -->
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

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between px-6 py-4">
            <div class="flex items-center space-x-4">
              <button 
                @click="sidebarOpen = !sidebarOpen"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ getCurrentViewTitle() }}</h2>
            </div>

            <div class="flex items-center space-x-4">
              <!-- Theme Toggle -->
              <button 
                @click="toggleTheme"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg v-if="isDark" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                </svg>
                <svg v-else class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
                </svg>
              </button>

              <!-- Notifications -->
              <div class="relative">
                <button 
                  @click="showNotifications = !showNotifications"
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative"
                >
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v3.5"></path>
                  </svg>
                  <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </button>

                <!-- Notifications Dropdown -->
                <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div class="max-h-64 overflow-y-auto">
                    <div v-for="notification in notifications" :key="notification.id" class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ notification.title }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ notification.message }}</p>
                          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ notification.time }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- User Menu -->
              <div class="relative">
                <button 
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">{{ currentUser.name.charAt(0) }}</span>
                  </div>
                </button>

                <!-- User Dropdown -->
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ currentUser.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ currentUser.email }}</p>
                  </div>
                  <div class="py-2">
                    <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Profile Settings</button>
                    <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Activity Log</button>
                    <hr class="my-2 border-gray-200 dark:border-gray-700">
                    <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Sign Out</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-1 overflow-auto p-6">
          <!-- Dashboard -->
          <div v-if="currentView === 'dashboard'" class="space-y-6">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="stat in dashboardStats" :key="stat.title" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 transform hover:scale-105">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stat.value }}</p>
                    <p :class="['text-sm mt-2', stat.change > 0 ? 'text-green-600' : 'text-red-600']">
                      {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}% from last month
                    </p>
                  </div>
                  <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', stat.bgColor]">
                    <component :is="stat.icon" class="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div class="space-y-4">
                <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div :class="['w-10 h-10 rounded-full flex items-center justify-center', activity.bgColor]">
                    <component :is="activity.icon" class="w-5 h-5 text-white" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.description }}</p>
                  </div>
                  <span class="text-xs text-gray-400 dark:text-gray-500">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Companies -->
          <div v-else-if="currentView === 'companies'" class="space-y-6">
            <!-- Header Actions -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <input 
                    v-model="companySearch" 
                    type="text" 
                    placeholder="Search companies..." 
                    class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                  <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <select v-model="companyFilter" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                  <option value="">All Companies</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div class="flex items-center space-x-3">
                <button 
                  @click="showCompanyModal = true; editingCompany = null"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span>Add Company</span>
                </button>
                <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                  </svg>
                  <span>Import</span>
                </button>
              </div>
            </div>

            <!-- Companies Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="company in filteredCompanies" :key="company.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105">
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-lg">{{ company.name.charAt(0) }}</span>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ company.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ company.code }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button 
                        @click="editCompany(company)"
                        class="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="deleteCompany(company.id)"
                        class="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {{ company.address }}
                    </div>
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      {{ company.employeeCount }} employees
                    </div>
                    <div class="flex items-center justify-between mt-4">
                      <span :class="['px-2 py-1 rounded-full text-xs font-medium', company.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200']">
                        {{ company.status }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ company.departments }} departments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Employees -->
          <div v-else-if="currentView === 'employees'" class="space-y-6">
            <!-- Header Actions -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <input 
                    v-model="employeeSearch" 
                    type="text" 
                    placeholder="Search employees..." 
                    class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                  <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <select v-model="employeeFilter" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              <div class="flex items-center space-x-3">
                <button 
                  @click="showEmployeeWizard = true"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span>Add Employee</span>
                </button>
                <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                  </svg>
                  <span>Import</span>
                </button>
              </div>
            </div>

            <!-- Employees Table -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hire Date</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="employee in filteredEmployees" :key="employee.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                            <span class="text-white font-medium text-sm">{{ employee.name.split(' ').map(n => n[0]).join('') }}</span>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ employee.name }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">{{ employee.email }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ employee.department }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ employee.role }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', employee.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200']">
                          {{ employee.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ employee.hireDate }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex items-center justify-end space-x-2">
                          <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
                          <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Departments -->
          <div v-else-if="currentView === 'departments'" class="space-y-6">
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Department Management</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">This feature is coming soon. Manage departments with drag-and-drop reordering and in-place editing.</p>
            </div>
          </div>

          <!-- Reports -->
          <div v-else-if="currentView === 'reports'" class="space-y-6">
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Reports & Analytics</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Custom report builder and scheduled reports coming soon.</p>
            </div>
          </div>

          <!-- Settings -->
          <div v-else-if="currentView === 'settings'" class="space-y-6">
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">System Settings</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">User management, audit logs, and system configuration coming soon.</p>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Company Modal -->
    <div v-if="showCompanyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingCompany ? 'Edit Company' : 'Add New Company' }}
            </h3>
            <button @click="showCompanyModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveCompany" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
              <input 
                v-model="companyForm.name" 
                type="text" 
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter company name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Code</label>
              <input 
                v-model="companyForm.code" 
                type="text" 
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter company code"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
              <textarea 
                v-model="companyForm.address" 
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter company address"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select 
                v-model="companyForm.status"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                @click="showCompanyModal = false"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                {{ editingCompany ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Employee Wizard Modal -->
    <div v-if="showEmployeeWizard" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add New Employee</h3>
            <button @click="showEmployeeWizard = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Wizard Steps -->
          <div class="flex items-center justify-center mb-8">
            <div class="flex items-center space-x-4">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', wizardStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400']">1</div>
              <div :class="['w-16 h-1', wizardStep > 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700']"></div>
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', wizardStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400']">2</div>
              <div :class="['w-16 h-1', wizardStep > 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700']"></div>
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', wizardStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400']">3</div>
            </div>
          </div>

          <form @submit.prevent="nextWizardStep" class="space-y-6">
            <!-- Step 1: Personal Info -->
            <div v-if="wizardStep === 1" class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input 
                    v-model="employeeForm.firstName" 
                    type="text" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input 
                    v-model="employeeForm.lastName" 
                    type="text" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input 
                  v-model="employeeForm.email" 
                  type="email" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input 
                  v-model="employeeForm.phone" 
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
              </div>
            </div>

            <!-- Step 2: Role & Department -->
            <div v-if="wizardStep === 2" class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Role & Department</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                  <select 
                    v-model="employeeForm.department"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <input 
                    v-model="employeeForm.role" 
                    type="text" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hire Date</label>
                <input 
                  v-model="employeeForm.hireDate" 
                  type="date" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
              </div>
            </div>

            <!-- Step 3: Permissions -->
            <div v-if="wizardStep === 3" class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Permissions</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Available Permissions</h5>
                  <div class="space-y-2 max-h-48 overflow-y-auto">
                    <div v-for="permission in availablePermissions" :key="permission" class="flex items-center">
                      <input 
                        :id="permission" 
                        v-model="employeeForm.permissions" 
                        :value="permission" 
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      >
                      <label :for="permission" class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ permission }}</label>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Selected Permissions</h5>
                  <div class="space-y-2 max-h-48 overflow-y-auto">
                    <div v-for="permission in employeeForm.permissions" :key="permission" class="bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                      {{ permission }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-between pt-6">
              <button 
                v-if="wizardStep > 1"
                type="button" 
                @click="wizardStep--"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Previous
              </button>
              <div v-else></div>
              <div class="flex space-x-3">
                <button 
                  type="button" 
                  @click="showEmployeeWizard = false"
                  class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  {{ wizardStep === 3 ? 'Create Employee' : 'Next' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'EmployeeManagementSystem',
  setup() {
    // Reactive state
    const isLoading = ref(true)
    const isAuthenticated = ref(false)
    const isDark = ref(false)
    const sidebarOpen = ref(true)
    const currentView = ref('dashboard')
    const showNotifications = ref(false)
    const showUserMenu = ref(false)
    const showCompanyModal = ref(false)
    const showEmployeeWizard = ref(false)
    const wizardStep = ref(1)
    const editingCompany = ref(null)

    // Search and filter states
    const companySearch = ref('')
    const companyFilter = ref('')
    const employeeSearch = ref('')
    const employeeFilter = ref('')

    // Form states
    const loginForm = ref({
      email: 'admin@company.com',
      password: 'password'
    })

    const companyForm = ref({
      name: '',
      code: '',
      address: '',
      status: 'active'
    })

    const employeeForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      role: '',
      hireDate: '',
      permissions: []
    })

    // Current user
    const currentUser = ref({
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Administrator'
    })

    // Menu items based on role
    const menuItems = ref([
      { id: 'dashboard', name: 'Dashboard', icon: 'DashboardIcon' },
      { id: 'companies', name: 'Companies', icon: 'CompanyIcon' },
      { id: 'employees', name: 'Employees', icon: 'EmployeeIcon' },
      { id: 'departments', name: 'Departments', icon: 'DepartmentIcon' },
      { id: 'reports', name: 'Reports', icon: 'ReportIcon' },
      { id: 'settings', name: 'Settings', icon: 'SettingsIcon' }
    ])

    // Dashboard stats
    const dashboardStats = ref([
      {
        title: 'Total Companies',
        value: '24',
        change: 12,
        icon: 'CompanyIcon',
        bgColor: 'bg-blue-500'
      },
      {
        title: 'Total Employees',
        value: '1,234',
        change: 8,
        icon: 'EmployeeIcon',
        bgColor: 'bg-green-500'
      },
      {
        title: 'Departments',
        value: '48',
        change: -2,
        icon: 'DepartmentIcon',
        bgColor: 'bg-purple-500'
      },
      {
        title: 'Active Projects',
        value: '156',
        change: 15,
        icon: 'ProjectIcon',
        bgColor: 'bg-orange-500'
      }
    ])

    // Recent activity
    const recentActivity = ref([
      {
        id: 1,
        title: 'New employee added',
        description: 'Sarah Johnson joined Engineering department',
        time: '2 hours ago',
        icon: 'EmployeeIcon',
        bgColor: 'bg-green-500'
      },
      {
        id: 2,
        title: 'Company updated',
        description: 'TechCorp address information was modified',
        time: '4 hours ago',
        icon: 'CompanyIcon',
        bgColor: 'bg-blue-500'
      },
      {
        id: 3,
        title: 'Department created',
        description: 'New Marketing department established',
        time: '1 day ago',
        icon: 'DepartmentIcon',
        bgColor: 'bg-purple-500'
      },
      {
        id: 4,
        title: 'Bulk import completed',
        description: '25 employees imported successfully',
        time: '2 days ago',
        icon: 'ImportIcon',
        bgColor: 'bg-orange-500'
      }
    ])

    // Notifications
    const notifications = ref([
      {
        id: 1,
        title: 'System Update',
        message: 'New features have been deployed',
        time: '1 hour ago'
      },
      {
        id: 2,
        title: 'Backup Complete',
        message: 'Daily backup completed successfully',
        time: '3 hours ago'
      },
      {
        id: 3,
        title: 'New User Registration',
        message: '5 new users registered today',
        time: '6 hours ago'
      }
    ])

    // Companies data
    const companies = ref([
      {
        id: 1,
        name: 'TechCorp Solutions',
        code: 'TECH001',
        address: '123 Tech Street, Silicon Valley, CA',
        status: 'active',
        employeeCount: 150,
        departments: 8
      },
      {
        id: 2,
        name: 'Innovation Labs',
        code: 'INNO002',
        address: '456 Innovation Ave, Austin, TX',
        status: 'active',
        employeeCount: 89,
        departments: 5
      },
      {
        id: 3,
        name: 'Digital Dynamics',
        code: 'DIGI003',
        address: '789 Digital Blvd, Seattle, WA',
        status: 'inactive',
        employeeCount: 45,
        departments: 3
      },
      {
        id: 4,
        name: 'Future Systems',
        code: 'FUTU004',
        address: '321 Future Lane, Boston, MA',
        status: 'active',
        employeeCount: 200,
        departments: 12
      },
      {
        id: 5,
        name: 'Smart Solutions',
        code: 'SMAR005',
        address: '654 Smart Way, Denver, CO',
        status: 'active',
        employeeCount: 75,
        departments: 4
      },
      {
        id: 6,
        name: 'Global Tech',
        code: 'GLOB006',
        address: '987 Global Plaza, New York, NY',
        status: 'active',
        employeeCount: 300,
        departments: 15
      }
    ])

    // Employees data
    const employees = ref([
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        department: 'Engineering',
        role: 'Senior Developer',
        status: 'active',
        hireDate: '2023-01-15'
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@techcorp.com',
        department: 'Marketing',
        role: 'Marketing Manager',
        status: 'active',
        hireDate: '2022-11-20'
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@techcorp.com',
        department: 'Sales',
        role: 'Sales Representative',
        status: 'active',
        hireDate: '2023-03-10'
      },
      {
        id: 4,
        name: 'David Wilson',
        email: 'david.wilson@techcorp.com',
        department: 'HR',
        role: 'HR Specialist',
        status: 'active',
        hireDate: '2022-08-05'
      },
      {
        id: 5,
        name: 'Lisa Thompson',
        email: 'lisa.thompson@techcorp.com',
        department: 'Engineering',
        role: 'Frontend Developer',
        status: 'active',
        hireDate: '2023-02-28'
      },
      {
        id: 6,
        name: 'James Brown',
        email: 'james.brown@techcorp.com',
        department: 'Sales',
        role: 'Sales Manager',
        status: 'inactive',
        hireDate: '2021-12-15'
      }
    ])

    // Available permissions
    const availablePermissions = ref([
      'View Dashboard',
      'Manage Companies',
      'Manage Employees',
      'Manage Departments',
      'View Reports',
      'Export Data',
      'System Settings',
      'User Management',
      'Audit Logs'
    ])

    // Computed properties
    const filteredCompanies = computed(() => {
      let filtered = companies.value

      if (companySearch.value) {
        filtered = filtered.filter(company => 
          company.name.toLowerCase().includes(companySearch.value.toLowerCase()) ||
          company.code.toLowerCase().includes(companySearch.value.toLowerCase())
        )
      }

      if (companyFilter.value) {
        filtered = filtered.filter(company => company.status === companyFilter.value)
      }

      return filtered
    })

    const filteredEmployees = computed(() => {
      let filtered = employees.value

      if (employeeSearch.value) {
        filtered = filtered.filter(employee => 
          employee.name.toLowerCase().includes(employeeSearch.value.toLowerCase()) ||
          employee.email.toLowerCase().includes(employeeSearch.value.toLowerCase())
        )
      }

      if (employeeFilter.value) {
        filtered = filtered.filter(employee => employee.department === employeeFilter.value)
      }

      return filtered
    })

    // Methods
    const login = () => {
      // Simulate login process
      setTimeout(() => {
        isAuthenticated.value = true
      }, 1000)
    }

    const logout = () => {
      isAuthenticated.value = false
      showUserMenu.value = false
    }

    const toggleTheme = () => {
      isDark.value = !isDark.value
      document.documentElement.classList.toggle('dark', isDark.value)
    }

    const getCurrentViewTitle = () => {
      const view = menuItems.value.find(item => item.id === currentView.value)
      return view ? view.name : 'Dashboard'
    }

    const editCompany = (company) => {
      editingCompany.value = company
      companyForm.value = { ...company }
      showCompanyModal.value = true
    }

    const saveCompany = () => {
      if (editingCompany.value) {
        // Update existing company
        const index = companies.value.findIndex(c => c.id === editingCompany.value.id)
        if (index !== -1) {
          companies.value[index] = { ...companyForm.value, id: editingCompany.value.id }
        }
      } else {
        // Add new company
        const newCompany = {
          ...companyForm.value,
          id: Date.now(),
          employeeCount: 0,
          departments: 0
        }
        companies.value.push(newCompany)
      }

      // Reset form and close modal
      companyForm.value = { name: '', code: '', address: '', status: 'active' }
      editingCompany.value = null
      showCompanyModal.value = false
    }

    const deleteCompany = (companyId) => {
      if (confirm('Are you sure you want to delete this company?')) {
        companies.value = companies.value.filter(c => c.id !== companyId)
      }
    }

    const nextWizardStep = () => {
      if (wizardStep.value < 3) {
        wizardStep.value++
      } else {
        // Create employee
        const newEmployee = {
          id: Date.now(),
          name: `${employeeForm.value.firstName} ${employeeForm.value.lastName}`,
          email: employeeForm.value.email,
          department: employeeForm.value.department,
          role: employeeForm.value.role,
          status: 'active',
          hireDate: employeeForm.value.hireDate
        }
        employees.value.push(newEmployee)

        // Reset form and close wizard
        employeeForm.value = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          department: '',
          role: '',
          hireDate: '',
          permissions: []
        }
        wizardStep.value = 1
        showEmployeeWizard.value = false
      }
    }

    // Icon components (simplified as functions returning SVG elements)
    const DashboardIcon = () => 'svg'
    const CompanyIcon = () => 'svg'
    const EmployeeIcon = () => 'svg'
    const DepartmentIcon = () => 'svg'
    const ReportIcon = () => 'svg'
    const SettingsIcon = () => 'svg'
    const ProjectIcon = () => 'svg'
    const ImportIcon = () => 'svg'

    // Lifecycle
    onMounted(() => {
      // Simulate initial loading
      setTimeout(() => {
        isLoading.value = false
      }, 2000)

      // Check for saved theme preference
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
        isDark.value = true
        document.documentElement.classList.add('dark')
      }

      // Close dropdowns when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
          showNotifications.value = false
          showUserMenu.value = false
        }
      })
    })

    return {
      // State
      isLoading,
      isAuthenticated,
      isDark,
      sidebarOpen,
      currentView,
      showNotifications,
      showUserMenu,
      showCompanyModal,
      showEmployeeWizard,
      wizardStep,
      editingCompany,
      companySearch,
      companyFilter,
      employeeSearch,
      employeeFilter,
      loginForm,
      companyForm,
      employeeForm,
      currentUser,
      menuItems,
      dashboardStats,
      recentActivity,
      notifications,
      companies,
      employees,
      availablePermissions,

      // Computed
      filteredCompanies,
      filteredEmployees,

      // Methods
      login,
      logout,
      toggleTheme,
      getCurrentViewTitle,
      editCompany,
      saveCompany,
      deleteCompany,
      nextWizardStep,

      // Icons
      DashboardIcon,
      CompanyIcon,
      EmployeeIcon,
      DepartmentIcon,
      ReportIcon,
      SettingsIcon,
      ProjectIcon,
      ImportIcon
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