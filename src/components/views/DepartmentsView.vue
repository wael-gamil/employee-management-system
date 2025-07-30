<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div
        v-for="(stat, index) in statsCards"
        :key="index"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ stat.label }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stat.value }}
            </p>
          </div>
          <div
            :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center',
              stat.bgColor,
            ]"
          >
            <component :is="stat.icon" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Header Actions -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
    >
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="departmentSearch"
            type="text"
            placeholder="Search departments..."
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
          v-model="departmentCompanyFilter"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Companies</option>
          <option
            v-for="company in companies"
            :key="company.id"
            :value="company.id"
          >
            {{ company.name }}
          </option>
        </select>
      </div>
      <div class="flex items-center space-x-3">
        <button
          v-if="selectedDepartments.length > 0"
          @click="showBulkModal = true"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
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
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            ></path>
          </svg>
          <span>Bulk Assign ({{ selectedDepartments.length }})</span>
        </button>
        <button
          v-if="hasPermission('create_department')"
          @click="openAddModal"
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
          <span>Add Department</span>
        </button>
      </div>
    </div>

    <!-- Departments Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="
                    selectedDepartments.length === filteredDepartments.length &&
                    filteredDepartments.length > 0
                  "
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Company
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Head
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Employees
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Order
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
              v-for="department in filteredDepartments"
              :key="department.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              :class="{
                'bg-blue-50 dark:bg-blue-900/20': selectedDepartments.includes(
                  department.id
                ),
              }"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :checked="selectedDepartments.includes(department.id)"
                  @change="toggleDepartmentSelection(department.id)"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ department.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ department.description }}
                  </div>
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
              >
                {{ getCompanyName(department.companyId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  v-if="getDepartmentHead(department.headId)"
                  class="flex items-center"
                >
                  <div
                    class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3"
                  >
                    <span class="text-white text-xs font-bold">{{
                      getDepartmentHead(department.headId).name.charAt(0)
                    }}</span>
                  </div>
                  <div>
                    <div
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ getDepartmentHead(department.headId).name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ getDepartmentHead(department.headId).role }}
                    </div>
                  </div>
                </div>
                <span
                  v-else
                  class="text-sm text-gray-500 dark:text-gray-400 italic"
                  >No head assigned</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {{ department.employeeCount }} employees
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
              >
                <div class="flex items-center space-x-2">
                  <button
                    @click="moveUp(department)"
                    :disabled="isFirstInCompany(department)"
                    class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        d="M5 15l7-7 7 7"
                      ></path>
                    </svg>
                  </button>
                  <span class="text-sm">{{ department.order }}</span>
                  <button
                    @click="moveDown(department)"
                    :disabled="isLastInCompany(department)"
                    class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end space-x-2">
                  <button
                    v-if="hasPermission('edit_department')"
                    @click="openEditModal(department)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    v-if="hasPermission('delete_department')"
                    @click="handleDelete(department.id)"
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

    <!-- Department Modal -->
    <DepartmentModal
      :show="showModal"
      :department="editingDepartment"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Bulk Assign Modal -->
    <div
      v-if="showBulkModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
      >
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bulk Assign Company
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Assign {{ selectedDepartments.length }} selected departments to a
            new company:
          </p>
          <select
            v-model="bulkCompanyId"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4"
          >
            <option value="">Select Company</option>
            <option
              v-for="company in companies"
              :key="company.id"
              :value="company.id"
            >
              {{ company.name }}
            </option>
          </select>
          <div class="flex justify-end space-x-3">
            <button
              @click="showBulkModal = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              @click="handleBulkAssign"
              :disabled="!bulkCompanyId"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useDepartmentStore } from '@/stores/departmentStore';
import { useCompanyStore } from '@/stores/companyStore';
import { useAuthStore } from '@/stores/authStore';
import DepartmentModal from '@/components/modals/DepartmentModal.vue';
import IconComponents from '@/utils/iconComponents';

export default {
  name: 'DepartmentsView',
  components: {
    DepartmentModal,
    ...IconComponents,
  },
  setup() {
    const {
      departmentSearch,
      departmentCompanyFilter,
      filteredDepartments,
      getDepartmentsByCompany,
      getCompanyName,
      getDepartmentHead,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      reorderDepartments,
      bulkAssignCompany,
      getDepartmentStats,
    } = useDepartmentStore();

    const { companies } = useCompanyStore();
    const { hasPermission } = useAuthStore();

    const showModal = ref(false);
    const showBulkModal = ref(false);
    const editingDepartment = ref(null);
    const selectedDepartments = ref([]);
    const bulkCompanyId = ref('');

    const stats = computed(() => getDepartmentStats());
    const statsCards = computed(() => [
      {
        label: 'Total Departments',
        value: stats.value.total,
        icon: 'DepartmentIcon',
        bgColor: 'bg-blue-500',
      },
      {
        label: 'Companies',
        value: stats.value.companiesWithDepartments,
        icon: 'CompanyIcon',
        bgColor: 'bg-green-500',
      },
      {
        label: 'With Heads',
        value: stats.value.withHeads,
        icon: 'EmployeeIcon',
        bgColor: 'bg-purple-500',
      },
      {
        label: 'Avg Employees',
        value: stats.value.avgEmployees,
        icon: 'ProjectIcon',
        bgColor: 'bg-orange-500',
      },
    ]);

    const openAddModal = () => {
      editingDepartment.value = null;
      showModal.value = true;
    };

    const openEditModal = department => {
      editingDepartment.value = department;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      editingDepartment.value = null;
    };

    const handleSave = departmentData => {
      if (editingDepartment.value) {
        updateDepartment(editingDepartment.value.id, departmentData);
      } else {
        addDepartment(departmentData);
      }
      closeModal();
    };

    const handleDelete = id => {
      if (confirm('Are you sure you want to delete this department?')) {
        deleteDepartment(id);
        selectedDepartments.value = selectedDepartments.value.filter(
          deptId => deptId !== id
        );
      }
    };

    const toggleDepartmentSelection = id => {
      const index = selectedDepartments.value.indexOf(id);
      if (index > -1) {
        selectedDepartments.value.splice(index, 1);
      } else {
        selectedDepartments.value.push(id);
      }
    };

    const toggleSelectAll = () => {
      if (
        selectedDepartments.value.length === filteredDepartments.value.length
      ) {
        selectedDepartments.value = [];
      } else {
        selectedDepartments.value = filteredDepartments.value.map(d => d.id);
      }
    };

    const handleBulkAssign = () => {
      bulkAssignCompany(
        selectedDepartments.value,
        parseInt(bulkCompanyId.value)
      );
      selectedDepartments.value = [];
      bulkCompanyId.value = '';
      showBulkModal.value = false;
    };

    const isFirstInCompany = department => {
      const companyDepts = getDepartmentsByCompany(department.companyId);
      return companyDepts[0]?.id === department.id;
    };

    const isLastInCompany = department => {
      const companyDepts = getDepartmentsByCompany(department.companyId);
      return companyDepts[companyDepts.length - 1]?.id === department.id;
    };

    const moveUp = department => {
      const companyDepts = getDepartmentsByCompany(department.companyId);
      const currentIndex = companyDepts.findIndex(d => d.id === department.id);
      if (currentIndex > 0) {
        const newOrder = companyDepts.map(d => d.id);
        [newOrder[currentIndex], newOrder[currentIndex - 1]] = [
          newOrder[currentIndex - 1],
          newOrder[currentIndex],
        ];
        reorderDepartments(department.companyId, newOrder);
      }
    };

    const moveDown = department => {
      const companyDepts = getDepartmentsByCompany(department.companyId);
      const currentIndex = companyDepts.findIndex(d => d.id === department.id);
      if (currentIndex < companyDepts.length - 1) {
        const newOrder = companyDepts.map(d => d.id);
        [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
          newOrder[currentIndex + 1],
          newOrder[currentIndex],
        ];
        reorderDepartments(department.companyId, newOrder);
      }
    };

    return {
      departmentSearch,
      departmentCompanyFilter,
      filteredDepartments,
      companies,
      statsCards,
      showModal,
      showBulkModal,
      editingDepartment,
      selectedDepartments,
      bulkCompanyId,
      getCompanyName,
      getDepartmentHead,
      openAddModal,
      openEditModal,
      closeModal,
      handleSave,
      handleDelete,
      toggleDepartmentSelection,
      toggleSelectAll,
      handleBulkAssign,
      isFirstInCompany,
      isLastInCompany,
      moveUp,
      moveDown,
      hasPermission,
    };
  },
};
</script>
