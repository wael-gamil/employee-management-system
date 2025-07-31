/**
 * Data Service - Manages all data persistence using localStorage
 * Acts as a mini database with relationships between entities
 */

class DataService {
  constructor() {
    this.storageKeys = {
      companies: 'ems_companies',
      departments: 'ems_departments',
      employees: 'ems_employees',
      users: 'ems_users',
      projects: 'ems_projects',
      currentUser: 'ems_current_user',
      settings: 'ems_settings',
    };

    // Initialize with default data if not exists
    this.initializeDefaultData();
  }

  // Generic CRUD operations
  getAll(entityType) {
    const data = localStorage.getItem(this.storageKeys[entityType]);
    return data ? JSON.parse(data) : [];
  }

  getById(entityType, id) {
    const items = this.getAll(entityType);
    return items.find(item => item.id === id);
  }

  create(entityType, item) {
    const items = this.getAll(entityType);
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    this.saveAll(entityType, items);

    // Trigger cascade updates if needed
    this.handleCascadeUpdates(entityType, 'create', newItem);

    return newItem;
  }

  update(entityType, id, updates) {
    const items = this.getAll(entityType);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    const oldItem = { ...items[index] };
    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedItem;
    this.saveAll(entityType, items);

    // Trigger cascade updates if needed
    this.handleCascadeUpdates(entityType, 'update', updatedItem, oldItem);

    return updatedItem;
  }

  delete(entityType, id) {
    const items = this.getAll(entityType);
    const item = items.find(item => item.id === id);
    if (!item) return false;

    const filteredItems = items.filter(item => item.id !== id);
    this.saveAll(entityType, filteredItems);

    // Trigger cascade updates if needed
    this.handleCascadeUpdates(entityType, 'delete', item);

    return true;
  }

  saveAll(entityType, items) {
    localStorage.setItem(this.storageKeys[entityType], JSON.stringify(items));
  }

  // Handle relationships and cascade updates
  handleCascadeUpdates(entityType, operation, item, oldItem = null) {
    switch (entityType) {
      case 'companies':
        if (operation === 'delete') {
          // When company is deleted, update departments and employees
          this.updateDepartmentsOnCompanyDelete(item.id);
          this.updateEmployeesOnCompanyDelete(item.id);
        } else if (operation === 'update' && oldItem) {
          // Update related entities if company name changed
          this.updateRelatedEntitiesOnCompanyUpdate(item, oldItem);
        }
        break;

      case 'departments':
        if (operation === 'delete') {
          // When department is deleted, update employees
          this.updateEmployeesOnDepartmentDelete(item.id);
        } else if (operation === 'update' && oldItem) {
          this.updateEmployeesOnDepartmentUpdate(item, oldItem);
        }
        break;

      case 'employees':
        if (operation === 'create' || operation === 'update') {
          // Update department employee count
          this.updateDepartmentEmployeeCount(item.departmentId);
          this.updateCompanyEmployeeCount(item.companyId);
        } else if (operation === 'delete') {
          this.updateDepartmentEmployeeCount(item.departmentId);
          this.updateCompanyEmployeeCount(item.companyId);
        }
        break;
    }
  }

  // Cascade update methods
  updateDepartmentsOnCompanyDelete(companyId) {
    const departments = this.getAll('departments');
    const updatedDepartments = departments.map(dept =>
      dept.companyId === companyId
        ? { ...dept, companyId: null, companyName: 'Unassigned' }
        : dept
    );
    this.saveAll('departments', updatedDepartments);
  }

  updateEmployeesOnCompanyDelete(companyId) {
    const employees = this.getAll('employees');
    const updatedEmployees = employees.map(emp =>
      emp.companyId === companyId
        ? { ...emp, companyId: null, companyName: 'Unassigned' }
        : emp
    );
    this.saveAll('employees', updatedEmployees);
  }

  updateEmployeesOnDepartmentDelete(departmentId) {
    const employees = this.getAll('employees');
    const updatedEmployees = employees.map(emp =>
      emp.departmentId === departmentId
        ? { ...emp, departmentId: null, department: 'Unassigned' }
        : emp
    );
    this.saveAll('employees', updatedEmployees);
  }

  updateRelatedEntitiesOnCompanyUpdate(newCompany, oldCompany) {
    if (newCompany.name !== oldCompany.name) {
      // Update departments
      const departments = this.getAll('departments');
      const updatedDepartments = departments.map(dept =>
        dept.companyId === newCompany.id
          ? { ...dept, companyName: newCompany.name }
          : dept
      );
      this.saveAll('departments', updatedDepartments);

      // Update employees
      const employees = this.getAll('employees');
      const updatedEmployees = employees.map(emp =>
        emp.companyId === newCompany.id
          ? { ...emp, companyName: newCompany.name }
          : emp
      );
      this.saveAll('employees', updatedEmployees);
    }
  }

  updateEmployeesOnDepartmentUpdate(newDept, oldDept) {
    if (newDept.name !== oldDept.name) {
      const employees = this.getAll('employees');
      const updatedEmployees = employees.map(emp =>
        emp.departmentId === newDept.id
          ? { ...emp, department: newDept.name }
          : emp
      );
      this.saveAll('employees', updatedEmployees);
    }
  }

  updateDepartmentEmployeeCount(departmentId) {
    if (!departmentId) return;

    const employees = this.getAll('employees');
    const count = employees.filter(
      emp => emp.departmentId === departmentId
    ).length;

    const departments = this.getAll('departments');
    const updatedDepartments = departments.map(dept =>
      dept.id === departmentId ? { ...dept, employeeCount: count } : dept
    );
    this.saveAll('departments', updatedDepartments);
  }

  updateCompanyEmployeeCount(companyId) {
    if (!companyId) return;

    const employees = this.getAll('employees');
    const departments = this.getAll('departments');

    const employeeCount = employees.filter(
      emp => emp.companyId === companyId
    ).length;
    const departmentCount = departments.filter(
      dept => dept.companyId === companyId
    ).length;

    const companies = this.getAll('companies');
    const updatedCompanies = companies.map(company =>
      company.id === companyId
        ? { ...company, employeeCount, departments: departmentCount }
        : company
    );
    this.saveAll('companies', updatedCompanies);
  }

  // User and session management
  getCurrentUser() {
    const userData = localStorage.getItem(this.storageKeys.currentUser);
    return userData ? JSON.parse(userData) : null;
  }

  setCurrentUser(user) {
    localStorage.setItem(this.storageKeys.currentUser, JSON.stringify(user));
  }

  clearSession() {
    localStorage.removeItem(this.storageKeys.currentUser);
  }

  // Settings management
  getSettings() {
    const settings = localStorage.getItem(this.storageKeys.settings);
    return settings ? JSON.parse(settings) : this.getDefaultSettings();
  }

  updateSettings(newSettings) {
    const settings = { ...this.getSettings(), ...newSettings };
    localStorage.setItem(this.storageKeys.settings, JSON.stringify(settings));
    return settings;
  }

  getDefaultSettings() {
    return {
      theme: 'light',
      language: 'en',
      dateFormat: 'MM/dd/yyyy',
      timezone: 'UTC',
    };
  }

  // Utility methods
  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  // Bulk operations
  bulkUpdate(entityType, updates) {
    const items = this.getAll(entityType);
    const updatedItems = items.map(item => {
      const update = updates.find(u => u.id === item.id);
      return update
        ? { ...item, ...update.data, updatedAt: new Date().toISOString() }
        : item;
    });
    this.saveAll(entityType, updatedItems);
    return updatedItems;
  }

  bulkDelete(entityType, ids) {
    const items = this.getAll(entityType);
    const deletedItems = items.filter(item => ids.includes(item.id));
    const remainingItems = items.filter(item => !ids.includes(item.id));

    this.saveAll(entityType, remainingItems);

    // Handle cascade deletes
    deletedItems.forEach(item => {
      this.handleCascadeUpdates(entityType, 'delete', item);
    });

    return deletedItems;
  }

  // Search and filter
  search(entityType, query, fields = []) {
    const items = this.getAll(entityType);
    if (!query) return items;

    const lowerQuery = query.toLowerCase();
    return items.filter(item => {
      if (fields.length === 0) {
        // Search all string fields
        return Object.values(item).some(
          value =>
            typeof value === 'string' &&
            value.toLowerCase().includes(lowerQuery)
        );
      } else {
        // Search specific fields
        return fields.some(
          field =>
            item[field] &&
            typeof item[field] === 'string' &&
            item[field].toLowerCase().includes(lowerQuery)
        );
      }
    });
  }
  // Initialize default data
  initializeDefaultData() {
    // Initialize companies if not exists
    if (!localStorage.getItem(this.storageKeys.companies)) {
      const defaultCompanies = [
        {
          id: 1,
          name: 'TechCorp Solutions',
          code: 'TECH001',
          address: '123 Tech Street, Silicon Valley, CA',
          status: 'active',
          employeeCount: 150,
          departments: 8,
          parentId: null,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          name: 'Innovation Labs',
          code: 'INNO002',
          address: '456 Innovation Ave, Austin, TX',
          status: 'active',
          employeeCount: 89,
          departments: 5,
          parentId: null,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 3,
          name: 'TechCorp Europe',
          code: 'TECH003',
          address: '789 Tech Plaza, London, UK',
          status: 'active',
          employeeCount: 75,
          departments: 4,
          parentId: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 4,
          name: 'TechCorp Asia',
          code: 'TECH004',
          address: '321 Innovation Blvd, Singapore',
          status: 'active',
          employeeCount: 45,
          departments: 3,
          parentId: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 5,
          name: 'Innovation R&D',
          code: 'INNO005',
          address: '654 Research Park, Austin, TX',
          status: 'active',
          employeeCount: 25,
          departments: 2,
          parentId: 2,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 6,
          name: 'TechCorp UK North',
          code: 'TECH006',
          address: '987 Business St, Manchester, UK',
          status: 'active',
          employeeCount: 30,
          departments: 2,
          parentId: 3,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      this.saveAll('companies', defaultCompanies);
    }

    // Initialize departments if not exists
    if (!localStorage.getItem(this.storageKeys.departments)) {
      const defaultDepartments = [
        {
          id: 1,
          name: 'Engineering',
          description: 'Software development and technical operations',
          companyId: 1,
          companyName: 'TechCorp Solutions',
          headId: null,
          employeeCount: 45,
          order: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          name: 'Marketing',
          description: 'Digital marketing and brand management',
          companyId: 1,
          companyName: 'TechCorp Solutions',
          headId: null,
          employeeCount: 25,
          order: 2,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      this.saveAll('departments', defaultDepartments);
    }

    // Initialize employees if not exists
    if (!localStorage.getItem(this.storageKeys.employees)) {
      const defaultEmployees = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@techcorp.com',
          phone: '+1-555-0123',
          department: 'Engineering',
          departmentId: 1,
          companyId: 1,
          companyName: 'TechCorp Solutions',
          role: 'Senior Developer',
          status: 'active',
          hireDate: '2023-03-15',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@techcorp.com',
          phone: '+1-555-0124',
          department: 'Marketing',
          departmentId: 2,
          companyId: 1,
          companyName: 'TechCorp Solutions',
          role: 'Marketing Manager',
          status: 'active',
          hireDate: '2023-01-10',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      this.saveAll('employees', defaultEmployees);
    } // Initialize users if not exists
    if (!localStorage.getItem(this.storageKeys.users)) {
      const defaultUsers = [
        {
          id: 1,
          email: 'admin@company.com',
          name: 'John Doe',
          role: 'Administrator',
          department: 'IT',
          company: 'Tech Corp',
          position: 'System Administrator',
          phone: '+1 (555) 123-4567',
          avatar: null,
          permissions: ['*'], // All permissions
          joinDate: '2023-01-15',
          lastLogin: new Date().toISOString(),
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          email: 'hr@company.com',
          name: 'Sarah Wilson',
          role: 'HR Manager',
          department: 'Human Resources',
          company: 'Tech Corp',
          position: 'HR Manager',
          phone: '+1 (555) 234-5678',
          avatar: null,
          permissions: [
            'view_company',
            'edit_company',
            'create_employee',
            'view_employee',
            'edit_employee',
          ],
          joinDate: '2023-02-01',
          lastLogin: new Date().toISOString(),
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 3,
          email: 'manager@company.com',
          name: 'Mike Johnson',
          role: 'Department Head',
          department: 'Engineering',
          company: 'Tech Corp',
          position: 'Engineering Manager',
          phone: '+1 (555) 345-6789',
          avatar: null,
          permissions: [
            'view_company',
            'view_employee',
            'edit_employee',
            'view_department',
          ],
          joinDate: '2023-03-01',
          lastLogin: new Date().toISOString(),
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 4,
          email: 'employee@company.com',
          name: 'Lisa Chen',
          role: 'Employee',
          department: 'Engineering',
          company: 'Tech Corp',
          position: 'Software Developer',
          phone: '+1 (555) 456-7890',
          avatar: null,
          permissions: ['view_company', 'view_employee', 'view_department'],
          joinDate: '2023-04-01',
          lastLogin: new Date().toISOString(),
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      this.saveAll('users', defaultUsers);
    }
  }

  // Clear all data (for testing/reset)
  clearAllData() {
    Object.values(this.storageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
    this.initializeDefaultData();
  }

  // Dashboard Statistics Methods
  getDashboardStats() {
    const companies = this.getAll('companies');
    const employees = this.getAll('employees');
    const departments = this.getAll('departments');
    const projects = this.getAll('projects');

    // Calculate active projects (assuming projects with status 'active' or 'in-progress')
    const activeProjects = projects.filter(project => 
      project.status === 'active' || project.status === 'in-progress' || project.status === 'Active'
    );

    return {
      totalCompanies: companies.length,
      totalEmployees: employees.length,
      totalDepartments: departments.length,
      activeProjects: activeProjects.length,
    };
  }

  // Get statistics with percentage changes (comparing to a month ago)
  getDashboardStatsWithChanges() {
    const stats = this.getDashboardStats();
    
    // For demo purposes, we'll calculate mock percentage changes
    // In a real app, you'd store historical data and compare
    const mockChanges = {
      companies: Math.floor(Math.random() * 20) - 5, // -5 to +15%
      employees: Math.floor(Math.random() * 15) + 2, // +2 to +17%
      departments: Math.floor(Math.random() * 10) - 3, // -3 to +7%
      projects: Math.floor(Math.random() * 25) + 5, // +5 to +30%
    };

    return {
      companies: {
        value: stats.totalCompanies,
        change: mockChanges.companies,
      },
      employees: {
        value: stats.totalEmployees,
        change: mockChanges.employees,
      },
      departments: {
        value: stats.totalDepartments,
        change: mockChanges.departments,
      },
      projects: {
        value: stats.activeProjects,
        change: mockChanges.projects,
      },
    };
  }
}

// Create singleton instance
export const dataService = new DataService();
export default dataService;
