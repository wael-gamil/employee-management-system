<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
    >
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="employeeSearch"
            type="text"
            placeholder="Search employees..."
            class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <svg
            class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <select
          v-model="employeeFilter"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Departments</option>
          <option
            v-for="department in availableDepartments"
            :key="department.id"
            :value="department.name"
          >
            {{ department.name }}
          </option>
        </select>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="openEmployeeWizard"
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
          <span>Add Employee</span>
        </button>
        <button
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
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
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            ></path>
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
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Employee
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Department
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
                Hire Date
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
              v-for="employee in filteredEmployees"
              :key="employee.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                  >
                    <span class="text-white font-medium text-sm">{{
                      employee.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                    }}</span>
                  </div>
                  <div class="ml-4">
                    <div
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ employee.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ employee.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
              >
                {{ employee.department }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
              >
                {{ employee.role }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    employee.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                  ]"
                >
                  {{ employee.status }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
              >
                {{ employee.hireDate }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editEmployee(employee)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleDeleteEmployee(employee.id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Employee Wizard Modal -->
    <EmployeeWizard
      :show="showWizard"
      @close="closeWizard"
      @save="handleSaveEmployee"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useEmployeeStore } from '@/stores/employeeStore';
import { useDepartmentStore } from '@/stores/departmentStore';
import EmployeeWizard from '@/components/modals/EmployeeWizard.vue';

export default {
  name: 'EmployeesView',
  components: {
    EmployeeWizard,
  },
  setup() {
    const {
      employeeSearch,
      employeeFilter,
      filteredEmployees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
    } = useEmployeeStore();

    const { departments } = useDepartmentStore();
    const availableDepartments = computed(() => departments.value);

    const showWizard = ref(false);

    const openEmployeeWizard = () => {
      showWizard.value = true;
    };

    const closeWizard = () => {
      showWizard.value = false;
    };

    const handleSaveEmployee = employeeData => {
      const fullName = `${employeeData.firstName} ${employeeData.lastName}`;

      // Find the department ID based on the selected department name
      const selectedDepartment = departments.value.find(
        dept => dept.name === employeeData.department
      );

      const employee = {
        name: fullName,
        email: employeeData.email,
        department: employeeData.department,
        departmentId: selectedDepartment?.id || null,
        companyId: selectedDepartment?.companyId || null,
        role: employeeData.role,
        hireDate: employeeData.hireDate,
      };
      addEmployee(employee);
      closeWizard();
    };

    const editEmployee = employee => {
      // TODO: Implement edit functionality
      console.log('Edit employee:', employee);
    };

    const handleDeleteEmployee = id => {
      if (confirm('Are you sure you want to delete this employee?')) {
        deleteEmployee(id);
      }
    };

    return {
      employeeSearch,
      employeeFilter,
      filteredEmployees,
      availableDepartments,
      showWizard,
      openEmployeeWizard,
      closeWizard,
      handleSaveEmployee,
      editEmployee,
      handleDeleteEmployee,
    };
  },
};
</script>
