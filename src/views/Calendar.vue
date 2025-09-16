<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { getAllTasks } from '@/api/tasks';

import Spinner from '@/components/ui/spinner/Spinner.vue';
import ScheduleCalendar from '@/components/schedule-calendar/ScheduleCalendar.vue';

import type { Task } from '@/types/Tasks.ts';
import TaskModal from '@/components/modals/Task.vue';

const isLoading = ref(true);
const tasks = ref<Task[]>([]);

onBeforeMount(async () => {
	await fetchTasks();
});

const fetchTasks = async () => {
	isLoading.value = true;

	try {
		tasks.value = await getAllTasks();
	} catch (error) {
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<section
		class="p-4"
		:class="{ 'flex justify-center items-center h-full': isLoading }"
	>
		<Spinner v-if="isLoading" />
		<template v-else>
			<TaskModal @update-board="fetchTasks" />
			<ScheduleCalendar :tasks="tasks" />
		</template>
	</section>
</template>
