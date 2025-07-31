import { ref, computed, watch } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { useToastStore } from '@/stores/toastStore'

// Project statuses
const PROJECT_STATUSES = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
}

const PROJECT_PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
}

// Default project data
const defaultProjects = [
  {
    id: 1,
    name: 'Employee Portal Redesign',
    description: 'Complete redesign of the employee self-service portal with modern UI/UX',
    status: PROJECT_STATUSES.IN_PROGRESS,
    priority: PROJECT_PRIORITIES.HIGH,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    budget: 75000,
    companyId: 1,
    departmentId: 1,
    managerId: 3,
    teamMembers: [1, 2, 4, 5],
    progress: 65,
    tags: ['UI/UX', 'Web Development', 'Portal'],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z'
  },
  {
    id: 2,
    name: 'HR Analytics Dashboard',
    description: 'Development of comprehensive analytics dashboard for HR metrics and insights',
    status: PROJECT_STATUSES.PLANNING,
    priority: PROJECT_PRIORITIES.MEDIUM,
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    budget: 45000,
    companyId: 1,
    departmentId: 2,
    managerId: 2,
    teamMembers: [2, 6, 7],
    progress: 15,
    tags: ['Analytics', 'Dashboard', 'HR'],
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z'
  },
  {
    id: 3,
    name: 'Mobile App Development',
    description: 'Native mobile application for employee check-in and basic HR functions',
    status: PROJECT_STATUSES.IN_PROGRESS,
    priority: PROJECT_PRIORITIES.HIGH,
    startDate: '2023-11-01',
    endDate: '2024-04-30',
    budget: 120000,
    companyId: 1,
    departmentId: 1,
    managerId: 3,
    teamMembers: [1, 4, 8, 9],
    progress: 80,
    tags: ['Mobile', 'React Native', 'HR'],
    createdAt: '2023-10-25T11:00:00Z',
    updatedAt: '2024-01-28T13:20:00Z'
  },
  {
    id: 4,
    name: 'Data Migration Project',
    description: 'Migration of legacy employee data to new system with data cleansing',
    status: PROJECT_STATUSES.COMPLETED,
    priority: PROJECT_PRIORITIES.CRITICAL,
    startDate: '2023-08-01',
    endDate: '2023-12-31',
    budget: 85000,
    companyId: 1,
    departmentId: 1,
    managerId: 1,
    teamMembers: [1, 3, 5],
    progress: 100,
    tags: ['Data Migration', 'Legacy Systems', 'Database'],
    createdAt: '2023-07-15T08:00:00Z',
    updatedAt: '2024-01-02T17:00:00Z'
  },
  {
    id: 5,
    name: 'Security Audit Implementation',
    description: 'Implementation of security recommendations from annual security audit',
    status: PROJECT_STATUSES.ON_HOLD,
    priority: PROJECT_PRIORITIES.HIGH,
    startDate: '2024-01-01',
    endDate: '2024-05-31',
    budget: 35000,
    companyId: 1,
    departmentId: 1,
    managerId: 1,
    teamMembers: [1, 3],
    progress: 25,
    tags: ['Security', 'Compliance', 'Audit'],
    createdAt: '2023-12-20T14:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'  }
]

// Load projects from localStorage or use defaults
const loadProjects = () => {
  try {
    const stored = localStorage.getItem('projects')
    return stored ? JSON.parse(stored) : defaultProjects
  } catch (error) {
    console.error('Failed to load projects from localStorage:', error)
    return defaultProjects
  }
}

// Initialize projects with persistence
const projects = ref(loadProjects())

// Watch for changes and save to localStorage
watch(projects, (newProjects) => {
  try {
    localStorage.setItem('projects', JSON.stringify(newProjects))
  } catch (error) {
    console.error('Failed to save projects to localStorage:', error)
  }
}, { deep: true })

// UI state
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')
const selectedDepartment = ref('')
const selectedManager = ref('')
const sortBy = ref('name')
const sortOrder = ref('asc')

export function useProjectStore() {
  // Get store instances
  const notificationStore = useNotificationStore();
  const toastStore = useToastStore();

  // Computed properties for filtering and sorting
  const filteredProjects = computed(() => {
    let filtered = projects.value

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Status filter
    if (selectedStatus.value) {
      filtered = filtered.filter(project => project.status === selectedStatus.value)
    }

    // Priority filter
    if (selectedPriority.value) {
      filtered = filtered.filter(project => project.priority === selectedPriority.value)
    }

    // Department filter
    if (selectedDepartment.value) {
      filtered = filtered.filter(project => project.departmentId === parseInt(selectedDepartment.value))
    }

    // Manager filter
    if (selectedManager.value) {
      filtered = filtered.filter(project => project.managerId === parseInt(selectedManager.value))
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy.value]
      let bValue = b[sortBy.value]

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder.value === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  })

  // Statistics
  const projectStats = computed(() => {
    const total = projects.value.length
    const active = projects.value.filter(p => 
      p.status === PROJECT_STATUSES.IN_PROGRESS || p.status === PROJECT_STATUSES.PLANNING
    ).length
    const completed = projects.value.filter(p => p.status === PROJECT_STATUSES.COMPLETED).length
    const onHold = projects.value.filter(p => p.status === PROJECT_STATUSES.ON_HOLD).length
    const totalBudget = projects.value.reduce((sum, p) => sum + p.budget, 0)
    const avgProgress = Math.round(
      projects.value.reduce((sum, p) => sum + p.progress, 0) / total
    )

    return {
      total,
      active,
      completed,
      onHold,
      totalBudget,
      avgProgress
    }
  })  // CRUD operations
  const createProject = async (projectData) => {
    const newProject = {
      id: Math.max(...projects.value.map(p => p.id)) + 1,
      ...projectData,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    projects.value.push(newProject)
      // Add notification and toast
    notificationStore.addNotification('PROJECT_CREATED', `New project "${newProject.name}" has been created`);
    toastStore.addToast(`Project "${newProject.name}" created successfully!`, 'success');
    
    return newProject
  }

  const updateProject = (projectId, updates) => {
    const index = projects.value.findIndex(p => p.id === projectId)
    if (index !== -1) {
      projects.value[index] = {
        ...projects.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      return projects.value[index]
    }
    return null
  }

  const deleteProject = (projectId) => {
    const index = projects.value.findIndex(p => p.id === projectId)
    if (index !== -1) {
      projects.value.splice(index, 1)
      return true
    }
    return false
  }

  const getProjectById = (projectId) => {
    return projects.value.find(p => p.id === projectId)
  }

  const getProjectsByManager = (managerId) => {
    return projects.value.filter(p => p.managerId === managerId)
  }

  const getProjectsByDepartment = (departmentId) => {
    return projects.value.filter(p => p.departmentId === departmentId)
  }

  const getProjectsByEmployee = (employeeId) => {
    return projects.value.filter(p => p.teamMembers.includes(employeeId))
  }

  const updateProjectProgress = (projectId, progress) => {
    const project = getProjectById(projectId)
    if (project) {
      project.progress = Math.max(0, Math.min(100, progress))
      project.updatedAt = new Date().toISOString()
      
      // Auto-update status based on progress
      if (progress === 100 && project.status !== PROJECT_STATUSES.COMPLETED) {
        project.status = PROJECT_STATUSES.COMPLETED
      } else if (progress > 0 && project.status === PROJECT_STATUSES.PLANNING) {
        project.status = PROJECT_STATUSES.IN_PROGRESS
      }
      
      return project
    }
    return null
  }

  const addTeamMember = (projectId, employeeId) => {
    const project = getProjectById(projectId)
    if (project && !project.teamMembers.includes(employeeId)) {
      project.teamMembers.push(employeeId)
      project.updatedAt = new Date().toISOString()
      return true
    }
    return false
  }

  const removeTeamMember = (projectId, employeeId) => {
    const project = getProjectById(projectId)
    if (project) {
      const index = project.teamMembers.indexOf(employeeId)
      if (index !== -1) {
        project.teamMembers.splice(index, 1)
        project.updatedAt = new Date().toISOString()
        return true
      }
    }
    return false
  }

  const duplicateProject = (projectId) => {
    const original = getProjectById(projectId)
    if (original) {
      const duplicated = {
        ...original,
        id: Math.max(...projects.value.map(p => p.id)) + 1,
        name: `${original.name} (Copy)`,
        status: PROJECT_STATUSES.PLANNING,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      projects.value.push(duplicated)
      return duplicated
    }
    return null
  }

  // Utility functions
  const clearFilters = () => {
    searchQuery.value = ''
    selectedStatus.value = ''
    selectedPriority.value = ''
    selectedDepartment.value = ''
    selectedManager.value = ''
  }

  const getStatusColor = (status) => {
    const colors = {
      [PROJECT_STATUSES.PLANNING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      [PROJECT_STATUSES.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      [PROJECT_STATUSES.ON_HOLD]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      [PROJECT_STATUSES.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      [PROJECT_STATUSES.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      [PROJECT_PRIORITIES.LOW]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      [PROJECT_PRIORITIES.MEDIUM]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      [PROJECT_PRIORITIES.HIGH]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      [PROJECT_PRIORITIES.CRITICAL]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  const formatBudget = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getProjectDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A'
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `${diffDays} days`
    } else if (diffDays < 365) {
      return `${Math.round(diffDays / 30)} months`
    } else {
      return `${Math.round(diffDays / 365)} years`
    }
  }

  return {
    // State
    projects,
    searchQuery,
    selectedStatus,
    selectedPriority,
    selectedDepartment,
    selectedManager,
    sortBy,
    sortOrder,

    // Computed
    filteredProjects,
    projectStats,

    // Constants
    PROJECT_STATUSES,
    PROJECT_PRIORITIES,

    // CRUD operations
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByManager,
    getProjectsByDepartment,
    getProjectsByEmployee,
    duplicateProject,

    // Project management
    updateProjectProgress,
    addTeamMember,
    removeTeamMember,

    // Utilities
    clearFilters,
    getStatusColor,
    getPriorityColor,
    formatBudget,
    formatDate,
    getProjectDuration
  }
}

