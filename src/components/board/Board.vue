<script setup lang="ts">
import draggable from 'vuedraggable';
import TaskCard from '@/components/board/TaskCard.vue';
import { ref } from 'vue';

const columns = ref([
	{
		title: 'Backlog',
		tasks: [
			{
				id: 1,
				title: 'Add discount code to checkout page',
				date: 'Sep 14',
				type: 'Feature Request',
			},
			{
				id: 2,
				title: 'Provide documentation on integrations',
				date: 'Sep 12',
			},
			{
				id: 3,
				title: 'Design shopping cart dropdown',
				date: 'Sep 9',
				type: 'Design',
			},
			{
				id: 4,
				title: 'Add discount code to checkout page',
				date: 'Sep 14',
				type: 'Feature Request',
			},
			{
				id: 5,
				title: 'Test checkout flow',
				date: 'Sep 15',
				type: 'QA',
			},
		],
	},
	{
		title: 'In Progress',
		tasks: [
			{
				id: 6,
				title: 'Design shopping cart dropdown',
				date: 'Sep 9',
				type: 'Design',
			},
			{
				id: 7,
				title: 'Add discount code to checkout page',
				date: 'Sep 14',
				type: 'Feature Request',
			},
			{
				id: 8,
				title: 'Provide documentation on integrations',
				date: 'Sep 12',
				type: 'Backend',
			},
		],
	},
	{
		title: 'Review',
		tasks: [
			{
				id: 9,
				title: 'Provide documentation on integrations',
				date: 'Sep 12',
			},
			{
				id: 10,
				title: 'Design shopping cart dropdown',
				date: 'Sep 9',
				type: 'Design',
			},
			{
				id: 11,
				title: 'Add discount code to checkout page',
				date: 'Sep 14',
				type: 'Feature Request',
			},
			{
				id: 12,
				title: 'Design shopping cart dropdown',
				date: 'Sep 9',
				type: 'Design',
			},
			{
				id: 13,
				title: 'Add discount code to checkout page',
				date: 'Sep 14',
				type: 'Feature Request',
			},
		],
	},
	{
		title: 'Done',
		tasks: [
			{
				id: 14,
				title: 'Add discount code to checkout page',
				date: 'Sep 14',
				type: 'Feature Request',
			},
			{
				id: 15,
				title: 'Design shopping cart dropdown',
				date: 'Sep 9',
				type: 'Design',
			},
			{
				id: 16,
				title: 'Add discount code to checkout page',
				date: 'Sep 14',
				type: 'Feature Request',
			},
		],
	},
]);
</script>

<template>
	<div class="flex h-full w-full overflow-x-auto overflow-y-hidden">
		<div
			v-for="column in columns"
			:key="column.title"
			class="min-w-[320px] px-3 py-3 rounded mr-4 bg-gray-100"
		>
			<p class="text-gray-700 font-semibold tracking-wide text-sm">
				{{ column.title }}
			</p>
			<!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
			<draggable
				:list="column.tasks"
				item-key="id"
				:animation="200"
				ghost-class="ghost-card"
				chosen-class="drag-class"
				group="tasks"
				class="h-full"
				:empty-insert-threshold="30"
				:scroll="true"
				:scroll-sensitivity="60"
				:scroll-speed="10"
			>
				<template #item="{ element }">
					<TaskCard :task="element" class="mt-3 cursor-pointer" />
				</template>
			</draggable>
		</div>
	</div>
</template>

<style scoped>
/*noinspection CssUnusedSymbol*/
.ghost-card {
	opacity: 0.5;
	background: #f7fafc;
	border: 1px solid #4299e1;
}
</style>
