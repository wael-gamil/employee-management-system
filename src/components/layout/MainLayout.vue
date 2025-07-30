<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <AppHeader />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-auto p-6">
        <component :is="currentViewComponent" />
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useUIStore } from '@/stores/uiStore'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import DashboardView from '@/components/views/DashboardView.vue'
import CompaniesView from '@/components/views/CompaniesView.vue'
import EmployeesView from '@/components/views/EmployeesView.vue'
import DepartmentsView from '@/components/views/DepartmentsView.vue'
import ProjectsView from '@/components/views/ProjectsView.vue'
import ReportsView from '@/components/views/ReportsView.vue'
import SettingsView from '@/components/views/SettingsView.vue'

export default {
  name: 'MainLayout',  components: {
    AppSidebar,    AppHeader,
    DashboardView,
    CompaniesView,
    EmployeesView,
    DepartmentsView,
    ProjectsView,
    ReportsView,
    SettingsView
  },
  setup() {
    const { currentView } = useUIStore()

    const currentViewComponent = computed(() => {
      const viewMap = {
        dashboard: 'DashboardView',
        companies: 'CompaniesView',
        employees: 'EmployeesView',
        departments: 'DepartmentsView',
        projects: 'ProjectsView',
        reports: 'ReportsView',
        settings: 'SettingsView'
      }
      return viewMap[currentView.value] || 'DashboardView'
    })

    return {
      currentViewComponent
    }
  }
}
</script>
