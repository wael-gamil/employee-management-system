<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <svg
          class="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          ></path>
        </svg>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Company Hierarchy
        </h2>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="collapseAll"
          class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Collapse All
        </button>
        <button
          @click="expandAll"
          class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Expand All
        </button>
      </div>
    </div>

    <!-- Hierarchy Tree -->
    <div class="space-y-2" v-if="hierarchyData.length > 0">
      <CompanyTreeNode
        v-for="rootCompany in hierarchyData"
        :key="rootCompany.id"
        :company="rootCompany"
        :level="0"
        :expanded-nodes="expandedNodes"
        :selected-node="selectedNode"
        @toggle="toggleNode"
        @select="selectNode"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @move="handleMove"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        ></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No Companies Found
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        Create your first company to see the hierarchy tree.
      </p>
    </div>

    <!-- Drag and Drop Overlay -->
    <div
      v-if="isDragging"
      class="fixed inset-0 bg-blue-500 bg-opacity-20 z-50 flex items-center justify-center"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl border-2 border-dashed border-blue-400"
      >
        <div class="text-center">
          <svg
            class="mx-auto h-8 w-8 text-blue-500 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            ></path>
          </svg>
          <p class="text-sm font-medium text-blue-600 dark:text-blue-400">
            Drop to reassign company parent
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useCompanyStore } from '@/stores/companyStore';
import CompanyTreeNode from './CompanyTreeNode.vue';

export default {
  name: 'CompanyTreeView',
  components: {
    CompanyTreeNode,
  },
  props: {
    search: {
      type: String,
      default: '',
    },
    filter: {
      type: String,
      default: '',
    },
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const { getCompanyHierarchy, moveCompany } = useCompanyStore();

    const expandedNodes = ref(new Set());
    const selectedNode = ref(null);
    const isDragging = ref(false);
    const draggedNode = ref(null);

    // Get filtered hierarchy data
    const hierarchyData = computed(() => {
      let hierarchy = getCompanyHierarchy();

      // Apply search filter
      if (props.search) {
        hierarchy = filterHierarchyBySearch(
          hierarchy,
          props.search.toLowerCase()
        );
        // Auto-expand nodes that contain search results
        expandNodesWithMatches(hierarchy);
      }

      // Apply status filter
      if (props.filter) {
        hierarchy = filterHierarchyByStatus(hierarchy, props.filter);
      }

      return hierarchy;
    });

    // Helper function to filter hierarchy by search
    const filterHierarchyBySearch = (nodes, searchTerm) => {
      const filteredNodes = [];

      for (const node of nodes) {
        const matches =
          node.name.toLowerCase().includes(searchTerm) ||
          node.code.toLowerCase().includes(searchTerm) ||
          node.address.toLowerCase().includes(searchTerm);

        let filteredChildren = [];
        if (node.children && node.children.length > 0) {
          filteredChildren = filterHierarchyBySearch(node.children, searchTerm);
        }

        // Include node if it matches or has matching children
        if (matches || filteredChildren.length > 0) {
          filteredNodes.push({
            ...node,
            children: filteredChildren,
          });
        }
      }

      return filteredNodes;
    };

    // Helper function to filter hierarchy by status
    const filterHierarchyByStatus = (nodes, status) => {
      const filteredNodes = [];

      for (const node of nodes) {
        let filteredChildren = [];
        if (node.children && node.children.length > 0) {
          filteredChildren = filterHierarchyByStatus(node.children, status);
        }

        // Include node if it matches status or has matching children
        if (node.status === status || filteredChildren.length > 0) {
          filteredNodes.push({
            ...node,
            children: filteredChildren,
          });
        }
      }

      return filteredNodes;
    };

    // Auto-expand nodes that contain search matches
    const expandNodesWithMatches = nodes => {
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          expandedNodes.value.add(node.id);
          expandNodesWithMatches(node.children);
        }
      }
    };

    // Node management
    const toggleNode = nodeId => {
      if (expandedNodes.value.has(nodeId)) {
        expandedNodes.value.delete(nodeId);
      } else {
        expandedNodes.value.add(nodeId);
      }
    };

    const selectNode = nodeId => {
      selectedNode.value = nodeId;
    };

    const expandAll = () => {
      const collectIds = nodes => {
        const ids = [];
        nodes.forEach(node => {
          ids.push(node.id);
          if (node.children && node.children.length > 0) {
            ids.push(...collectIds(node.children));
          }
        });
        return ids;
      };

      const allIds = collectIds(hierarchyData.value);
      expandedNodes.value = new Set(allIds);
    };

    const collapseAll = () => {
      expandedNodes.value.clear();
    }; // Drag and Drop functionality
    const handleMove = data => {
      if (data.type === 'drag-start') {
        isDragging.value = true;
        draggedNode.value = data.company;
      } else if (data.type === 'drag-end') {
        isDragging.value = false;
        draggedNode.value = null;
      } else if (data.type === 'drop') {
        if (data.draggedId && data.targetId !== data.draggedId) {
          // Prevent circular references
          if (!isDescendant(data.draggedId, data.targetId)) {
            moveCompany(data.draggedId, data.targetId);

            // Auto-expand the target node to show the moved company
            if (data.targetId) {
              expandedNodes.value.add(data.targetId);
            }
          }
        }
        isDragging.value = false;
        draggedNode.value = null;
      }
    }; // Helper function to check if a node is a descendant of another
    const isDescendant = (ancestorId, nodeId) => {
      const findNode = (nodes, id) => {
        for (const node of nodes) {
          if (node.id === id) return node;
          if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const checkDescendants = node => {
        if (!node.children) return false;
        for (const child of node.children) {
          if (child.id === nodeId) return true;
          if (checkDescendants(child)) return true;
        }
        return false;
      };

      const ancestorNode = findNode(hierarchyData.value, ancestorId);
      return ancestorNode ? checkDescendants(ancestorNode) : false;
    };

    onMounted(() => {
      // Expand root nodes by default
      hierarchyData.value.forEach(company => {
        expandedNodes.value.add(company.id);
      });
    });

    return {
      hierarchyData,
      expandedNodes,
      selectedNode,
      isDragging,
      toggleNode,
      selectNode,
      expandAll,
      collapseAll,
      handleMove,
    };
  },
};
</script>

<style scoped>
.drag-over {
  background-color: rgb(239 246 255);
  border-color: rgb(147 197 253);
}

.dark .drag-over {
  background-color: rgb(30 58 138);
  border-color: rgb(37 99 235);
}
</style>
