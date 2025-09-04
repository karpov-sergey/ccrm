<script setup lang="ts">
import { ref } from 'vue';
import {
	AlertDialog,
	AlertDialogTitle,
	AlertDialogContent,
	AlertDialogTrigger,
	AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import TaskDetails from '@/components/task-details/TaskDetails.vue';

const isOpen = ref(true);

const voidFocus = (event: Event) => {
	event.preventDefault();
};

const onDialogToggle = () => {
	isOpen.value = !isOpen.value;
};
</script>

<template>
	<AlertDialog :default-open="true" :open="isOpen">
		<AlertDialogTrigger as-child>
			<Button variant="outline" @click="onDialogToggle"> Open Task </Button>
		</AlertDialogTrigger>
		<AlertDialogContent
			class="p-0 max-h-[90dvh] min-w-[700px]"
			@open-auto-focus="voidFocus"
		>
			<template v-show="false">
				<AlertDialogTitle />
				<AlertDialogDescription />
			</template>
			<div class="pt-3 pb-6 px-10 overflow-y-auto">
				<TaskDetails @close="onDialogToggle" />
			</div>
		</AlertDialogContent>
	</AlertDialog>
</template>

<style scoped></style>
