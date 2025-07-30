# Role-Based Authentication System

## Overview

This document outlines the role-based authentication and authorization system implemented in the Employee Management System. The system provides secure access control with different permission levels for various user roles.

## Features Implemented

### 1. Authentication System

- **Multi-role authentication** with sample users for testing
- **Session persistence** with "Remember me" functionality
- **Secure login/logout** with proper state management
- **Password change** functionality
- **Profile management** for users

### 2. Role-Based Access Control (RBAC)

#### Defined Roles
- **Super Admin**: Full system access
- **Administrator**: Comprehensive management access
- **HR Manager**: Employee and department management
- **Department Head**: Limited department and employee access
- **Employee**: Basic access with own profile management
- **Viewer**: Read-only access

#### Permission System
The system uses granular permissions for fine-grained access control:

**Company Management**
- `create_company`, `view_company`, `edit_company`, `delete_company`

**Employee Management**
- `create_employee`, `view_employee`, `edit_employee`, `delete_employee`, `edit_own_profile`

**Department Management**
- `create_department`, `view_department`, `edit_department`, `delete_department`, `manage_department_members`

**Reports and Analytics**
- `view_reports`, `view_analytics`, `export_data`

**System Administration**
- `manage_settings`, `manage_users`, `manage_roles`, `view_audit_logs`

### 3. Dynamic Menu System

The sidebar menu is dynamically filtered based on user permissions:
- Users only see menu items they have access to
- Dashboard is always available
- Menu items require specific permissions to be visible

### 4. User Interface Enhancements

#### Enhanced Login Screen
- Demo user selection for easy testing
- Password visibility toggle
- Loading states and error handling
- Responsive design

#### Improved Header
- User role display
- Enhanced notifications system
- User menu with profile access
- Role-based menu options

#### User Profile Modal
- **Personal Information Tab**: Edit profile details
- **Security Tab**: Change password with validation
- **Activity Log Tab**: View recent account activity
- Role-based field access control

## Demo Users

For testing purposes, the following demo users are available:

| Email | Role | Access Level |
|-------|------|-------------|
| `admin@company.com` | Administrator | Full access except Super Admin features |
| `hr@company.com` | HR Manager | Employee and department management |
| `manager@company.com` | Department Head | Limited department access |
| `employee@company.com` | Employee | Basic access, own profile only |

**Password for all users**: `password`

## Technical Implementation

### Store Architecture
- **authStore.js**: Authentication state, user management, permissions
- **uiStore.js**: UI state with role-based menu filtering

### Components
- **LoginScreen.vue**: Enhanced authentication interface
- **AppHeader.vue**: Role-aware header with user menu
- **AppSidebar.vue**: Dynamic menu based on permissions
- **UserProfileModal.vue**: Comprehensive profile management

### Permission Checking
```javascript
// Check single permission
hasPermission('view_employee')

// Check multiple permissions (OR)
hasAnyPermission(['view_employee', 'edit_employee'])

// Check multiple permissions (AND)
hasAllPermissions(['view_employee', 'edit_employee'])

// Check resource access
canAccess('employee', 'edit')
```

## Security Features

1. **Session Management**: Automatic session restoration on page refresh
2. **Route Protection**: Unauthorized access redirects to accessible views
3. **Component-level Security**: UI elements hidden based on permissions
4. **Password Security**: Strong password requirements and validation
5. **Activity Logging**: Track user actions for audit purposes

## Usage Examples

### Checking Permissions in Components
```vue
<template>
  <button v-if="hasPermission('create_employee')" @click="createEmployee">
    Add Employee
  </button>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'

export default {
  setup() {
    const { hasPermission } = useAuthStore()
    return { hasPermission }
  }
}
</script>
```

### Role-based Menu Items
```javascript
// In uiStore.js
const menuItems = computed(() => {
  return allMenuItems.value.filter(item => {
    if (item.id === 'dashboard') return true
    return authStore.hasAnyPermission(item.permissions)
  })
})
```

## Future Enhancements

1. **Two-Factor Authentication (2FA)**
2. **OAuth Integration** (Google, Microsoft, etc.)
3. **Advanced Audit Logging** with detailed action tracking
4. **Role Management Interface** for administrators
5. **Permission Templates** for quick role setup
6. **Session Timeout** with automatic logout
7. **API Integration** with real backend authentication

## Testing the System

1. **Start the development server**: `npm run dev`
2. **Access the application**: http://localhost:5175
3. **Test different roles**: Use the demo user buttons on login screen
4. **Observe role differences**: 
   - Compare available menu items between roles
   - Test permission-restricted actions
   - Verify profile management access

## Configuration

### Adding New Permissions
```javascript
// In authStore.js
const PERMISSIONS = {
  // Add new permission
  NEW_PERMISSION: 'new_permission'
}

// Add to role permissions
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // ...existing permissions
    PERMISSIONS.NEW_PERMISSION
  ]
}
```

### Adding New Menu Items
```javascript
// In uiStore.js
const allMenuItems = ref([
  {
    id: 'new-feature',
    name: 'New Feature',
    icon: 'NewFeatureIcon',
    permissions: ['new_permission'],
    description: 'Description of new feature'
  }
])
```

This role-based authentication system provides a solid foundation for secure, scalable user access management while maintaining a clean and intuitive user interface.
