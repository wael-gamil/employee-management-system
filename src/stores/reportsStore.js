import { ref, computed } from 'vue'
import { dataService } from '@/services/dataService'
import { useNotificationStore } from '@/stores/notificationStore'
import { useToastStore } from '@/stores/toastStore'

export function useReportsStore() {
  // Get store instances
  const notificationStore = useNotificationStore()
  const toastStore = useToastStore()

  // Reactive state
  const reports = ref([])
  const reportFilters = ref({
    dateRange: 'last30days',
    startDate: '',
    endDate: '',
    companyId: '',
    departmentId: '',
    reportType: ''
  })
  const isGenerating = ref(false)
  const selectedReport = ref(null)

  // Get related data
  const companies = computed(() => dataService.getAll('companies'))
  const departments = computed(() => dataService.getAll('departments'))
  const employees = computed(() => dataService.getAll('employees'))

  // Report types configuration
  const reportTypes = ref([
    {
      id: 'employee_summary',
      name: 'Employee Summary',
      description: 'Overview of all employees with department and status breakdown',
      icon: 'UsersIcon',
      category: 'HR',
      fields: ['name', 'email', 'department', 'role', 'status', 'hireDate', 'companyName']
    },
    {
      id: 'department_analysis',
      name: 'Department Analysis',
      description: 'Department-wise employee distribution and performance metrics',
      icon: 'DepartmentIcon',
      category: 'Management',
      fields: ['name', 'companyName', 'employeeCount', 'headName', 'createdAt']
    },
    {
      id: 'company_overview',
      name: 'Company Overview',
      description: 'Company statistics with employee and department counts',
      icon: 'CompanyIcon',
      category: 'Executive',
      fields: ['name', 'code', 'address', 'status', 'employeeCount', 'departments']
    },
    {
      id: 'hiring_trends',
      name: 'Hiring Trends',
      description: 'Employee hiring patterns over time',
      icon: 'TrendingUpIcon',
      category: 'Analytics',
      fields: ['month', 'newHires', 'terminations', 'netChange', 'totalEmployees']
    },
    {
      id: 'role_distribution',
      name: 'Role Distribution',
      description: 'Employee roles across departments and companies',
      icon: 'PieChartIcon',
      category: 'Analytics',
      fields: ['role', 'count', 'percentage', 'departments', 'avgExperience']
    },
    {
      id: 'inactive_employees',
      name: 'Inactive Employees',
      description: 'List of inactive employees with termination details',
      icon: 'ExclamationTriangleIcon',
      category: 'HR',
      fields: ['name', 'email', 'department', 'role', 'lastActiveDate', 'reason']
    }
  ])

  // Quick stats for dashboard cards
  const quickStats = computed(() => {
    const allEmployees = employees.value
    const allCompanies = companies.value
    const allDepartments = departments.value

    const activeEmployees = allEmployees.filter(e => e.status === 'active')
    const inactiveEmployees = allEmployees.filter(e => e.status === 'inactive')
    
    // Calculate hiring trend (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentHires = allEmployees.filter(e => 
      new Date(e.createdAt) > thirtyDaysAgo && e.status === 'active'
    )

    return {
      totalEmployees: allEmployees.length,
      activeEmployees: activeEmployees.length,
      inactiveEmployees: inactiveEmployees.length,
      totalCompanies: allCompanies.length,
      totalDepartments: allDepartments.length,
      recentHires: recentHires.length,
      employeeGrowthRate: allEmployees.length > 0 ? 
        ((recentHires.length / allEmployees.length) * 100).toFixed(1) : 0,
      avgEmployeesPerCompany: allCompanies.length > 0 ? 
        Math.round(allEmployees.length / allCompanies.length) : 0
    }
  })

  // Generate report data based on type
  const generateReportData = (reportType, filters = {}) => {
    let data = []
    
    switch (reportType) {
      case 'employee_summary':
        data = generateEmployeeSummary(filters)
        break
      case 'department_analysis':
        data = generateDepartmentAnalysis(filters)
        break
      case 'company_overview':
        data = generateCompanyOverview(filters)
        break
      case 'hiring_trends':
        data = generateHiringTrends(filters)
        break
      case 'role_distribution':
        data = generateRoleDistribution(filters)
        break
      case 'inactive_employees':
        data = generateInactiveEmployees(filters)
        break
      default:
        data = []
    }

    return data
  }

  const generateEmployeeSummary = (filters) => {
    let employeeData = [...employees.value]

    // Apply filters
    if (filters.companyId) {
      employeeData = employeeData.filter(e => e.companyId == filters.companyId)
    }
    if (filters.departmentId) {
      employeeData = employeeData.filter(e => e.departmentId == filters.departmentId)
    }
    if (filters.startDate && filters.endDate) {
      employeeData = employeeData.filter(e => {
        const hireDate = new Date(e.createdAt)
        return hireDate >= new Date(filters.startDate) && hireDate <= new Date(filters.endDate)
      })
    }

    return employeeData.map(employee => ({
      name: employee.name || 'N/A',
      email: employee.email || 'N/A',
      department: employee.department || 'Unassigned',
      role: employee.role || 'N/A',
      status: employee.status || 'active',
      hireDate: employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A',
      companyName: employee.companyName || 'N/A'
    }))
  }

  const generateDepartmentAnalysis = (filters) => {
    let departmentData = [...departments.value]

    if (filters.companyId) {
      departmentData = departmentData.filter(d => d.companyId == filters.companyId)
    }

    return departmentData.map(dept => {
      const headEmployee = employees.value.find(e => e.id === dept.headId)
      return {
        name: dept.name || 'N/A',
        companyName: dept.companyName || 'N/A',
        employeeCount: dept.employeeCount || 0,
        headName: headEmployee ? headEmployee.name : 'No Head Assigned',
        createdAt: dept.createdAt ? new Date(dept.createdAt).toLocaleDateString() : 'N/A',
        description: dept.description || 'No description'
      }
    })
  }

  const generateCompanyOverview = (filters) => {
    let companyData = [...companies.value]

    return companyData.map(company => ({
      name: company.name || 'N/A',
      code: company.code || 'N/A',
      address: company.address || 'N/A',
      status: company.status || 'active',
      employeeCount: company.employeeCount || 0,
      departments: company.departments || 0,
      createdAt: company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'
    }))
  }

  const generateHiringTrends = (filters) => {
    const employeeData = [...employees.value]
    const monthlyData = {}

    // Group employees by month
    employeeData.forEach(employee => {
      if (employee.createdAt) {
        const date = new Date(employee.createdAt)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
            newHires: 0,
            terminations: 0,
            netChange: 0,
            totalEmployees: 0
          }
        }
        
        if (employee.status === 'active') {
          monthlyData[monthKey].newHires++
        } else {
          monthlyData[monthKey].terminations++
        }
        monthlyData[monthKey].netChange = monthlyData[monthKey].newHires - monthlyData[monthKey].terminations
      }
    })

    // Convert to array and sort by date
    return Object.values(monthlyData)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .map((item, index, array) => ({
        ...item,
        totalEmployees: array.slice(0, index + 1).reduce((sum, month) => sum + month.netChange, 0)
      }))
  }

  const generateRoleDistribution = (filters) => {
    let employeeData = [...employees.value]

    if (filters.companyId) {
      employeeData = employeeData.filter(e => e.companyId == filters.companyId)
    }

    const roleStats = {}
    const totalEmployees = employeeData.length

    employeeData.forEach(employee => {
      const role = employee.role || 'Unknown'
      if (!roleStats[role]) {
        roleStats[role] = {
          role,
          count: 0,
          departments: new Set(),
          employees: []
        }
      }
      roleStats[role].count++
      roleStats[role].departments.add(employee.department || 'Unassigned')
      roleStats[role].employees.push(employee)
    })

    return Object.values(roleStats).map(stat => ({
      role: stat.role,
      count: stat.count,
      percentage: totalEmployees > 0 ? ((stat.count / totalEmployees) * 100).toFixed(1) : 0,
      departments: stat.departments.size,
      avgExperience: 'N/A' // Would need experience data
    })).sort((a, b) => b.count - a.count)
  }

  const generateInactiveEmployees = (filters) => {
    let inactiveEmployees = employees.value.filter(e => e.status === 'inactive')

    if (filters.companyId) {
      inactiveEmployees = inactiveEmployees.filter(e => e.companyId == filters.companyId)
    }
    if (filters.departmentId) {
      inactiveEmployees = inactiveEmployees.filter(e => e.departmentId == filters.departmentId)
    }

    return inactiveEmployees.map(employee => ({
      name: employee.name || 'N/A',
      email: employee.email || 'N/A',
      department: employee.department || 'Unassigned',
      role: employee.role || 'N/A',
      lastActiveDate: employee.updatedAt ? new Date(employee.updatedAt).toLocaleDateString() : 'N/A',
      reason: employee.inactiveReason || 'Not specified'
    }))  }

  // Actions
  const generateReport = async (reportTypeId, customFilters = {}) => {
    isGenerating.value = true
    
    try {
      const reportConfig = reportTypes.value.find(r => r.id === reportTypeId)
      if (!reportConfig) {
        throw new Error('Invalid report type')
      }

      const filters = { ...reportFilters.value, ...customFilters }
      const data = generateReportData(reportTypeId, filters)

      const report = {
        id: Date.now(),
        type: reportTypeId,
        name: reportConfig.name,
        description: reportConfig.description,
        data,
        filters,
        generatedAt: new Date().toISOString(),
        generatedBy: 'Current User', // Would get from auth store
        rowCount: data.length
      }

      reports.value.unshift(report)
      selectedReport.value = report      // Add notification and toast for report generation
      notificationStore.addNotification(
        'REPORT_GENERATED',
        `Report "${report.name}" has been generated with ${report.rowCount} records`
      );
      
      toastStore.addToast({
        type: 'success',
        title: 'Report Generated',
        message: `"${report.name}" report generated successfully with ${report.rowCount} records`
      });

      return report
    } finally {
      isGenerating.value = false
    }
  }
  const exportReport = async (report, format = 'csv') => {
    if (!report || !report.data) return

    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${report.name.replace(/\s+/g, '_')}_${timestamp}.${format}`

    if (format === 'csv') {
      exportToCSV(report.data, filename)
    } else if (format === 'json') {
      exportToJSON(report, filename)
    }    // Add notification and toast for report export
    notificationStore.addNotification(
      'REPORT_EXPORTED',
      `Report "${report.name}" has been exported as ${format.toUpperCase()}`
    );
    
    toastStore.addToast({
      type: 'success',
      title: 'Report Exported',
      message: `Report "${report.name}" exported successfully as ${filename}`
    });
  }

  const exportToCSV = (data, filename) => {
    if (!data.length) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => `"${String(row[header] || '').replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n')

    downloadFile(csvContent, filename, 'text/csv')
  }

  const exportToJSON = (report, filename) => {
    const exportData = {
      ...report,
      exportedAt: new Date().toISOString()
    }
    const jsonContent = JSON.stringify(exportData, null, 2)
    downloadFile(jsonContent, filename, 'application/json')
  }

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  const deleteReport = async (reportId) => {
    const report = reports.value.find(r => r.id === reportId);
    reports.value = reports.value.filter(r => r.id !== reportId)
    if (selectedReport.value && selectedReport.value.id === reportId) {
      selectedReport.value = null
    }    // Add notification and toast for report deletion
    if (report) {
      notificationStore.addNotification(
        'REPORT_DELETED',
        `Report "${report.name}" has been deleted`
      );
      
      toastStore.addToast({
        type: 'success',
        title: 'Report Deleted',
        message: `Report "${report.name}" was successfully deleted`
      });
    }
  }

  const clearAllReports = async () => {
    const count = reports.value.length;
    reports.value = []
    selectedReport.value = null    // Add notification and toast for clearing all reports
    if (count > 0) {
      notificationStore.addNotification(
        'REPORTS_CLEARED',
        `All ${count} reports have been cleared`
      );
      
      toastStore.addToast({
        type: 'info',
        title: 'Reports Cleared',
        message: `All ${count} reports were successfully cleared`
      });
    }
  }

  return {
    // State
    reports,
    reportFilters,
    isGenerating,
    selectedReport,
    
    // Computed
    quickStats,
    reportTypes,
    companies,
    departments,
    
    // Actions
    generateReport,
    exportReport,
    deleteReport,
    clearAllReports
  }
}
