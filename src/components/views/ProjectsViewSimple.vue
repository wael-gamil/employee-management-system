<template>
  <div class="space-y-6">
    <!-- Simple Projects View for Testing -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Testing Projects View
      </p>
    </div>

    <!-- Simple Stats -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <p>Total Projects: {{ projects?.length || 0 }}</p>
      <p>Debug: {{ debugInfo }}</p>
    </div>

    <!-- Simple Project List -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-medium mb-4">Projects List</h3>
      <div v-if="projects && projects.length > 0">
        <div
          v-for="project in projects.slice(0, 3)"
          :key="project.id"
          class="mb-2 p-2 border rounded"
        >
          <strong>{{ project.name }}</strong> - {{ project.status }}
        </div>
      </div>
      <div v-else>
        <p>No projects found or loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';

export default {
  name: 'ProjectsViewSimple',
  setup() {
    // Simple test data
    const testProjects = ref([
      { id: 1, name: 'Test Project 1', status: 'In Progress' },
      { id: 2, name: 'Test Project 2', status: 'Planning' },
      { id: 3, name: 'Test Project 3', status: 'Completed' },
    ]);

    const debugInfo = ref('ProjectsView loaded successfully');

    // Try to import the store safely
    let projects = ref([]);
    let projectStore = null;

    try {
      const { useProjectStore } = require('@/stores/projectStore');
      projectStore = useProjectStore();
      projects =
        projectStore.filteredProjects || projectStore.projects || testProjects;
      debugInfo.value = 'Store loaded successfully';
    } catch (error) {
      console.error('Error loading project store:', error);
      projects = testProjects;
      debugInfo.value = `Store error: ${error.message}`;
    }

    return {
      projects,
      debugInfo,
    };
  },
};
</script>
