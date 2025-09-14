<script setup lang="ts">
import { ref } from 'vue';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogDescription,
} from '@/components/ui/dialog';

import TaskDetails from '@/components/task-details/TaskDetails.vue';
import TaskCard from '@/components/board/TaskCard.vue';

import { Plus } from 'lucide-vue-next';

import type { Task } from '@/types/Tasks.ts';

const props = defineProps<{
	task?: Task;
	disabled?: boolean;
	originalStatus?: string;
}>();

const emit = defineEmits(['updateBoard']);

const isOpen = ref(false);

const onDialogToggle = () => {
	isOpen.value = !isOpen.value;
};

const onBoardUpdate = () => {
	isOpen.value = false;
	emit('updateBoard');
};

const onOpenClick = () => {
	if (!props.disabled) {
		isOpen.value = true;
	}
};
</script>

<template>
	<Dialog v-model:open="isOpen">
		<TaskCard
			v-if="props.task?.id"
			:task="props.task"
			:class="{ 'cursor-pointer': !props.disabled }"
			@click="onOpenClick"
		/>
		<Button v-else type="button" size="sm" @click="onOpenClick">
			<Plus class="h-4 w-4" />
		</Button>
		<DialogContent class="p-0 pt-4 md:min-w-[700px]" @open-auto-focus.prevent>
			<template v-show="false">
				<DialogTitle />
				<DialogDescription />
			</template>
			<TaskDetails
				:key="props.task?.id || 'new'"
				:task="props.task"
				:originalStatus="props.originalStatus"
				@close="onDialogToggle"
				@update-board="onBoardUpdate"
			/>
		</DialogContent>
	</Dialog>
</template>

<style scoped></style>
