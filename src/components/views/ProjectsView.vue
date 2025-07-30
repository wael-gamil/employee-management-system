<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage and track project progress across your organization
        </p>
      </div>
      <button 
        v-if="hasPermission('create_project')"
        @click="showProjectModal = true"
        class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        New Project
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ projectStats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ projectStats.active }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Progress</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ projectStats.avgProgress }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatBudget(projectStats.totalBudget) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <!-- Bulk Operations Toolbar -->
      <div v-if="selectedProjects.length > 0" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-300">
              {{ selectedProjects.length }} project{{ selectedProjects.length > 1 ? 's' : '' }} selected
            </span>
            <button 
              @click="clearSelection"
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              Clear selection
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              v-if="hasPermission('edit_project')"
              @click="bulkUpdateStatus"
              class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Update Status
            </button>
            <button 
              @click="exportSelected"
              class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Export
            </button>
            <button 
              v-if="hasPermission('delete_project')"
              @click="bulkDelete"
              class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div class="flex items-center space-x-2 mb-4 sm:mb-0">
          <button 
            @click="exportProjects"
            class="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
            Export All
          </button>
          <button 
            v-if="hasPermission('create_project')"
            @click="importProjects"
            class="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Import
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="refreshProjects"
            class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Refresh"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
          <div class="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <span>View:</span>
            <button 
              @click="viewMode = 'table'"
              :class="[viewMode === 'table' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400']"
              class="p-1 rounded"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 6h18m-9 8h9"></path>
              </svg>
            </button>
            <button 
              @click="viewMode = 'grid'"
              :class="[viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400']"
              class="p-1 rounded"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Search -->
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search projects..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select 
            v-model="selectedStatus"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option v-for="status in Object.values(PROJECT_STATUSES)" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
          <select 
            v-model="selectedPriority"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Priorities</option>
            <option v-for="priority in Object.values(PROJECT_PRIORITIES)" :key="priority" :value="priority">{{ priority }}</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex items-end space-x-2">
          <button 
            @click="clearFilters"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Projects Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left">
                <input 
                  type="checkbox" 
                  :checked="selectedProjects.length === projects.length && projects.length > 0"
                  @change="toggleAllSelection"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
              </th>
              <th @click="sortBy = 'name'; sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                Project Name
                <svg v-if="sortBy === 'name'" :class="['inline w-4 h-4 ml-1', sortOrder === 'asc' ? '' : 'transform rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Progress</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timeline</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Budget</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Team</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="project in projects" :key="project.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <input 
                  type="checkbox" 
                  :checked="selectedProjects.includes(project)"
                  @change="toggleProjectSelection(project)"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ project.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ project.description }}</div>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span v-for="tag in project.tags.slice(0, 2)" :key="tag" class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                      {{ tag }}
                    </span>
                    <span v-if="project.tags.length > 2" class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                      +{{ project.tags.length - 2 }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(project.status)]">
                  {{ project.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getPriorityColor(project.priority)]">
                  {{ project.priority }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      :class="['h-2 rounded-full', project.progress === 100 ? 'bg-green-500' : 'bg-blue-500']"
                      :style="{ width: project.progress + '%' }"
                    ></div>
                  </div>
                  <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">{{ project.progress }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div>{{ formatDate(project.startDate) }}</div>
                <div class="text-gray-500 dark:text-gray-400">{{ formatDate(project.endDate) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ formatBudget(project.budget) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex -space-x-1 overflow-hidden">
                  <div v-for="memberId in project.teamMembers.slice(0, 3)" :key="memberId" class="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <span class="text-xs font-medium text-white">{{ getEmployeeInitials(memberId) }}</span>
                  </div>
                  <div v-if="project.teamMembers.length > 3" class="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-500 flex items-center justify-center">
                    <span class="text-xs font-medium text-white">+{{ project.teamMembers.length - 3 }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewProject(project)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View project"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button 
                    v-if="hasPermission('edit_project')"
                    @click="editProject(project)"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    title="Edit project"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    v-if="hasPermission('delete_project')"
                    @click="deleteProjectConfirm(project)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete project"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>    <!-- Empty State -->
    <div v-if="projects.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ searchQuery || selectedStatus || selectedPriority ? 'Try adjusting your filters.' : 'Get started by creating a new project.' }}
      </p>
    </div>

    <!-- Project Modal -->
    <ProjectModal 
      v-if="showProjectModal" 
      :project="selectedProject"
      @close="closeProjectModal"
      @save="handleProjectSave"
    />
  </div>
</template>

<script>
import { useProjectStore } from '@/stores/projectStore'
import { useEmployeeStore } from '@/stores/employeeStore'
import { useAuthStore } from '@/stores/authStore'
import ProjectModal from '@/components/modals/ProjectModal.vue'
import { ref } from 'vue'

export default {
  name: 'ProjectsView',
  components: {
    ProjectModal
  },
  setup() {
    const {
      filteredProjects,
      projectStats,
      searchQuery,
      selectedStatus,
      selectedPriority,
      sortBy,
      sortOrder,
      PROJECT_STATUSES,
      PROJECT_PRIORITIES,
      clearFilters,
      getStatusColor,
      getPriorityColor,
      formatBudget,
      formatDate,
      deleteProject,
      updateProject,
      createProject
    } = useProjectStore()

    const { getEmployeeById } = useEmployeeStore()
    const { hasPermission } = useAuthStore()

    const showProjectModal = ref(false)
    const selectedProject = ref(null)

    const getEmployeeInitials = (employeeId) => {
      const employee = getEmployeeById(employeeId)
      if (!employee || !employee.name) return '??'
      const names = employee.name.split(' ')
      return names.map(name => name.charAt(0)).join('').toUpperCase()
    }

    const editProject = (project) => {
      selectedProject.value = { ...project }
      showProjectModal.value = true
    }

    const closeProjectModal = () => {
      showProjectModal.value = false
      selectedProject.value = null
    }

    const handleProjectSave = (projectData) => {
      if (selectedProject.value) {
        // Update existing project
        updateProject(selectedProject.value.id, projectData)
      } else {
        // Create new project
        createProject(projectData)
      }
      closeProjectModal()
    }

    const viewProject = (project) => {
      // Implement project detail view
      console.log('View project:', project)
    }

    // Enhanced methods for bulk operations and export
    const selectedProjects = ref([])
    const viewMode = ref('table')

    const clearSelection = () => {
      selectedProjects.value = []
    }

    const toggleProjectSelection = (project) => {
      const index = selectedProjects.value.findIndex(p => p.id === project.id)
      if (index === -1) {
        selectedProjects.value.push(project)
      } else {
        selectedProjects.value.splice(index, 1)
      }
    }

    const toggleAllSelection = () => {
      if (selectedProjects.value.length === filteredProjects.value.length) {
        selectedProjects.value = []
      } else {
        selectedProjects.value = [...filteredProjects.value]
      }
    }

    const bulkUpdateStatus = () => {
      // Implement bulk status update
      console.log('Bulk update status for:', selectedProjects.value)
    }

    const bulkDelete = () => {
      if (confirm(`Are you sure you want to delete ${selectedProjects.value.length} projects?`)) {
        selectedProjects.value.forEach(project => {
          deleteProject(project.id)
        })
        clearSelection()
      }
    }

    const exportSelected = () => {
      const projectsToExport = selectedProjects.value
      exportProjectsToCSV(projectsToExport)
    }

    const exportProjects = () => {
      exportProjectsToCSV(filteredProjects.value)
    }

    const exportProjectsToCSV = (projects) => {
      const headers = ['Name', 'Status', 'Priority', 'Start Date', 'End Date', 'Budget', 'Progress']
      const csvContent = [
        headers.join(','),
        ...projects.map(project => [
          `"${project.name}"`,
          project.status,
          project.priority,
          project.startDate,
          project.endDate,
          project.budget,
          project.progress
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `projects_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }

    const importProjects = () => {
      // Implement project import functionality
      console.log('Import projects')
    }

    const refreshProjects = () => {
      // Refresh projects data
      window.location.reload()
    }

    return {      // Store properties
      projects: filteredProjects,
      projectStats,
      searchQuery,
      selectedStatus,
      selectedPriority,
      sortBy,
      sortOrder,
      PROJECT_STATUSES,
      PROJECT_PRIORITIES,
      clearFilters,
      getStatusColor,
      getPriorityColor,
      formatBudget,      formatDate,
      deleteProject,
      
      // Component properties
      showProjectModal,
      selectedProject,
      hasPermission,
      getEmployeeInitials,
      editProject,
      closeProjectModal,      handleProjectSave,
      viewProject,
      
      // New enhanced properties
      selectedProjects,
      viewMode,
      clearSelection,
      toggleProjectSelection,
      toggleAllSelection,
      bulkUpdateStatus,
      bulkDelete,
      exportSelected,
      exportProjects,
      importProjects,
      refreshProjects
    }
  }
}
</script>
