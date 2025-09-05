<script setup lang="ts">
import { ref } from 'vue';

import draggable from 'vuedraggable';
import TaskModal from '@/components/modals/Task.vue';

import type { BoardColumn } from '@/types/tasks';

const props = defineProps<{
	columns: BoardColumn[];
}>();

const emit = defineEmits(['updateBoard']);

// Track dragging state and current drop (hover) column index
const isDragging = ref(false);
const hoverColumnIndex = ref<number | null>(null);

const handleStart = () => {
	isDragging.value = true;
};

const handleEnd = () => {
	isDragging.value = false;
	hoverColumnIndex.value = null;
};

// evt.to is the container element of the target list being hovered.
const handleMove = (event: any) => {
	// Determine hovered column by DOM. The container (evt.to) sits inside our wrapper
	const toEl: HTMLElement | null = event?.to || null;

	if (!toEl) {
		hoverColumnIndex.value = null;

		return true;
	}
	const wrapper = toEl.closest('[data-col-index]') as HTMLElement | null;

	if (
		wrapper &&
		wrapper.dataset &&
		typeof wrapper.dataset.colIndex !== 'undefined'
	) {
		const idxParsed = parseInt(wrapper.dataset.colIndex as string, 10);

		hoverColumnIndex.value = Number.isNaN(idxParsed) ? null : idxParsed;
	} else {
		hoverColumnIndex.value = null;
	}

	return true; // allow move
};

const onBoardUpdate = () => {
	emit('updateBoard');
};
</script>

<template>
	<div
		class="flex h-full w-full overflow-x-auto overflow-y-hidden transform-3d"
	>
		<TaskModal :disabled="isDragging" @update-board="onBoardUpdate" />
		<div
			v-for="(column, colIndex) in props.columns"
			:key="column.title"
			:class="[
				'w-[200px] lg:w-[300px] flex-none px-3 py-3 mr-4 rounded-lg bg-gray-100',
				isDragging && hoverColumnIndex === colIndex && 'drop-target',
			]"
			:data-col-index="colIndex"
		>
			<p
				class="pb-2 mb-2 text-center font-semibold tracking-wide text-sm border-b-1"
			>
				{{ column.title }}
			</p>
			<draggable
				:list="column.tasks"
				item-key="id"
				:animation="200"
				ghost-class="ghost-card"
				chosen-class="drag-chosen"
				drag-class="drag-class"
				group="tasks"
				class="h-full"
				:empty-insert-threshold="30"
				:scroll="true"
				:scroll-sensitivity="60"
				:scroll-speed="10"
				:delay="100"
				:delay-on-touch-only="true"
				:touch-start-threshold="10"
				:move="handleMove"
				@start="handleStart"
				@end="handleEnd"
			>
				<template #item="{ element }">
					<div :key="element.id" class="mt-3">
						<TaskModal
							:task="element"
							:disabled="isDragging"
							@update-board="onBoardUpdate"
						/>
					</div>
				</template>
			</draggable>
		</div>
	</div>
</template>

<style scoped>
/*noinspection CssUnusedSymbol*/
.ghost-card {
	opacity: 0.5;
	background: #f7fafc;
	border: 1px solid #4299e1;
}

/* applied to the element being dragged */
/*noinspection CssUnusedSymbol*/
.drag-class {
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
	border-color: var(--primary);
	background: var(--card);
	opacity: 0.95;
}

/* applied when element is chosen (picked) but before moving */
/*noinspection CssUnusedSymbol*/
.drag-chosen {
	border-width: 1px;
	border-style: dashed;
	border-color: var(--primary);
	background: var(--muted);
}

/* highlight for the column currently targeted as drop destination */
/*noinspection CssUnusedSymbol*/
.drop-target {
	background: var(--accent);
	outline: 2px dashed var(--sidebar-ring);
	border-radius: 0.65rem;
	outline-offset: -4px;
	transition: background-color 120ms ease;
}
</style>
