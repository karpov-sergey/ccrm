<script setup lang="ts">
import type { Task } from '@/types/tasks';

defineProps<{
	task: Task;
}>();
</script>

<template>
	<div
		class="py-2 text-sm rounded-lg border border-transparent bg-white shadow"
	>
		<div class="flex justify-between mb-2 px-2 pb-2 border-b">
			<p class="font-semibold font-sans tracking-wide text-sm">
				{{ task.title }}
			</p>
		</div>
		<div class="flex justify-between items-center px-2">
			<span v-if="task.date" class="text-sm">
				{{
					new Date(task.date).toLocaleDateString(undefined, {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})
				}}
			</span>
		</div>
	</div>
</template>
