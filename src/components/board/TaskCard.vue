<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';

import { Badge } from '@/components/ui/badge';

import { useDueDateVariant } from '@/composables/dateStatus.ts';

import { TimerReset, CheckCheck } from 'lucide-vue-next';

import type { Task } from '@/types/tasks';

const props = defineProps<{
	task: Task;
}>();

const { dueDateBadgeVariant } = useDueDateVariant();

const taskChecklistProgress = computed(() => {
	const total = props.task.checklist?.length;
	const done = props.task.checklist?.filter((item) => item.completed).length;

	return { done, total };
});

const isAllTaskCheckboxItemsChecked = computed(() => {
	return taskChecklistProgress.value.done === taskChecklistProgress.value.total;
});
</script>

<template>
	<div class="p-2 text-sm rounded-lg border border-transparent bg-white shadow">
		<div class="mb-2 font-semibold font-sans tracking-wide text-sm">
			{{ task.title }}
		</div>
		<div class="flex gap-2 items-center">
			<Badge
				v-if="task.checklist?.length"
				variant="outline"
				class="flex gap-1 items-center text-xs"
			>
				<CheckCheck
					class="size-4"
					:class="{
						'text-primary': isAllTaskCheckboxItemsChecked,
					}"
				/>
				{{ taskChecklistProgress.done }} / {{ taskChecklistProgress.total }}
			</Badge>
			<Badge
				v-if="task.date"
				:variant="dueDateBadgeVariant(task.date)"
				class="flex gap-1 text-xs"
			>
				<TimerReset class="size-4" />
				{{ dayjs(task.date).format('MMM DD') }}
			</Badge>
		</div>
	</div>
</template>
