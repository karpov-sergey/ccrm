<script setup lang="ts">
import { onBeforeMount, ref, nextTick } from 'vue';

import { getAllTasks } from '@/api/tasks';

import Spinner from '@/components/ui/spinner/Spinner.vue';
import ScheduleCalendar from '@/components/schedule-calendar/ScheduleCalendar.vue';

import type { Task } from '@/types/Tasks.ts';
import TaskModal from '@/components/modals/Task.vue';

const isLoading = ref(true);
const tasks = ref<Task[]>([]);

const taskModalRef = ref<InstanceType<typeof TaskModal> | null>(null);
const selectedTask = ref<Task | undefined>(undefined);

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

const onEventClick = async (taskId: string) => {
	const task = tasks.value.find((task) => task.id === taskId);
	if (!task) {
		return;
	}

	selectedTask.value = task;

	await nextTick();

	taskModalRef.value?.open?.();
};
</script>

<template>
	<section
		class="p-4"
		:class="{ 'flex justify-center items-center h-full': isLoading }"
	>
		<Spinner v-if="isLoading" />
		<template v-else>
			<TaskModal
				ref="taskModalRef"
				:task="selectedTask"
				@update-board="fetchTasks"
			/>
			<ScheduleCalendar :tasks="tasks" @on-event-click="onEventClick" />
		</template>
	</section>
</template>
