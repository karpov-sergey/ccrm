<script setup lang="ts">
import { ref } from 'vue';

import draggable from 'vuedraggable';
import TaskModal from '@/components/modals/Task.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/board/TaskCard.vue';

import { updateTask } from '@/api/tasks';

import { Plus } from 'lucide-vue-next';

import type { BoardColumn, Task, TaskStatus } from '@/types/Tasks.ts';

const props = defineProps<{
	columns: BoardColumn[];
}>();

const emit = defineEmits(['updateBoard']);

// Track dragging state and current drop (hover) column index
const isDragging = ref(false);
const hoverColumnIndex = ref<number | null>(null);

const addNewTaskRef = ref<any>(null);
const editTaskRef = ref<any>(null);

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

// Map fixed column ids to status values (kept in sync with TaskDetails.vue)
const getStatusByColumnId = (columnId: number): TaskStatus => {
	switch (columnId) {
		case 1:
			return 'todo';
		case 2:
			return 'in_progress';
		case 3:
			return 'review';
		case 4:
			return 'done';
		default:
			return 'todo';
	}
};

const onListChange = async (column: BoardColumn, event: any) => {
	// Reorder within same column
	if (event?.moved) {
		// After vuedraggable updates the list, column.tasks reflects new order
		// Persist new order: assign incremental sort_index starting from 0
		try {
			await Promise.all(
				(column.tasks || []).map((t: Task, idx: number) =>
					updateTask({ id: t.id, sort_index: idx })
				)
			);
		} catch (e) {
			console.error('Failed to persist order within column:', e);
		} finally {
			// No need to refetch immediately; but keep consistent behavior
			onBoardUpdate();
		}

		return;
	}

	if (event?.added) {
		const task: Task = event.added.element;
		if (!task?.id) return;

		const nextStatus: TaskStatus = getStatusByColumnId(column.id);
		const newIndex: number = event.added.newIndex ?? 0;

		try {
			await updateTask({
				id: task.id,
				status: nextStatus,
				column_id: column.id,
				sort_index: newIndex,
			});

			await Promise.all(
				column.tasks.map((task: Task, index: number) =>
					updateTask({ id: task.id, sort_index: index })
				)
			);
		} catch (error) {
			console.error('Failed to update task after cross-column drag:', error);
		} finally {
			onBoardUpdate();
		}
	}
};

const onTaskOpenClick = async () => {
	editTaskRef.value?.open?.();
};

const onNewTaskOpenClick = async () => {
	addNewTaskRef.value?.open?.();
};
</script>

<template>
	<div class="h-full w-full min-h-0 flex flex-col">
		<div
			class="flex-1 flex w-full overflow-x-auto transform-3d min-h-0 items-stretch"
		>
			<div
				v-for="(column, colIndex) in props.columns"
				:key="column.title"
				:class="[
					'w-[200px] lg:w-[300px] flex-none px-3 py-3 mr-4 rounded-lg bg-sidebar border h-full flex flex-col min-h-0',
					isDragging && hoverColumnIndex === colIndex && 'drop-target',
				]"
				:data-col-index="colIndex"
			>
				<div
					class="flex items-center justify-between gap-2 pb-2 mb-2 font-semibold tracking-wide text-sm border-b-1"
				>
					<div class="flex gap-2">
						{{ column.title }}
						<Badge variant="outline">{{ column.tasks.length }}</Badge>
					</div>

					<TaskModal
						:originalStatus="column.status"
						@update-board="onBoardUpdate"
					>
						<Button
							type="button"
							size="sm"
							ref="addNewTaskRef"
							@click="onNewTaskOpenClick"
						>
							<Plus class="h-4 w-4" />
						</Button>
					</TaskModal>
				</div>
				<draggable
					:list="column.tasks"
					item-key="id"
					:animation="200"
					ghost-class="ghost-card"
					chosen-class="drag-chosen"
					drag-class="drag-class"
					group="tasks"
					class="flex-1 min-h-0"
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
					@change="onListChange(column, $event)"
				>
					<template #item="{ element }">
						<div :key="element.id" class="mt-3">
							<TaskModal
								:task="element"
								:disabled="isDragging"
								:is-task-card-visible="true"
								@update-board="onBoardUpdate"
							>
								<TaskCard
									ref="editTaskRef"
									:class="{ 'cursor-pointer': !isDragging }"
									:task="element"
									:disabled="isDragging"
									@click="onTaskOpenClick"
								/>
							</TaskModal>
						</div>
					</template>
				</draggable>
			</div>
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
