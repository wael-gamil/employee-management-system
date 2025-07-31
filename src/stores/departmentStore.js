import { ref, computed } from 'vue';
import { dataService } from '@/services/dataService';
import { useNotificationStore } from '@/stores/notificationStore'
import { useToastStore } from '@/stores/toastStore'

export function useDepartmentStore() {
  // Get store instances
  const notificationStore = useNotificationStore()
  const toastStore = useToastStore()

  // Reactive state
  const departments = ref(dataService.getAll('departments'));
  const departmentSearch = ref('');
  const departmentCompanyFilter = ref('');
  const selectedDepartments = ref([]);

  // Get companies for reference
  const companies = computed(() => dataService.getAll('companies'));
  const employees = computed(() => dataService.getAll('employees'));

  // Computed
  const filteredDepartments = computed(() => {
    let filtered = departments.value;

    // Apply search filter
    if (departmentSearch.value) {
      filtered = dataService.search('departments', departmentSearch.value, [
        'name',
        'description',
      ]);
    } else {
      filtered = departments.value;
    }

    // Apply company filter
    if (departmentCompanyFilter.value) {
      filtered = filtered.filter(
        dept => dept.companyId == departmentCompanyFilter.value
      );
    }

    return filtered.sort((a, b) => {
      if (a.companyId !== b.companyId) {
        return a.companyId - b.companyId;
      }
      return a.order - b.order;
    });
  });

  const statsCards = computed(() => [
    {
      label: 'Total Departments',
      value: departments.value.length,
      icon: 'BuildingOfficeIcon',
      bgColor: 'bg-blue-500',
    },
    {
      label: 'Active Companies',
      value: new Set(departments.value.map(d => d.companyId)).size,
      icon: 'BuildingOffice2Icon',
      bgColor: 'bg-green-500',
    },
    {
      label: 'Total Employees',
      value: departments.value.reduce((sum, d) => sum + d.employeeCount, 0),
      icon: 'UsersIcon',
      bgColor: 'bg-purple-500',
    },
    {
      label: 'Avg per Department',
      value:
        departments.value.length > 0
          ? Math.round(
              departments.value.reduce((sum, d) => sum + d.employeeCount, 0) /
                departments.value.length
            )
          : 0,
      icon: 'ChartBarIcon',
      bgColor: 'bg-orange-500',
    },
  ]);

  // Actions
  const loadDepartments = () => {
    departments.value = dataService.getAll('departments');
  };
  const addDepartment = async departmentData => {
    const company = dataService.getById('companies', departmentData.companyId);
    const maxOrder = Math.max(
      ...departments.value
        .filter(d => d.companyId === departmentData.companyId)
        .map(d => d.order),
      0
    );

    const newDepartment = dataService.create('departments', {
      ...departmentData,
      companyName: company?.name || 'Unknown',
      order: maxOrder + 1,
      employeeCount: 0,
    });

    departments.value = dataService.getAll('departments');

    // Add notification and toast
    notificationStore.addNotification(
        'DEPARTMENT_CREATED',
        `Department "${newDepartment.name}" has been created in ${company?.name || 'Unknown Company'}`
      );
      
      toastStore.addToast({
        type: 'success',
        title: 'Department Created',
        message: `Department "${newDepartment.name}" was successfully created`
      });
    return newDepartment;
  };
  const updateDepartment = async (id, updates) => {
    const oldDepartment = dataService.getById('departments', id);
    
    // If company changed, update company name
    if (updates.companyId) {
      const company = dataService.getById('companies', updates.companyId);
      updates.companyName = company?.name || 'Unknown';
    }

    const updatedDepartment = dataService.update('departments', id, updates);
    departments.value = dataService.getAll('departments');

    // Add notification and toast
    notificationStore.addNotification(
        'DEPARTMENT_UPDATED',
        `Department "${updatedDepartment.name}" has been updated`
      );
      
      toastStore.addToast({
        type: 'success',
        title: 'Department Updated',
        message: `Department "${updatedDepartment.name}" was successfully updated`
      });
    return updatedDepartment;
  };
  const deleteDepartment = async id => {
    const department = dataService.getById('departments', id);
    const success = dataService.delete('departments', id);
    
    if (success) {
      departments.value = dataService.getAll('departments');
      
      // Add notification and toast
      notificationStore.addNotification(
          'DEPARTMENT_DELETED',
          `Department "${department?.name || 'Unknown'}" has been deleted`
        );
        
        toastStore.addToast({
          type: 'success',
          title: 'Department Deleted',
          message: `Department "${department?.name || 'Unknown'}" was successfully deleted`
        });
      }
    
    return success;
  };

  const getDepartmentById = id => {
    return dataService.getById('departments', id);
  };

  // Helper functions
  const getCompanyName = companyId => {
    const company = companies.value.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };

  const getDepartmentHead = headId => {
    if (!headId) return null;
    return employees.value.find(e => e.id === headId);
  };

  const getDepartmentsByCompany = companyId => {
    return departments.value
      .filter(dept => dept.companyId === companyId)
      .sort((a, b) => a.order - b.order);
  };

  // Ordering functions
  const moveUp = department => {
    const sameLevelDepts = departments.value
      .filter(
        d => d.companyId === department.companyId && d.id !== department.id
      )
      .sort((a, b) => a.order - b.order);

    const currentIndex = sameLevelDepts.findIndex(
      d => d.order < department.order
    );
    if (currentIndex >= 0) {
      const swapDept = sameLevelDepts[sameLevelDepts.length - 1 - currentIndex];
      const tempOrder = department.order;
      updateDepartment(department.id, { order: swapDept.order });
      updateDepartment(swapDept.id, { order: tempOrder });
    }
  };

  const moveDown = department => {
    const sameLevelDepts = departments.value
      .filter(
        d => d.companyId === department.companyId && d.id !== department.id
      )
      .sort((a, b) => a.order - b.order);

    const nextDept = sameLevelDepts.find(d => d.order > department.order);
    if (nextDept) {
      const tempOrder = department.order;
      updateDepartment(department.id, { order: nextDept.order });
      updateDepartment(nextDept.id, { order: tempOrder });
    }
  };

  const isFirstInCompany = department => {
    const sameLevelDepts = departments.value.filter(
      d => d.companyId === department.companyId
    );
    return Math.min(...sameLevelDepts.map(d => d.order)) === department.order;
  };

  const isLastInCompany = department => {
    const sameLevelDepts = departments.value.filter(
      d => d.companyId === department.companyId
    );
    return Math.max(...sameLevelDepts.map(d => d.order)) === department.order;
  };

  // Selection functions
  const toggleDepartmentSelection = departmentId => {
    const index = selectedDepartments.value.indexOf(departmentId);
    if (index > -1) {
      selectedDepartments.value.splice(index, 1);
    } else {
      selectedDepartments.value.push(departmentId);
    }
  };

  const toggleSelectAll = () => {
    if (selectedDepartments.value.length === filteredDepartments.value.length) {
      selectedDepartments.value = [];
    } else {
      selectedDepartments.value = filteredDepartments.value.map(d => d.id);
    }
  };
  // Bulk operations
  const bulkAssignCompany = async (departmentIds, newCompanyId) => {
    const company = dataService.getById('companies', newCompanyId);
    const updates = departmentIds.map(id => ({
      id,
      data: {
        companyId: newCompanyId,
        companyName: company?.name || 'Unknown',
      },
    }));

    dataService.bulkUpdate('departments', updates);
    departments.value = dataService.getAll('departments');
    selectedDepartments.value = [];

    // Add notification and toast for bulk operation
    notificationStore.addNotification(
        'DEPARTMENTS_BULK_UPDATED',
        `${departmentIds.length} departments reassigned to ${company?.name || 'Unknown Company'}`
      );
      
      toastStore.addToast({
        type: 'success',
        title: 'Bulk Update Complete',
        message: `${departmentIds.length} departments successfully reassigned to ${company?.name || 'Unknown Company'}`
      });
    };

  const bulkDeleteDepartments = async departmentIds => {
    const deleted = dataService.bulkDelete('departments', departmentIds);
    departments.value = dataService.getAll('departments');
    selectedDepartments.value = [];

    // Add notification and toast for bulk deletion
    notificationStore.addNotification(
        'DEPARTMENTS_BULK_DELETED',
        `${deleted.length} departments have been deleted`
      );
      
      toastStore.addToast({
        type: 'success',
        title: 'Bulk Delete Complete',
        message: `${deleted.length} departments successfully deleted`
      });
    return deleted;
  };

  const getDepartmentStats = () => {
    const totalDepartments = departments.value.length;
    const companiesWithDepartments = new Set(
      departments.value.map(d => d.companyId)
    ).size;
    const departmentsWithHeads = departments.value.filter(d => d.headId).length;
    const totalEmployees = departments.value.reduce(
      (sum, d) => sum + (d.employeeCount || 0),
      0
    );
    const avgEmployeesPerDept =
      totalDepartments > 0 ? totalEmployees / totalDepartments : 0;

    return {
      total: totalDepartments,
      companiesWithDepartments,
      withHeads: departmentsWithHeads,
      avgEmployees: Math.round(avgEmployeesPerDept),
    };
  };

  const reorderDepartments = (companyId, newOrderIds) => {
    // Update the order of departments within a company based on new order array
    newOrderIds.forEach((departmentId, index) => {
      const department = departments.value.find(
        d => d.id === departmentId && d.companyId === companyId
      );
      if (department) {
        dataService.update('departments', departmentId, { order: index + 1 });
      }
    });
    departments.value = dataService.getAll('departments');
  };

  // Initialize data
  loadDepartments();

  return {
    // State
    departments,
    departmentSearch,
    departmentCompanyFilter,
    selectedDepartments,
    companies,

    // Computed
    filteredDepartments,
    statsCards,

    // Actions
    loadDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById,
    getCompanyName,
    getDepartmentHead,
    getDepartmentsByCompany,
    moveUp,
    moveDown,
    isFirstInCompany,
    isLastInCompany,
    toggleDepartmentSelection,
    toggleSelectAll,
    bulkAssignCompany,
    bulkDeleteDepartments,
    getDepartmentStats,
    reorderDepartments,
  };
}

// const departments = ref([
//   {
//     id: 1,
//     name: 'Engineering',
//     companyId: 1,
//     headId: 1, // Employee ID
//     employeeCount: 45,
//     order: 1,
//     description: 'Software development and engineering',
//     createdAt: '2023-01-15'
//   },
//   {
//     id: 2,
//     name: 'Marketing',
//     companyId: 1,
//     headId: 2,
//     employeeCount: 12,
//     order: 2,
//     description: 'Marketing and brand management',
//     createdAt: '2023-02-01'
//   },
//   {
//     id: 3,
//     name: 'Sales',
//     companyId: 1,
//     headId: 6,
//     employeeCount: 18,
//     order: 3,
//     description: 'Sales and customer relations',
//     createdAt: '2023-01-20'
//   },
//   {
//     id: 4,
//     name: 'Human Resources',
//     companyId: 1,
//     headId: 4,
//     employeeCount: 8,
//     order: 4,
//     description: 'HR and talent management',
//     createdAt: '2023-01-10'
//   },
//   {
//     id: 5,
//     name: 'Research & Development',
//     companyId: 2,
//     headId: null,
//     employeeCount: 15,
//     order: 1,
//     description: 'Product research and innovation',
//     createdAt: '2023-03-01'
//   },
//   {
//     id: 6,
//     name: 'Customer Support',
//     companyId: 2,
//     headId: null,
//     employeeCount: 22,
//     order: 2,
//     description: 'Customer service and support',
//     createdAt: '2023-02-15'
//   }
// ])

// const departmentSearch = ref('')
// const departmentCompanyFilter = ref('')

// export function useDepartmentStore() {
//   const { companies } = useCompanyStore()
//   const { employees } = useEmployeeStore()

//   const filteredDepartments = computed(() => {
//     let filtered = departments.value

//     if (departmentSearch.value) {
//       filtered = filtered.filter(department =>
//         department.name.toLowerCase().includes(departmentSearch.value.toLowerCase()) ||
//         department.description.toLowerCase().includes(departmentSearch.value.toLowerCase())
//       )
//     }

//     if (departmentCompanyFilter.value) {
//       filtered = filtered.filter(department =>
//         department.companyId === parseInt(departmentCompanyFilter.value)
//       )
//     }

//     return filtered.sort((a, b) => a.order - b.order)
//   })

//   const getDepartmentsByCompany = (companyId) => {
//     return departments.value
//       .filter(dept => dept.companyId === companyId)
//       .sort((a, b) => a.order - b.order)
//   }

//   const getCompanyName = (companyId) => {
//     const company = companies.value.find(c => c.id === companyId)
//     return company ? company.name : 'Unknown Company'
//   }

//   const getDepartmentHead = (headId) => {
//     if (!headId) return null
//     const employee = employees.value.find(e => e.id === headId)
//     return employee || null
//   }

//   const getAvailableHeads = (companyId, excludeDepartmentId = null) => {
//     // Get employees from the same company who aren't already department heads
//     const companyEmployees = employees.value.filter(emp => {
//       // For now, we'll assume all employees can be heads
//       // In a real app, you might filter by role or seniority
//       return true
//     })

//     const currentHeads = departments.value
//       .filter(dept => dept.id !== excludeDepartmentId && dept.headId)
//       .map(dept => dept.headId)

//     return companyEmployees.filter(emp => !currentHeads.includes(emp.id))
//   }

//   const addDepartment = (departmentData) => {
//     const maxOrder = Math.max(...departments.value
//       .filter(d => d.companyId === departmentData.companyId)
//       .map(d => d.order), 0)

//     const newDepartment = {
//       id: Date.now(),
//       employeeCount: 0,
//       order: maxOrder + 1,
//       createdAt: new Date().toISOString().split('T')[0],
//       ...departmentData
//     }
//     departments.value.push(newDepartment)
//   }

//   const updateDepartment = (id, departmentData) => {
//     const index = departments.value.findIndex(d => d.id === id)
//     if (index !== -1) {
//       departments.value[index] = { ...departments.value[index], ...departmentData }
//     }
//   }

//   const deleteDepartment = (id) => {
//     departments.value = departments.value.filter(d => d.id !== id)
//   }

//   const reorderDepartments = (companyId, newOrder) => {
//     // Update the order of departments within a company
//     newOrder.forEach((departmentId, index) => {
//       const department = departments.value.find(d => d.id === departmentId)
//       if (department) {
//         department.order = index + 1
//       }
//     })
//   }

//   const bulkAssignCompany = (departmentIds, newCompanyId) => {
//     departmentIds.forEach(id => {
//       updateDepartment(id, { companyId: newCompanyId })
//     })
//   }

//   const getDepartmentStats = () => {
//     const totalDepartments = departments.value.length
//     const companiesWithDepartments = new Set(departments.value.map(d => d.companyId)).size
//     const departmentsWithHeads = departments.value.filter(d => d.headId).length
//     const avgEmployeesPerDept = departments.value.reduce((sum, d) => sum + d.employeeCount, 0) / totalDepartments

//     return {
//       total: totalDepartments,
//       companiesWithDepartments,
//       withHeads: departmentsWithHeads,
//       avgEmployees: Math.round(avgEmployeesPerDept)
//     }
//   }

//   return {
//     departments,
//     departmentSearch,
//     departmentCompanyFilter,
//     filteredDepartments,
//     getDepartmentsByCompany,
//     getCompanyName,
//     getDepartmentHead,
//     getAvailableHeads,
//     addDepartment,
//     updateDepartment,
//     deleteDepartment,
//     reorderDepartments,
//     bulkAssignCompany,
//     getDepartmentStats
//   }
// }

