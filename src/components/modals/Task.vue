<script setup lang="ts">
import { ref } from 'vue';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogDescription,
} from '@/components/ui/dialog';

import TaskDetails from '@/components/task-details/TaskDetails.vue';

import type { Task } from '@/types/Tasks.ts';

const props = defineProps<{
	task?: Task;
	disabled?: boolean;
	originalStatus?: string;
	isTaskCardVisible?: boolean;
}>();

const emit = defineEmits(['updateBoard']);

const isOpen = ref(false);

const onBoardUpdate = () => {
	isOpen.value = false;
	emit('updateBoard');
};

const open = () => {
	console.log('open');
	isOpen.value = true;
};

defineExpose({ open });

const onDialogClose = () => {
	isOpen.value = false;
};
</script>

<template>
	<Dialog v-model:open="isOpen">
		<slot />
		<DialogContent class="p-0 pt-4 md:min-w-[700px]" @open-auto-focus.prevent>
			<template v-show="false">
				<DialogTitle />
				<DialogDescription />
			</template>
			<TaskDetails
				:key="props.task?.id || 'new'"
				:task="props.task"
				:originalStatus="props.originalStatus"
				@close="onDialogClose"
				@update-board="onBoardUpdate"
			/>
		</DialogContent>
	</Dialog>
</template>

<style scoped></style>
