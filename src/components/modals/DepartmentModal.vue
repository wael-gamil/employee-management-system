<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ department ? 'Edit Department' : 'Add New Department' }}
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter department name"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
            <select 
              v-model="form.companyId"
              required
              @change="onCompanyChange"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Company</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department Head</label>
            <select 
              v-model="form.headId"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">No Head Assigned</option>
              <option v-for="employee in availableHeads" :key="employee.id" :value="employee.id">
                {{ employee.name }} - {{ employee.role }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea 
              v-model="form.description" 
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter department description"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="$emit('close')"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              {{ department ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useCompanyStore } from '@/stores/companyStore'
import { useDepartmentStore } from '@/stores/departmentStore'

export default {
  name: 'DepartmentModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    department: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const { companies } = useCompanyStore()
    const { getAvailableHeads } = useDepartmentStore()
    
    const form = ref({
      name: '',
      companyId: '',
      headId: '',
      description: ''
    })

    const availableHeads = computed(() => {
      if (!form.value.companyId) return []
      return getAvailableHeads(parseInt(form.value.companyId), props.department?.id)
    })

    // Watch for changes in the department prop to populate form
    watch(() => props.department, (newDepartment) => {
      if (newDepartment) {
        form.value = {
          name: newDepartment.name,
          companyId: newDepartment.companyId,
          headId: newDepartment.headId || '',
          description: newDepartment.description || ''
        }
      } else {
        form.value = {
          name: '',
          companyId: '',
          headId: '',
          description: ''
        }
      }
    }, { immediate: true })

    const onCompanyChange = () => {
      // Reset head selection when company changes
      form.value.headId = ''
    }

    const handleSubmit = () => {
      const formData = {
        ...form.value,
        companyId: parseInt(form.value.companyId),
        headId: form.value.headId ? parseInt(form.value.headId) : null
      }
      emit('save', formData)
    }

    return {
      form,
      companies,
      availableHeads,
      onCompanyChange,
      handleSubmit
    }
  }
}
</script>
