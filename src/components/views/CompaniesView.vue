<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
    >
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="companySearch"
            type="text"
            placeholder="Search companies..."
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
          v-model="companyFilter"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Companies</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <!-- View Toggle -->
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200',
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
            ]"
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
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              ></path>
            </svg>
          </button>
          <button
            @click="viewMode = 'tree'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200',
              viewMode === 'tree'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
            ]"
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
          </button>
        </div>
        <!-- Dev Reset Button (remove in production) -->
        <button
          @click="resetData"
          class="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          title="Reset data to see hierarchy (dev only)"
        >
          Reset Data
        </button>
      </div>
      <div class="flex items-center space-x-3">
        <button
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
          <span>Add Company</span>
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

    <!-- Companies Grid -->
    <div
      v-if="viewMode === 'grid'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="company in filteredCompanies"
        :key="company.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              >
                <span class="text-white font-bold text-lg">{{
                  company.name.charAt(0)
                }}</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ company.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ company.code }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="openEditModal(company)"
                class="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </button>
              <button
                @click="handleDelete(company.id)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <div
              class="flex items-center text-sm text-gray-600 dark:text-gray-400"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              {{ company.address }}
            </div>
            <div
              class="flex items-center text-sm text-gray-600 dark:text-gray-400"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              {{ company.employeeCount }} employees
            </div>
            <div class="flex items-center justify-between mt-4">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  company.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                ]"
              >
                {{ company.status }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400"
                >{{ company.departments }} departments</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Company Hierarchy Tree -->
    <CompanyTreeView
      v-else-if="viewMode === 'tree'"
      :search="companySearch"
      :filter="companyFilter"
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <!-- Company Modal -->
    <CompanyModal
      :show="showModal"
      :company="editingCompany"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useCompanyStore } from '@/stores/companyStore';
import CompanyModal from '@/components/modals/CompanyModal.vue';
import CompanyTreeView from '@/components/CompanyTreeView.vue';

export default {
  name: 'CompaniesView',
  components: {
    CompanyModal,
    CompanyTreeView,
  },
  setup() {
    const {
      companySearch,
      companyFilter,
      filteredCompanies,
      addCompany,
      updateCompany,
      deleteCompany,
    } = useCompanyStore();

    const showModal = ref(false);
    const editingCompany = ref(null);
    const viewMode = ref('grid');

    const openAddModal = () => {
      editingCompany.value = null;
      showModal.value = true;
    };

    const openEditModal = company => {
      editingCompany.value = company;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      editingCompany.value = null;
    };

    const handleSave = companyData => {
      if (editingCompany.value) {
        updateCompany(editingCompany.value.id, companyData);
      } else {
        addCompany(companyData);
      }
      closeModal();
    };

    const handleDelete = id => {
      if (confirm('Are you sure you want to delete this company?')) {
        deleteCompany(id);
      }
    };

    // Dev helper - remove in production
    const resetData = () => {
      if (confirm('This will reset all data. Continue?')) {
        localStorage.clear();
        window.location.reload();
      }
    };

    return {
      companySearch,
      companyFilter,
      filteredCompanies,
      showModal,
      editingCompany,
      viewMode,
      openAddModal,
      openEditModal,
      closeModal,
      handleSave,
      handleDelete,
      resetData,
    };
  },
};
</script>
