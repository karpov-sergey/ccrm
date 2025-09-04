<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import Board from '@/components/board/Board.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';

import { getAllTasks } from '@/api/tasks';

import type { Task, BoardColumn } from '@/types/tasks';

const isLoading = ref(true);
const tasks = ref<Task[]>([]);
const columns = ref<BoardColumn[]>([
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
]);

onBeforeMount(async () => {
	try {
		tasks.value = await getAllTasks();
		fillColumns();
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
});

const fillColumns = () => {
	tasks.value.forEach((task: Task) => {
		const currentColumn = columns.value.find(
			(column) => column.id === task.column_id
		);

		currentColumn?.tasks.push(task);
	});
};
</script>

<template>
	<section class="flex items-center justify-center p-4 h-full min-h-0">
		<Spinner v-if="isLoading" />
		<Board v-else :columns="columns" />
	</section>
</template>
