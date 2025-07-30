# Employee Management System - Refactored Architecture

This project has been refactored from a monolithic Vue.js application into a well-structured, maintainable codebase following Vue.js best practices.

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── layout/             # Layout-related components
│   │   ├── AppSidebar.vue  # Application sidebar with navigation
│   │   ├── AppHeader.vue   # Application header with user menu
│   │   └── MainLayout.vue  # Main layout wrapper
│   ├── modals/             # Modal components
│   │   ├── CompanyModal.vue    # Add/Edit company modal
│   │   └── EmployeeWizard.vue  # Multi-step employee creation
│   ├── views/              # Page/view components
│   │   ├── DashboardView.vue   # Dashboard with stats
│   │   ├── CompaniesView.vue   # Companies management
│   │   ├── EmployeesView.vue   # Employees management
│   │   ├── DepartmentsView.vue # Departments (placeholder)
│   │   ├── ReportsView.vue     # Reports (placeholder)
│   │   └── SettingsView.vue    # Settings (placeholder)
│   ├── LoadingScreen.vue   # Loading screen component
│   └── LoginScreen.vue     # Login form component
├── stores/                 # State management (Composition API)
│   ├── authStore.js        # Authentication state & permissions
│   ├── companyStore.js     # Company data and operations
│   ├── employeeStore.js    # Employee data and operations
│   ├── departmentStore.js  # Department data and operations
│   └── uiStore.js          # UI state (theme, sidebar, etc.)
├── utils/                  # Utility functions and helpers
│   └── iconComponents.js   # SVG icon components
├── assets/                 # Static assets
├── composables/            # Vue composables (if needed)
└── main.js                # Application entry point
```

## 🏗️ Architecture Overview

### State Management
The application uses Vue 3's Composition API for state management, organized into focused stores:

- **authStore.js**: Handles user authentication, permissions, role-based access control
- **companyStore.js**: Manages company data, CRUD operations, filtering
- **employeeStore.js**: Manages employee data, CRUD operations, filtering
- **departmentStore.js**: Manages department data, CRUD operations, reordering, bulk operations
- **uiStore.js**: Controls UI state (theme, sidebar, notifications, role-based menu filtering)

### Component Organization

#### Layout Components
- **MainLayout.vue**: Main application wrapper that combines sidebar and header
- **AppSidebar.vue**: Navigation sidebar with menu items and user info
- **AppHeader.vue**: Top header with theme toggle, notifications, and user menu

#### View Components
Each major section of the app is a separate view component:
- **DashboardView.vue**: Shows statistics and recent activity
- **CompaniesView.vue**: Company management with search/filter
- **EmployeesView.vue**: Employee management with table view

#### Modal Components
- **CompanyModal.vue**: Form for adding/editing companies
- **EmployeeWizard.vue**: Multi-step wizard for adding employees
- **DepartmentModal.vue**: Form for adding/editing departments
- **UserProfileModal.vue**: User profile management with tabs for personal info, security, and activity

### Key Features

#### 🎨 Theme System
- Dark/light mode toggle
- Persistent theme preference in localStorage
- Smooth transitions between themes

#### 🔍 Search & Filtering
- Real-time search in companies and employees
- Department/status filtering
- Computed properties for reactive filtering

#### 📱 Responsive Design
- Mobile-first approach with Tailwind CSS
- Collapsible sidebar for mobile devices
- Responsive grid layouts

#### 🚀 Modern Vue.js Patterns
- Composition API throughout
- Reactive state management
- Component composition
- Proper separation of concerns

## 🔐 Role-Based Access Control (RBAC)

### Authentication & Authorization
The system implements a comprehensive role-based access control system:

- **Multi-role Support**: Super Admin, Administrator, HR Manager, Department Head, Employee, Viewer
- **Granular Permissions**: Fine-grained permission system for different operations
- **Dynamic Menu Filtering**: Menu items shown based on user permissions
- **Session Management**: Persistent sessions with "Remember me" functionality
- **Profile Management**: User profile editing with role-based field access

### Permission System
```javascript
// Permission categories
- Company Management: create/view/edit/delete companies
- Employee Management: create/view/edit/delete employees
- Department Management: create/view/edit/delete departments
- Reports & Analytics: view reports, analytics, export data
- System Administration: manage settings, users, roles, audit logs
```

### Store Updates
- **authStore.js**: Enhanced with permission checking, user management, role hierarchy
- **uiStore.js**: Dynamic menu filtering based on user permissions

### Component Security
- Permission-based UI element visibility
- Role-aware form field access
- Secure route handling with automatic redirects

### Demo Users
```
admin@company.com     - Administrator (full access)
hr@company.com        - HR Manager (employee/dept management)
manager@company.com   - Department Head (limited access)
employee@company.com  - Employee (basic access)
Password: password (for all users)
```

## 🛠️ Development Guidelines

### Adding New Features

1. **New Views**: Add to `components/views/` and register in `MainLayout.vue`
2. **New Modals**: Add to `components/modals/` and import where needed
3. **New State**: Create focused stores in `stores/` directory
4. **New Icons**: Add to `utils/iconComponents.js`

### Code Organization Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Use composables for shared logic
3. **Reactive by Default**: Use Vue's reactivity system properly
4. **Type Safety**: Consider adding TypeScript for larger teams

### File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.vue`)
- **Stores**: camelCase with "Store" suffix (e.g., `userStore.js`)
- **Utils**: camelCase (e.g., `formatDate.js`)
- **Views**: PascalCase with "View" suffix (e.g., `DashboardView.vue`)

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🔄 Migration Benefits

### Before (Monolithic)
- Single 1200+ line component
- Mixed concerns in one file
- Difficult to maintain and test
- Hard to reuse components
- Complex state management

### After (Modular)
- Clear separation of concerns
- Reusable components
- Focused stores for state
- Easy to test individual parts
- Scalable architecture
- Better developer experience

## 📈 Future Enhancements

1. **TypeScript**: Add type safety for better development experience
2. **Testing**: Add unit tests for components and stores
3. **API Integration**: Replace mock data with real API calls
4. **Routing**: Add Vue Router for client-side navigation
5. **Form Validation**: Add comprehensive form validation
6. **Internationalization**: Add multi-language support

## 🤝 Contributing

When contributing to this project:

1. Follow the established folder structure
2. Use the Composition API for new components
3. Keep components focused and single-purpose
4. Update this README when adding new major features
5. Ensure responsive design works on all devices

This refactored architecture provides a solid foundation for scaling the Employee Management System while maintaining code quality and developer productivity.
