<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import Board from '@/components/board/Board.vue';
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
	},
	{
		title: 'In Progress',
		id: 2,
		tasks: [],
	},
	{
		title: 'Review',
		id: 3,
		tasks: [],
	},
	{
		title: 'Done',
		id: 4,
		tasks: [],
	},
];

const columns = ref<BoardColumn[]>(
	columnsInitial.map((c) => ({ ...c, tasks: [] }))
);

onBeforeMount(async () => {
	await updateBoard();
});

const updateBoard = async () => {
	// Reset columns from the initial template, ensuring fresh task arrays
	columns.value = columnsInitial.map((c) => ({ ...c, tasks: [] }));

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
	tasks.value.forEach((task: Task) => {
		const currentColumn = columns.value.find(
			(column) => column.id === task.column_id
		);

		currentColumn?.tasks.push(task);
	});
};

const onBoardUpdate = async () => {
	await updateBoard();
};
</script>

<template>
	<section class="flex items-center justify-center p-4 h-full min-h-0">
		<Spinner v-if="isLoading" />
		<Board v-else :columns="columns" @update-board="onBoardUpdate" />
	</section>
</template>
