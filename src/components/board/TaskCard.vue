<script setup lang="ts">
import type { Task } from '@/types/tasks';

defineProps<{
	task: Task;
}>();
</script>

<template>
	<div class="bg-white shadow rounded px-3 pt-3 pb-5 border border-white">
		<div class="flex justify-between">
			<p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">
				{{ task.title }}
			</p>
		</div>
		<div class="flex mt-4 justify-between items-center">
			<span class="text-sm text-gray-600">{{ task.date }}</span>
		</div>
	</div>
</template>
