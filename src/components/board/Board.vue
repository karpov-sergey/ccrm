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

// Track dragging state and current drop (hover) column index
const isDragging = ref(false);
const hoverColumnIndex = ref<number | null>(null);

function handleStart() {
	isDragging.value = true;
}
function handleEnd() {
	isDragging.value = false;
	hoverColumnIndex.value = null;
}
// evt.to is the container element of the target list being hovered.
function handleMove(evt: any) {
	// Determine hovered column by DOM. The container (evt.to) sits inside our wrapper
	const toEl: HTMLElement | null = evt?.to || null;
	if (!toEl) {
		hoverColumnIndex.value = null;
		return true;
	}
	const wrapper = toEl.closest('[data-col-index]') as HTMLElement | null;
	if (
		wrapper &&
		wrapper.dataset &&
		typeof wrapper.dataset.colIndex !== 'undefined'
	) {
		const idxParsed = parseInt(wrapper.dataset.colIndex as string, 10);
		hoverColumnIndex.value = Number.isNaN(idxParsed) ? null : idxParsed;
	} else {
		hoverColumnIndex.value = null;
	}
	return true; // allow move
}
</script>

<template>
	<div class="flex h-full w-full overflow-x-auto overflow-y-hidden">
		<div
			v-for="(column, colIndex) in columns"
			:key="column.title"
			:class="[
				'w-[200px] lg:w-[300px] flex-none px-3 py-3 rounded mr-4 bg-gray-100',
				isDragging && hoverColumnIndex === colIndex && 'drop-target',
			]"
			:data-col-index="colIndex"
		>
			<p class="text-gray-700 font-semibold tracking-wide text-sm">
				{{ column.title }}
			</p>
			<draggable
				:list="column.tasks"
				item-key="id"
				:animation="200"
				ghost-class="ghost-card"
				chosen-class="drag-chosen"
				drag-class="drag-class"
				group="tasks"
				class="h-full"
				:empty-insert-threshold="30"
				:scroll="true"
				:scroll-sensitivity="60"
				:scroll-speed="10"
				:delay="100"
				:delay-on-touch-only="true"
				:touch-start-threshold="10"
				:move="handleMove"
				@start="handleStart"
				@end="handleEnd"
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

/* applied to the element being dragged */
/*noinspection CssUnusedSymbol*/
.drag-class {
	transform: scale(0.98);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
	border: 1px solid #6366f1; /* indigo-500 */
	background: #eef2ff; /* indigo-100 */
	opacity: 0.9;
}

/* applied when element is chosen (picked) but before moving */
/*noinspection CssUnusedSymbol*/
.drag-chosen {
	border: 1px dashed #6366f1;
	background: #f5f7ff;
}

/* highlight for the column currently targeted as drop destination */
/*noinspection CssUnusedSymbol*/
.drop-target {
	background: #e0f2fe; /* sky-100 */
	outline: 2px dashed #0284c7; /* sky-600 */
	outline-offset: -4px;
	transition: background-color 120ms ease;
}
</style>
