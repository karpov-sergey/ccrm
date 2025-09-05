<script setup lang="ts">
import type { Task } from '@/types/tasks';

defineProps<{
	task: Task;
}>();
</script>

<template>
	<div class="p-4 rounded-lg border border-transparent bg-white shadow">
		<div class="flex justify-between mb-2">
			<p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">
				{{ task.title }}
			</p>
		</div>
		<div class="flex justify-between items-center">
			<span class="text-sm text-gray-600">{{ task.status }}</span>
		</div>
	</div>
</template>
