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

const props = defineProps<{
	element: any;
}>();

const isOpen = ref(false);

const voidFocus = (event: Event) => {
	event.preventDefault();
};

const onDialogToggle = () => {
	isOpen.value = !isOpen.value;
};
debugger;
</script>

<template>
	<AlertDialog :open="isOpen">
		<AlertDialogTrigger as-child>
			<TaskCard :task="props.element" class="mt-3 cursor-pointer" />
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
				<TaskDetails @close="onDialogToggle" />
			</div>
		</AlertDialogContent>
	</AlertDialog>
</template>

<style scoped></style>
