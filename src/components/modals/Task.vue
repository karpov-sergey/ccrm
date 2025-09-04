<script setup lang="ts">
import { ref, defineProps } from 'vue';
import {
	AlertDialog,
	AlertDialogTitle,
	AlertDialogContent,
	AlertDialogTrigger,
	AlertDialogDescription,
} from '@/components/ui/alert-dialog';

import TaskDetails from '@/components/task-details/TaskDetails.vue';
import TaskCard from '@/components/board/TaskCard.vue';

import type { Task } from '@/types/tasks';

const props = defineProps<{
	task: Task;
}>();

const isOpen = ref(false);

const voidFocus = (event: Event) => {
	event.preventDefault();
};

const onDialogToggle = () => {
	isOpen.value = !isOpen.value;
};
</script>

<template>
	<AlertDialog v-model:open="isOpen">
		<AlertDialogTrigger as-child>
			<TaskCard :task="props.task" class="mt-3 cursor-pointer" />
		</AlertDialogTrigger>
		<AlertDialogContent
			class="p-0 max-h-[90dvh] min-w-[700px]"
			@open-auto-focus="voidFocus"
		>
			<template v-show="false">
				<AlertDialogTitle />
				<AlertDialogDescription />
			</template>
			<div class="py-6 overflow-y-auto">
				<TaskDetails :task="props.task" @close="onDialogToggle" />
			</div>
		</AlertDialogContent>
	</AlertDialog>
</template>

<style scoped></style>
