<template>
  <div class="space-y-6">
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
</template>

<script>
import { ref } from 'vue'
import IconComponents from '@/utils/iconComponents'

export default {
  name: 'DashboardView',
  components: {
    ...IconComponents
  },
  setup() {
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

    return {
      dashboardStats,
      recentActivity
    }
  }
}
</script>
