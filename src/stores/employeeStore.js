import { ref, computed } from 'vue';
import { dataService } from '@/services/dataService';
import { useNotificationStore } from '@/stores/notificationStore';
import { useToastStore } from '@/stores/toastStore';

export function useEmployeeStore() {
  // Get store instances
  const notificationStore = useNotificationStore();
  const toastStore = useToastStore();

  // Reactive state
  const employees = ref(dataService.getAll('employees'));
  const employeeSearch = ref('');
  const employeeFilter = ref('');
  const selectedEmployees = ref([]);

  // Get related data
  const companies = computed(() => dataService.getAll('companies'));
  const departments = computed(() => dataService.getAll('departments'));

  // Computed
  const filteredEmployees = computed(() => {
    let filtered = employees.value;

    // Apply search filter
    if (employeeSearch.value) {
      filtered = dataService.search('employees', employeeSearch.value, [
        'name',
        'email',
        'role',
      ]);
    } else {
      filtered = employees.value;
    }

    // Apply department filter
    if (employeeFilter.value) {
      filtered = filtered.filter(
        employee => employee.department === employeeFilter.value
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  });

  const employeeStats = computed(() => ({
    total: employees.value.length,
    active: employees.value.filter(e => e.status === 'active').length,
    inactive: employees.value.filter(e => e.status === 'inactive').length,
    departments: new Set(employees.value.map(e => e.departmentId)).size,
  }));

  // Actions
  const loadEmployees = () => {
    employees.value = dataService.getAll('employees');
  };
  const addEmployee = async employeeData => {
    // Get department and company info
    const department = dataService.getById(
      'departments',
      employeeData.departmentId
    );
    const company = dataService.getById('companies', employeeData.companyId);

    const newEmployee = dataService.create('employees', {
      ...employeeData,
      department: department?.name || 'Unassigned',
      companyName: company?.name || 'Unassigned',
      status: employeeData.status || 'active',
    });

    employees.value = dataService.getAll('employees');
    // Add notification and toast
    notificationStore.addNotification(
      'EMPLOYEE_CREATED',
      `New employee "${newEmployee.name}" has been added`
    );
    toastStore.addToast(
      `Employee "${newEmployee.name}" added successfully!`,
      'success'
    );

    return newEmployee;
  };
  const updateEmployee = (id, updates) => {
    // Update department and company names if IDs changed
    if (updates.departmentId) {
      const department = dataService.getById(
        'departments',
        updates.departmentId
      );
      updates.department = department?.name || 'Unassigned';
      updates.companyId = department?.companyId;

      if (department?.companyId) {
        const company = dataService.getById('companies', department.companyId);
        updates.companyName = company?.name || 'Unassigned';
      }
    }

    const updatedEmployee = dataService.update('employees', id, updates);
    employees.value = dataService.getAll('employees');
    
    // Add notification and toast
    notificationStore.addNotification(
      'EMPLOYEE_UPDATED',
      `Employee "${updatedEmployee.name}" has been updated`
    );
    toastStore.addToast(
      `Employee "${updatedEmployee.name}" updated successfully!`,
      'success'
    );
    
    return updatedEmployee;
  };
  const deleteEmployee = id => {
    const employee = dataService.getById('employees', id);
    const success = dataService.delete('employees', id);
    if (success) {
      employees.value = dataService.getAll('employees');
      
      // Add notification and toast
      notificationStore.addNotification(
        'EMPLOYEE_DELETED',
        `Employee "${employee?.name || 'Unknown'}" has been deleted`
      );
      toastStore.addToast(
        `Employee "${employee?.name || 'Unknown'}" deleted successfully!`,
        'success'
      );
    }
    return success;
  };

  const getEmployeeById = id => {
    return dataService.getById('employees', id);
  };

  // Advanced filtering and sorting
  const filterEmployees = filters => {
    let filtered = employees.value;

    // Department filter
    if (filters.departments && filters.departments.length > 0) {
      filtered = filtered.filter(emp =>
        filters.departments.includes(emp.departmentId)
      );
    }

    // Role filter
    if (filters.roles && filters.roles.length > 0) {
      filtered = filtered.filter(emp => filters.roles.includes(emp.role));
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(emp => filters.statuses.includes(emp.status));
    }

    // Hire date range
    if (filters.hireDateFrom) {
      filtered = filtered.filter(
        emp => new Date(emp.hireDate) >= new Date(filters.hireDateFrom)
      );
    }
    if (filters.hireDateTo) {
      filtered = filtered.filter(
        emp => new Date(emp.hireDate) <= new Date(filters.hireDateTo)
      );
    }

    return filtered;
  };

  const sortEmployees = (sortBy, sortOrder = 'asc') => {
    return [...employees.value].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle date sorting
      if (sortBy === 'hireDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      // Handle string sorting
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  };

  // Bulk operations
  const bulkUpdateEmployees = (employeeIds, updates) => {
    const updateData = employeeIds.map(id => ({
      id,
      data: updates,
    }));

    dataService.bulkUpdate('employees', updateData);
    employees.value = dataService.getAll('employees');
    selectedEmployees.value = [];
  };

  const bulkDeleteEmployees = employeeIds => {
    const deleted = dataService.bulkDelete('employees', employeeIds);
    employees.value = dataService.getAll('employees');
    selectedEmployees.value = [];
    return deleted;
  };

  // Selection functions
  const toggleEmployeeSelection = employeeId => {
    const index = selectedEmployees.value.indexOf(employeeId);
    if (index > -1) {
      selectedEmployees.value.splice(index, 1);
    } else {
      selectedEmployees.value.push(employeeId);
    }
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.value.length === filteredEmployees.value.length) {
      selectedEmployees.value = [];
    } else {
      selectedEmployees.value = filteredEmployees.value.map(e => e.id);
    }
  };

  // Export functionality
  const exportEmployees = (format = 'json', includeFiltered = true) => {
    const data = includeFiltered ? filteredEmployees.value : employees.value;

    if (format === 'csv') {
      const headers = [
        'ID',
        'Name',
        'Email',
        'Department',
        'Role',
        'Status',
        'Hire Date',
        'Company',
      ];
      const csvContent = [
        headers.join(','),
        ...data.map(emp =>
          [
            emp.id,
            `"${emp.name}"`,
            emp.email,
            `"${emp.department}"`,
            `"${emp.role}"`,
            emp.status,
            emp.hireDate,
            `"${emp.companyName || ''}"`,
          ].join(',')
        ),
      ].join('\n');

      return csvContent;
    }

    return JSON.stringify(data, null, 2);
  };

  const downloadExport = (format = 'json') => {
    const content = exportEmployees(format);
    const blob = new Blob([content], {
      type: format === 'csv' ? 'text/csv' : 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Employee timeline/history
  const getEmployeeHistory = employeeId => {
    // This would track role changes, department moves, etc.
    // For now, return basic info
    const employee = getEmployeeById(employeeId);
    return employee
      ? [
          {
            date: employee.hireDate,
            event: 'Hired',
            details: `Joined as ${employee.role} in ${employee.department}`,
          },
        ]
      : [];
  };

  // Initialize data
  loadEmployees();

  return {
    // State
    employees,
    employeeSearch,
    employeeFilter,
    selectedEmployees,
    companies,
    departments,

    // Computed
    filteredEmployees,
    employeeStats,

    // Actions
    loadEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    filterEmployees,
    sortEmployees,
    bulkUpdateEmployees,
    bulkDeleteEmployees,
    toggleEmployeeSelection,
    toggleSelectAll,
    exportEmployees,
    downloadExport,
    getEmployeeHistory,
  };
}

// const employees = ref([
//   {
//     id: 1,
//     name: 'Sarah Johnson',
//     email: 'sarah.johnson@techcorp.com',
//     department: 'Engineering',
//     role: 'Senior Developer',
//     status: 'active',
//     hireDate: '2023-01-15',
//   },
//   {
//     id: 2,
//     name: 'Michael Chen',
//     email: 'michael.chen@techcorp.com',
//     department: 'Marketing',
//     role: 'Marketing Manager',
//     status: 'active',
//     hireDate: '2022-11-20',
//   },
//   {
//     id: 3,
//     name: 'Emily Rodriguez',
//     email: 'emily.rodriguez@techcorp.com',
//     department: 'Sales',
//     role: 'Sales Representative',
//     status: 'active',
//     hireDate: '2023-03-10',
//   },
//   {
//     id: 4,
//     name: 'David Wilson',
//     email: 'david.wilson@techcorp.com',
//     department: 'HR',
//     role: 'HR Specialist',
//     status: 'active',
//     hireDate: '2022-08-05',
//   },
//   {
//     id: 5,
//     name: 'Lisa Thompson',
//     email: 'lisa.thompson@techcorp.com',
//     department: 'Engineering',
//     role: 'Frontend Developer',
//     status: 'active',
//     hireDate: '2023-02-28',
//   },
//   {
//     id: 6,
//     name: 'James Brown',
//     email: 'james.brown@techcorp.com',
//     department: 'Sales',
//     role: 'Sales Manager',
//     status: 'inactive',
//     hireDate: '2021-12-15',
//   },
// ]);

// const employeeSearch = ref('');
// const employeeFilter = ref('');

// const availablePermissions = ref([
//   'View Dashboard',
//   'Manage Companies',
//   'Manage Employees',
//   'Manage Departments',
//   'View Reports',
//   'Export Data',
//   'System Settings',
//   'User Management',
//   'Audit Logs',
// ]);

// export function useEmployeeStore() {
//   const filteredEmployees = computed(() => {
//     let filtered = employees.value;

//     if (employeeSearch.value) {
//       filtered = filtered.filter(
//         employee =>
//           employee.name
//             .toLowerCase()
//             .includes(employeeSearch.value.toLowerCase()) ||
//           employee.email
//             .toLowerCase()
//             .includes(employeeSearch.value.toLowerCase())
//       );
//     }

//     if (employeeFilter.value) {
//       filtered = filtered.filter(
//         employee => employee.department === employeeFilter.value
//       );
//     }

//     return filtered;
//   });

//   const addEmployee = employeeData => {
//     const newEmployee = {
//       id: Date.now(),
//       status: 'active',
//       ...employeeData,
//     };
//     employees.value.push(newEmployee);
//   };

//   const updateEmployee = (id, employeeData) => {
//     const index = employees.value.findIndex(e => e.id === id);
//     if (index !== -1) {
//       employees.value[index] = { ...employees.value[index], ...employeeData };
//     }
//   };
//   const deleteEmployee = id => {
//     employees.value = employees.value.filter(e => e.id !== id);
//   };

//   const getEmployeeById = id => {
//     return employees.value.find(e => e.id === id);
//   };

//   return {
//     employees,
//     employeeSearch,
//     employeeFilter,
//     availablePermissions,
//     filteredEmployees,
//     addEmployee,
//     updateEmployee,
//     deleteEmployee,
//     getEmployeeById,
//   };
// }
