<template>
  <div
    class="company-tree-node"
    :class="{
      selected: selectedNode === company.id,
      'drag-over': isDragOver,
    }"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- Node Content -->
    <div
      :style="{ paddingLeft: `${level * 24}px` }"
      class="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group cursor-pointer"
      :draggable="true"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      @click="selectNode"
    >
      <!-- Expand/Collapse Button -->
      <button
        v-if="hasChildren"
        @click.stop="toggleExpand"
        class="flex-shrink-0 w-5 h-5 mr-2 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <svg
          class="w-4 h-4 transform transition-transform duration-200"
          :class="{ 'rotate-90': isExpanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>

      <!-- Spacer for nodes without children -->
      <div v-else class="w-5 h-5 mr-2 flex-shrink-0"></div>

      <!-- Company Icon -->
      <div
        class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3"
        :class="getCompanyIconColor(company)"
      >
        <span class="text-white font-medium text-sm">{{
          company.name.charAt(0)
        }}</span>
      </div>

      <!-- Company Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2">
          <h3
            class="text-sm font-medium text-gray-900 dark:text-white truncate"
          >
            {{ company.name }}
          </h3>
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-medium',
              company.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            ]"
          >
            {{ company.status }}
          </span>
        </div>
        <div
          class="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400"
        >
          <span>{{ company.employeeCount || 0 }} employees</span>
          <span>{{ company.departments || 0 }} departments</span>
          <span v-if="company.code" class="font-mono">{{ company.code }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex-shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <button
          @click.stop="editCompany"
          class="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors duration-200"
          title="Edit Company"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
        </button>
        <button
          @click.stop="deleteCompany"
          class="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors duration-200"
          title="Delete Company"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
        <button
          class="p-1.5 text-gray-400 hover:text-green-600 rounded transition-colors duration-200"
          title="Drag to move"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Children Nodes -->
    <div v-if="hasChildren && isExpanded" class="mt-1">
      <CompanyTreeNode
        v-for="child in company.children"
        :key="child.id"
        :company="child"
        :level="level + 1"
        :expanded-nodes="expandedNodes"
        :selected-node="selectedNode"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @move="$emit('move', $event)"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'CompanyTreeNode',
  props: {
    company: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
    expandedNodes: {
      type: Set,
      required: true,
    },
    selectedNode: {
      type: [String, Number],
      default: null,
    },
  },
  emits: ['toggle', 'select', 'edit', 'delete', 'move'],
  setup(props, { emit }) {
    const isDragOver = ref(false);

    const hasChildren = computed(() => {
      return props.company.children && props.company.children.length > 0;
    });

    const isExpanded = computed(() => {
      return props.expandedNodes.has(props.company.id);
    });

    const toggleExpand = () => {
      emit('toggle', props.company.id);
    };

    const selectNode = () => {
      emit('select', props.company.id);
    };

    const editCompany = () => {
      emit('edit', props.company);
    };

    const deleteCompany = () => {
      if (hasChildren.value) {
        if (
          confirm(
            `Company "${props.company.name}" has child companies. Are you sure you want to delete it? This will also delete all child companies.`
          )
        ) {
          emit('delete', props.company.id);
        }
      } else {
        if (
          confirm(`Are you sure you want to delete "${props.company.name}"?`)
        ) {
          emit('delete', props.company.id);
        }
      }
    };

    // Drag and Drop handlers
    const handleDragStart = event => {
      event.dataTransfer.setData('text/plain', props.company.id);
      event.dataTransfer.effectAllowed = 'move';

      // Add drag styling
      event.target.style.opacity = '0.5';

      emit('move', {
        type: 'drag-start',
        company: props.company,
      });
    };

    const handleDragEnd = event => {
      event.target.style.opacity = '';
      emit('move', {
        type: 'drag-end',
        company: props.company,
      });
    };

    const handleDragOver = event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      isDragOver.value = true;
    };

    const handleDragLeave = () => {
      isDragOver.value = false;
    };

    const handleDrop = event => {
      event.preventDefault();
      isDragOver.value = false;

      const draggedId = event.dataTransfer.getData('text/plain');
      if (draggedId && draggedId !== props.company.id.toString()) {
        emit('move', {
          type: 'drop',
          draggedId: parseInt(draggedId),
          targetId: props.company.id,
        });
      }
    };

    // Generate consistent colors for company icons
    const getCompanyIconColor = company => {
      const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-red-500',
        'bg-yellow-500',
        'bg-indigo-500',
        'bg-pink-500',
        'bg-gray-500',
      ];

      // Use company ID to get consistent color
      const colorIndex = company.id % colors.length;
      return colors[colorIndex];
    };

    return {
      isDragOver,
      hasChildren,
      isExpanded,
      toggleExpand,
      selectNode,
      editCompany,
      deleteCompany,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      getCompanyIconColor,
    };
  },
};
</script>

<style scoped>
.company-tree-node {
  position: relative;
}

.selected {
  background-color: rgb(219 234 254);
}

.dark .selected {
  background-color: rgb(30 58 138);
}

.drag-over {
  background-color: rgb(147 197 253);
  border: 2px dashed rgb(59 130 246);
  border-radius: 0.5rem;
}

.dark .drag-over {
  background-color: rgb(30 64 175);
  border-color: rgb(96 165 250);
}

/* Dragging styles */
.company-tree-node[draggable='true']:hover {
  cursor: grab;
}

.company-tree-node[draggable='true']:active {
  cursor: grabbing;
}
</style>
