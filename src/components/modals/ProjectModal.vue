<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">
                {{ isEditing ? 'Edit Project' : 'New Project' }}
              </h2>
              <p class="text-blue-100">{{ isEditing ? 'Update project details' : 'Create a new project' }}</p>
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
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.name"
                type="text" 
                required
                :disabled="!canEdit"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter project name"
              >
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea 
                v-model="form.description"
                required
                :disabled="!canEdit"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter project description"
              ></textarea>
            </div>
          </div>

          <!-- Status and Priority -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.status"
                required
                :disabled="!canEdit"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select status</option>
                <option v-for="status in Object.values(PROJECT_STATUSES)" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.priority"
                required
                :disabled="!canEdit"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select priority</option>
                <option v-for="priority in Object.values(PROJECT_PRIORITIES)" :key="priority" :value="priority">
                  {{ priority }}
                </option>
              </select>
            </div>
          </div>

          <!-- Timeline and Budget -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.startDate"
                type="date" 
                required
                :disabled="!canEdit"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.endDate"
                type="date" 
                required
                :disabled="!canEdit"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budget <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                <input 
                  v-model.number="form.budget"
                  type="number" 
                  required
                  min="0"
                  step="1000"
                  :disabled="!canEdit"
                  class="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0"
                >
              </div>
            </div>
          </div>

          <!-- Organization -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.companyId"
                required
                :disabled="!canEdit"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select company</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.departmentId"
                required
                :disabled="!canEdit"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select department</option>
                <option v-for="department in filteredDepartments" :key="department.id" :value="department.id">
                  {{ department.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Project Manager -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Manager <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.managerId"
              required
              :disabled="!canEdit"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select project manager</option>
              <option v-for="employee in filteredEmployees" :key="employee.id" :value="employee.id">
                {{ employee.name }} - {{ employee.position }}
              </option>
            </select>
          </div>

          <!-- Team Members -->
          <div v-if="canEdit && hasPermission('manage_project_team')">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team Members
            </label>
            <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-h-40 overflow-y-auto">
              <div v-for="employee in filteredEmployees" :key="employee.id" class="flex items-center space-x-3 py-2">
                <input 
                  :id="`member-${employee.id}`"
                  v-model="form.teamMembers"
                  :value="employee.id"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
                <label :for="`member-${employee.id}`" class="flex-1 text-sm text-gray-900 dark:text-white cursor-pointer">
                  {{ employee.name }} - {{ employee.position }}
                  <span class="text-gray-500 dark:text-gray-400">({{ employee.department }})</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <input 
              v-model="tagsInput"
              type="text" 
              :disabled="!canEdit"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter tags separated by commas"
            >
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Separate tags with commas (e.g., "Web Development, UI/UX, Frontend")</p>
          </div>

          <!-- Progress (only show for existing projects) -->
          <div v-if="isEditing">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Progress: {{ form.progress }}%
            </label>
            <input 
              v-model.number="form.progress"
              type="range" 
              min="0"
              max="100"
              step="5"
              :disabled="!canEdit"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
            >
            <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <!-- Error Display -->
          <div v-if="error" class="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
            <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
        <button 
          @click="$emit('close')"
          type="button"
          class="px-6 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-200"
        >
          Cancel
        </button>
        <button 
          v-if="canEdit"
          @click="handleSubmit"
          type="button"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useCompanyStore } from '@/stores/companyStore'
import { useDepartmentStore } from '@/stores/departmentStore'
import { useEmployeeStore } from '@/stores/employeeStore'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'ProjectModal',
  props: {
    project: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const { PROJECT_STATUSES, PROJECT_PRIORITIES } = useProjectStore()
    const { companies } = useCompanyStore()
    const { departments } = useDepartmentStore()
    const { employees } = useEmployeeStore()
    const { hasPermission } = useAuthStore()

    const isEditing = computed(() => !!props.project?.id)
    const canEdit = computed(() => {
      if (!isEditing.value) {
        return hasPermission('create_project')
      }
      return hasPermission('edit_project')
    })

    const form = ref({
      name: '',
      description: '',
      status: '',
      priority: '',
      startDate: '',
      endDate: '',
      budget: 0,
      companyId: '',
      departmentId: '',
      managerId: '',
      teamMembers: [],
      progress: 0
    })

    const tagsInput = ref('')
    const isSubmitting = ref(false)
    const error = ref('')

    // Computed properties for filtering
    const filteredDepartments = computed(() => {
      if (!form.value.companyId) return []
      return departments.value.filter(dept => dept.companyId === parseInt(form.value.companyId))
    })

    const filteredEmployees = computed(() => {
      if (!form.value.departmentId) return employees.value
      return employees.value.filter(emp => emp.departmentId === parseInt(form.value.departmentId))
    })

    // Initialize form data
    const initializeForm = () => {
      if (props.project) {
        form.value = {
          name: props.project.name || '',
          description: props.project.description || '',
          status: props.project.status || '',
          priority: props.project.priority || '',
          startDate: props.project.startDate || '',
          endDate: props.project.endDate || '',
          budget: props.project.budget || 0,
          companyId: props.project.companyId || '',
          departmentId: props.project.departmentId || '',
          managerId: props.project.managerId || '',
          teamMembers: [...(props.project.teamMembers || [])],
          progress: props.project.progress || 0
        }
        tagsInput.value = props.project.tags ? props.project.tags.join(', ') : ''
      } else {
        // Set defaults for new project
        const today = new Date().toISOString().split('T')[0]
        const futureDate = new Date()
        futureDate.setMonth(futureDate.getMonth() + 6)
        
        form.value = {
          name: '',
          description: '',
          status: PROJECT_STATUSES.PLANNING,
          priority: PROJECT_PRIORITIES.MEDIUM,
          startDate: today,
          endDate: futureDate.toISOString().split('T')[0],
          budget: 0,
          companyId: '',
          departmentId: '',
          managerId: '',
          teamMembers: [],
          progress: 0
        }
        tagsInput.value = ''
      }
    }

    // Validation
    const validateForm = () => {
      error.value = ''

      if (!form.value.name.trim()) {
        error.value = 'Project name is required'
        return false
      }

      if (!form.value.description.trim()) {
        error.value = 'Project description is required'
        return false
      }

      if (!form.value.status) {
        error.value = 'Project status is required'
        return false
      }

      if (!form.value.priority) {
        error.value = 'Project priority is required'
        return false
      }

      if (!form.value.startDate) {
        error.value = 'Start date is required'
        return false
      }

      if (!form.value.endDate) {
        error.value = 'End date is required'
        return false
      }

      if (new Date(form.value.startDate) >= new Date(form.value.endDate)) {
        error.value = 'End date must be after start date'
        return false
      }

      if (!form.value.budget || form.value.budget <= 0) {
        error.value = 'Budget must be greater than 0'
        return false
      }

      if (!form.value.companyId) {
        error.value = 'Company is required'
        return false
      }

      if (!form.value.departmentId) {
        error.value = 'Department is required'
        return false
      }

      if (!form.value.managerId) {
        error.value = 'Project manager is required'
        return false
      }

      return true
    }

    // Form submission
    const handleSubmit = async () => {
      if (!validateForm()) return

      isSubmitting.value = true
      error.value = ''

      try {
        const projectData = {
          ...form.value,
          companyId: parseInt(form.value.companyId),
          departmentId: parseInt(form.value.departmentId),
          managerId: parseInt(form.value.managerId),
          tags: tagsInput.value ? tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag) : []
        }

        emit('save', projectData)
      } catch (err) {
        error.value = 'Failed to save project. Please try again.'
      } finally {
        isSubmitting.value = false
      }
    }

    // Watch for company changes to reset department
    watch(() => form.value.companyId, (newCompanyId) => {
      if (newCompanyId && form.value.departmentId) {
        const selectedDept = departments.value.find(d => d.id === parseInt(form.value.departmentId))
        if (!selectedDept || selectedDept.companyId !== parseInt(newCompanyId)) {
          form.value.departmentId = ''
          form.value.managerId = ''
          form.value.teamMembers = []
        }
      }
    })

    // Watch for department changes to reset manager and team
    watch(() => form.value.departmentId, (newDeptId) => {
      if (newDeptId) {
        const deptEmployees = employees.value.filter(emp => emp.departmentId === parseInt(newDeptId))
        
        // Reset manager if not in selected department
        if (form.value.managerId) {
          const currentManager = employees.value.find(emp => emp.id === parseInt(form.value.managerId))
          if (!currentManager || currentManager.departmentId !== parseInt(newDeptId)) {
            form.value.managerId = ''
          }
        }

        // Filter team members to only include those in selected department
        form.value.teamMembers = form.value.teamMembers.filter(memberId => 
          deptEmployees.some(emp => emp.id === memberId)
        )
      }
    })

    onMounted(() => {
      initializeForm()
    })

    return {
      // Data
      form,
      tagsInput,
      isSubmitting,
      error,

      // Computed
      isEditing,
      canEdit,
      filteredDepartments,
      filteredEmployees,

      // Store data
      PROJECT_STATUSES,
      PROJECT_PRIORITIES,
      companies,
      departments,
      employees,

      // Auth
      hasPermission,

      // Methods
      handleSubmit,
      validateForm
    }
  }
}
</script>
