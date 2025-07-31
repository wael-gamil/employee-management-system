<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100"
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Add New Employee
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Wizard Steps -->
        <div class="flex items-center justify-center mb-8">
          <div class="flex items-center space-x-4">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep >= 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
              ]"
            >
              1
            </div>
            <div
              :class="[
                'w-16 h-1',
                currentStep > 1
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700',
              ]"
            ></div>
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep >= 2
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
              ]"
            >
              2
            </div>
            <div
              :class="[
                'w-16 h-1',
                currentStep > 2
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700',
              ]"
            ></div>
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep >= 3
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
              ]"
            >
              3
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Step 1: Personal Info -->
          <div v-if="currentStep === 1" class="space-y-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Personal Information
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >First Name</label
                >
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Last Name</label
                >
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Email</label
              >
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Phone</label
              >
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- Step 2: Role & Department -->
          <div v-if="currentStep === 2" class="space-y-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Role & Department
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Department</label
                >
                <select
                  v-model="form.department"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Department</option>
                  <option
                    v-for="department in availableDepartments"
                    :key="department.id"
                    :value="department.name"
                  >
                    {{ department.name }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Role</label
                >
                <input
                  v-model="form.role"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Hire Date</label
              >
              <input
                v-model="form.hireDate"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- Step 3: Permissions -->
          <div v-if="currentStep === 3" class="space-y-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Permissions
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                >
                  Available Permissions
                </h5>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <div
                    v-for="permission in availablePermissions"
                    :key="permission"
                    class="flex items-center"
                  >
                    <input
                      :id="permission"
                      v-model="form.permissions"
                      :value="permission"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      :for="permission"
                      class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >{{ permission }}</label
                    >
                  </div>
                </div>
              </div>
              <div>
                <h5
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                >
                  Selected Permissions
                </h5>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <div
                    v-for="permission in form.permissions"
                    :key="permission"
                    class="bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded-lg text-sm text-blue-800 dark:text-blue-200"
                  >
                    {{ permission }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between pt-6">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="currentStep--"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Previous
            </button>
            <div v-else></div>
            <div class="flex space-x-3">
              <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                {{ currentStep === 3 ? 'Create Employee' : 'Next' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useEmployeeStore } from '@/stores/employeeStore';
import { useDepartmentStore } from '@/stores/departmentStore';

export default {
  name: 'EmployeeWizard',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const { availablePermissions } = useEmployeeStore();
    const { departments } = useDepartmentStore();

    const availableDepartments = computed(() => departments.value);

    const currentStep = ref(1);
    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      role: '',
      hireDate: '',
      permissions: [],
    });

    const handleSubmit = () => {
      if (currentStep.value < 3) {
        currentStep.value++;
      } else {
        emit('save', { ...form.value });
        // Reset form
        currentStep.value = 1;
        form.value = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          department: '',
          role: '',
          hireDate: '',
          permissions: [],
        };
      }
    };

    return {
      currentStep,
      form,
      availablePermissions,
      availableDepartments,
      handleSubmit,
    };
  },
};
</script>
