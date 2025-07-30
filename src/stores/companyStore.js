import { ref, computed } from 'vue';
import { dataService } from '@/services/dataService';

export function useCompanyStore() {
  // Reactive state
  const companies = ref(dataService.getAll('companies'));
  const companySearch = ref('');
  const companyFilter = ref('');

  // Computed
  const filteredCompanies = computed(() => {
    let filtered = companies.value;

    // Apply search filter
    if (companySearch.value) {
      filtered = dataService.search('companies', companySearch.value, [
        'name',
        'code',
        'address',
      ]);
    } else {
      filtered = companies.value;
    }

    // Apply status filter
    if (companyFilter.value) {
      filtered = filtered.filter(
        company => company.status === companyFilter.value
      );
    }

    return filtered;
  });

  // Actions
  const loadCompanies = () => {
    companies.value = dataService.getAll('companies');
  };

  const addCompany = companyData => {
    const newCompany = dataService.create('companies', {
      ...companyData,
      status: companyData.status || 'active',
      employeeCount: 0,
      departments: 0,
      parentId: companyData.parentId || null,
    });
    companies.value = dataService.getAll('companies');
    return newCompany;
  };

  const updateCompany = (id, updates) => {
    const updatedCompany = dataService.update('companies', id, updates);
    companies.value = dataService.getAll('companies');
    return updatedCompany;
  };

  const deleteCompany = id => {
    const success = dataService.delete('companies', id);
    if (success) {
      companies.value = dataService.getAll('companies');
    }
    return success;
  };

  const getCompanyById = id => {
    return dataService.getById('companies', id);
  };

  const bulkDeleteCompanies = ids => {
    const deletedCompanies = dataService.bulkDelete('companies', ids);
    companies.value = dataService.getAll('companies');
    return deletedCompanies;
  };

  // Export functionality
  const exportCompanies = (format = 'json') => {
    const data = filteredCompanies.value;

    if (format === 'csv') {
      const headers = [
        'ID',
        'Name',
        'Code',
        'Address',
        'Status',
        'Employee Count',
        'Departments',
      ];
      const csvContent = [
        headers.join(','),
        ...data.map(company =>
          [
            company.id,
            `"${company.name}"`,
            company.code,
            `"${company.address}"`,
            company.status,
            company.employeeCount,
            company.departments,
          ].join(',')
        ),
      ].join('\n');

      return csvContent;
    }

    return JSON.stringify(data, null, 2);
  };

  const downloadExport = (format = 'json') => {
    const content = exportCompanies(format);
    const blob = new Blob([content], {
      type: format === 'csv' ? 'text/csv' : 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Hierarchy functions
  const getCompanyHierarchy = () => {
    const allCompanies = companies.value;
    const hierarchy = [];

    // Get root companies (no parent)
    const rootCompanies = allCompanies.filter(company => !company.parentId);

    const buildHierarchy = parentCompany => {
      const children = allCompanies.filter(
        company => company.parentId === parentCompany.id
      );
      return {
        ...parentCompany,
        children: children.map(child => buildHierarchy(child)),
      };
    };

    return rootCompanies.map(root => buildHierarchy(root));
  };

  const moveCompany = (companyId, newParentId) => {
    return updateCompany(companyId, { parentId: newParentId });
  };

  // Initialize data on first load
  loadCompanies();

  return {
    // State
    companies,
    companySearch,
    companyFilter,

    // Computed
    filteredCompanies,

    // Actions
    loadCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    bulkDeleteCompanies,
    exportCompanies,
    downloadExport,
    getCompanyHierarchy,
    moveCompany,
  };
}
