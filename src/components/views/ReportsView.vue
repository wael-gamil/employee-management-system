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

    <!-- Report Types Grid -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Report Types
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Choose a report type to generate insights
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search report types..."
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
            v-model="categoryFilter"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="HR">HR</option>
            <option value="Management">Management</option>
            <option value="Executive">Executive</option>
            <option value="Analytics">Analytics</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="reportType in filteredReportTypes"
          :key="reportType.id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600"
          :class="{
            'border-blue-500 bg-blue-50 dark:bg-blue-900/20':
              selectedType === reportType.id,
          }"
          @click="selectReportType(reportType.id)"
        >
          <div class="flex items-start space-x-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <component :is="reportType.icon" class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ reportType.name }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ reportType.description }}
              </p>
              <div class="flex items-center justify-between mt-3">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getCategoryColor(reportType.category)"
                >
                  {{ reportType.category }}
                </span>
                <span class="text-xs text-gray-400"
                  >{{ reportType.fields.length }} fields</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Filters & Actions -->
    <div
      v-if="selectedType"
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Configure Report
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Set filters for {{ getSelectedReportType()?.name }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Company</label
          >
          <select
            v-model="filters.companyId"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Department</label
          >
          <select
            v-model="filters.departmentId"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Departments</option>
            <option
              v-for="dept in filteredDepartments"
              :key="dept.id"
              :value="dept.id"
            >
              {{ dept.name }}
            </option>
          </select>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Start Date</label
          >
          <input
            v-model="filters.startDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >End Date</label
          >
          <input
            v-model="filters.endDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="clearFilters"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Clear Filters
        </button>
        <button
          @click="runReport"
          :disabled="isGenerating"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50"
        >
          <svg
            v-if="isGenerating"
            class="animate-spin w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          <svg
            v-else
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          <span>{{ isGenerating ? 'Generating...' : 'Generate Report' }}</span>
        </button>
      </div>
    </div>

    <!-- Reports History -->
    <div
      v-if="reports.length > 0"
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Generated Reports
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ reports.length }} reports available
          </p>
        </div>
        <button
          @click="clearAllReports"
          class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="report in reports"
          :key="report.id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-600"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ report.name }}
                </h4>
                <div
                  class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1"
                >
                  <span>{{ formatDate(report.generatedAt) }}</span>
                  <span>{{ report.rowCount }} rows</span>
                  <span>{{ report.generatedBy }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="viewReport(report)"
                class="px-3 py-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                View
              </button>
              <button
                @click="exportReport(report, 'csv')"
                class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors duration-200"
              >
                CSV
              </button>
              <button
                @click="exportReport(report, 'json')"
                class="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors duration-200"
              >
                JSON
              </button>
              <button
                @click="deleteReport(report.id)"
                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>

          <div
            v-if="viewingReport === report.id"
            class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            <div class="overflow-x-auto">
              <table v-if="report.data.length" class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      v-for="col in Object.keys(report.data[0])"
                      :key="col"
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {{ formatColumnName(col) }}
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                >
                  <tr
                    v-for="(row, index) in report.data.slice(0, 10)"
                    :key="index"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td
                      v-for="col in Object.keys(report.data[0])"
                      :key="col"
                      class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                    >
                      {{ formatCellValue(row[col]) }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                v-if="report.data.length > 10"
                class="text-center py-3 text-sm text-gray-500 dark:text-gray-400"
              >
                Showing first 10 of {{ report.data.length }} rows. Export for
                full data.
              </div>
              <div
                v-else-if="!report.data.length"
                class="text-center py-8 text-gray-400 italic"
              >
                No data available for this report.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedType" class="text-center py-12">
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        ></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        Select a Report Type
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Choose a report type above to start generating insights from your data.
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useReportsStore } from '@/stores/reportsStore';
import { useAuthStore } from '@/stores/authStore';
import IconComponents from '@/utils/iconComponents';

export default {
  name: 'ReportsView',
  components: {
    ...IconComponents,
  },
  setup() {
    const {
      reports,
      reportTypes,
      companies,
      departments,
      quickStats,
      isGenerating,
      generateReport,
      exportReport,
      deleteReport,
      clearAllReports,
    } = useReportsStore();

    const { hasPermission } = useAuthStore();

    // Local state
    const selectedType = ref('');
    const searchQuery = ref('');
    const categoryFilter = ref('');
    const viewingReport = ref(null);
    const filters = ref({
      companyId: '',
      departmentId: '',
      startDate: '',
      endDate: '',
    });

    // Computed
    const statsCards = computed(() => {
      const stats = quickStats.value;
      return [
        {
          label: 'Total Employees',
          value: stats.totalEmployees,
          icon: 'UsersIcon',
          bgColor: 'bg-blue-500',
        },
        {
          label: 'Total Companies',
          value: stats.totalCompanies,
          icon: 'CompanyIcon',
          bgColor: 'bg-green-500',
        },
        {
          label: 'Total Departments',
          value: stats.totalDepartments,
          icon: 'DepartmentIcon',
          bgColor: 'bg-purple-500',
        },
        {
          label: 'Recent Hires',
          value: stats.recentHires,
          icon: 'TrendingUpIcon',
          bgColor: 'bg-orange-500',
        },
      ];
    });

    const filteredReportTypes = computed(() => {
      let filtered = reportTypes.value;

      if (searchQuery.value) {
        filtered = filtered.filter(
          type =>
            type.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            type.description
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase())
        );
      }

      if (categoryFilter.value) {
        filtered = filtered.filter(
          type => type.category === categoryFilter.value
        );
      }

      return filtered;
    });

    const filteredDepartments = computed(() => {
      if (!filters.value.companyId) return departments.value;
      return departments.value.filter(
        dept => dept.companyId == filters.value.companyId
      );
    });

    // Methods
    const selectReportType = typeId => {
      selectedType.value = selectedType.value === typeId ? '' : typeId;
    };

    const getSelectedReportType = () => {
      return reportTypes.value.find(r => r.id === selectedType.value);
    };

    const getCategoryColor = category => {
      const colors = {
        HR: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        Management:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Executive:
          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        Analytics:
          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      };
      return (
        colors[category] ||
        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      );
    };

    const clearFilters = () => {
      filters.value = {
        companyId: '',
        departmentId: '',
        startDate: '',
        endDate: '',
      };
    };

    const runReport = async () => {
      if (!selectedType.value) return;

      await generateReport(selectedType.value, filters.value);
    };

    const viewReport = report => {
      viewingReport.value =
        viewingReport.value === report.id ? null : report.id;
    };

    const formatDate = dateString => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const formatColumnName = columnName => {
      return columnName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    };

    const formatCellValue = value => {
      if (value === null || value === undefined) return 'N/A';
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (typeof value === 'number') return value.toLocaleString();
      return String(value);
    };

    return {
      // State
      selectedType,
      searchQuery,
      categoryFilter,
      viewingReport,
      filters,

      // Store data
      reports,
      reportTypes,
      companies,
      departments,
      isGenerating,

      // Computed
      statsCards,
      filteredReportTypes,
      filteredDepartments,

      // Methods
      selectReportType,
      getSelectedReportType,
      getCategoryColor,
      clearFilters,
      runReport,
      viewReport,
      formatDate,
      formatColumnName,
      formatCellValue,
      exportReport,
      deleteReport,
      clearAllReports,
      hasPermission,
    };
  },
};
</script>
