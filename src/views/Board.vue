<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import KanbanBoard from '@/components/board/KanbanBoard.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';

import { getAllTasks } from '@/api/tasks';

import type { Task, BoardColumn } from '@/types/tasks';

const isLoading = ref(true);
const tasks = ref<Task[]>([]);

const columnsInitial: BoardColumn[] = [
	{
		title: 'Todo',
		id: 1,
		tasks: [],
		status: 'todo',
	},
	{
		title: 'In Progress',
		id: 2,
		tasks: [],
		status: 'in_progress',
	},
	{
		title: 'Review',
		id: 3,
		tasks: [],
		status: 'review',
	},
	{
		title: 'Done',
		id: 4,
		tasks: [],
		status: 'done',
	},
];

const columns = ref<BoardColumn[]>(
	columnsInitial.map((c) => ({ ...c, tasks: [] }))
);

onBeforeMount(async () => {
	await updateBoard();
});

const updateBoard = async () => {
	try {
		tasks.value = await getAllTasks();
		fillColumns();
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};

const fillColumns = () => {
	// Clear existing tasks in place to preserve array references and avoid flicker
	columns.value.forEach((col) => {
		col.tasks.length = 0;
	});

	// Refill tasks into their respective columns
	// First, group by column
	const byColumn = new Map<number, Task[]>();

	tasks.value.forEach((task: Task) => {
		const list = byColumn.get(task.column_id) || [];
		list.push(task);
		byColumn.set(task.column_id, list);
	});

	// For each column, sort by sort_index if present, then push
	columns.value.forEach((column) => {
		const list = byColumn.get(column.id) || [];

		list.sort((a, b) => {
			const ai = a.sort_index ?? Number.POSITIVE_INFINITY;
			const bi = b.sort_index ?? Number.POSITIVE_INFINITY;
			if (ai !== bi) return ai - bi;

			// fallback stable-ish ordering by title to avoid jitter when no indices
			return (a.title || '').localeCompare(b.title || '');
		});

		list.forEach((t) => column.tasks.push(t));
	});
};

const onBoardUpdate = async () => {
	await updateBoard();
};
</script>

<template>
	<section class="flex justify-center items-center p-4 h-full min-h-0">
		<Spinner v-if="isLoading" />
		<KanbanBoard v-else :columns="columns" @update-board="onBoardUpdate" />
	</section>
</template>
