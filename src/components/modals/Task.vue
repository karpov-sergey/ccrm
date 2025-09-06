<script setup lang="ts">
import { ref } from 'vue';

import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogTitle,
	AlertDialogContent,
	AlertDialogDescription,
} from '@/components/ui/alert-dialog';

import TaskDetails from '@/components/task-details/TaskDetails.vue';
import TaskCard from '@/components/board/TaskCard.vue';

import { Plus } from 'lucide-vue-next';

import type { Task } from '@/types/tasks';

const props = defineProps<{
	task?: Task;
	disabled?: boolean;
	originalStatus?: string;
}>();

const emit = defineEmits(['updateBoard']);

const isOpen = ref(false);

const voidFocus = (event: Event) => {
	event.preventDefault();
};

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
	<AlertDialog v-model:open="isOpen">
		<TaskCard
			v-if="props.task?.id"
			:task="props.task"
			:class="{ 'cursor-pointer': !props.disabled }"
			@click="onOpenClick"
		/>
		<Button v-else type="button" size="sm" @click="onOpenClick">
			<Plus class="h-4 w-4" />
		</Button>
		<AlertDialogContent
			class="min-w-full p-0 max-h-[90dvh] md:min-w-[700px] overflow-hidden"
			@open-auto-focus="voidFocus"
		>
			<template v-show="false">
				<AlertDialogTitle />
				<AlertDialogDescription />
			</template>
			<div class="py-6 overflow-y-auto max-h-[90dvh]">
				<TaskDetails
					:task="props.task"
					:originalStatus="props.originalStatus"
					@close="onDialogToggle"
					@update-board="onBoardUpdate"
				/>
			</div>
		</AlertDialogContent>
	</AlertDialog>
</template>

<style scoped></style>
