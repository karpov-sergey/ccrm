<!--<template>-->
<!--	<div class="p-4">-->
<!--		<div class="mb-4 flex gap-2">-->
<!--			<button @click="addColumn" class="px-3 py-1 border rounded">-->
<!--				Add column-->
<!--			</button>-->
<!--			<button @click="logState" class="px-3 py-1 border rounded">-->
<!--				Log state-->
<!--			</button>-->
<!--		</div>-->

<!--		<div class="flex gap-4 items-start">-->
<!--			<div-->
<!--				v-for="col in columns"-->
<!--				:key="col.id"-->
<!--				class="w-64 p-2 border rounded bg-gray-50"-->
<!--			>-->
<!--				<div class="flex justify-between items-center mb-2">-->
<!--					<h3 class="font-bold">{{ col.title }}</h3>-->
<!--					<button @click="removeColumn(col.id)" title="Remove" class="text-sm">-->
<!--						✕-->
<!--					</button>-->
<!--				</div>-->

<!--				&lt;!&ndash; vuedraggable &ndash;&gt;-->
<!--				<draggable-->
<!--					v-model="col.items"-->
<!--					:group="{ name: 'kanban', pull: true, put: true }"-->
<!--					item-key="id"-->
<!--					@end="onDragEnd"-->
<!--					class="min-h-[40px] space-y-2"-->
<!--				>-->
<!--					<template #item="{ element }">-->
<!--						<div-->
<!--							:key="element.id"-->
<!--							class="p-2 bg-amber-100 border rounded cursor-move"-->
<!--						>-->
<!--							{{ element.text }}-->
<!--						</div>-->
<!--					</template>-->
<!--				</draggable>-->
<!--			</div>-->
<!--		</div>-->
<!--	</div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref } from 'vue';-->
<!--import draggable from 'vuedraggable'; // default export-->

<!--// простой глобальный uid — гарантирует уникальные id-->
<!--let uid = 0;-->
<!--const nextId = () => (++uid).toString();-->

<!--function makeItems(arr) {-->
<!--	return arr.map((t) => ({ id: nextId(), text: t }));-->
<!--}-->

<!--const columns = ref([-->
<!--	{-->
<!--		id: 'c1',-->
<!--		title: 'Todo',-->
<!--		items: makeItems([-->
<!--			'Schedule perm',-->
<!--			'Rewind VHS tapes',-->
<!--			'Make change for the arcade',-->
<!--			'Get disposable camera developed',-->
<!--			'Learn C++',-->
<!--			'Return Nintendo Power Glove',-->
<!--		]),-->
<!--	},-->
<!--	{ id: 'c2', title: 'In Progress', items: makeItems(['Refactor codebase']) },-->
<!--	{-->
<!--		id: 'c3',-->
<!--		title: 'Done',-->
<!--		items: makeItems(['Pickup new mix-tape from Beth']),-->
<!--	},-->
<!--]);-->

<!--function addColumn() {-->
<!--	columns.value.push({ id: 'c' + nextId(), title: 'New column', items: [] });-->
<!--}-->
<!--function removeColumn(id) {-->
<!--	columns.value = columns.value.filter((c) => c.id !== id);-->
<!--}-->
<!--function logState() {-->
<!--	console.log(JSON.parse(JSON.stringify(columns.value)));-->
<!--}-->
<!--function onDragEnd(evt) {-->
<!--	// полезная отладочная инфа: откуда/куда и индексы-->
<!--	console.log('drag end', {-->
<!--		from: evt.from?.dataset?.columnId || evt.from,-->
<!--		to: evt.to?.dataset?.columnId || evt.to,-->
<!--		oldIndex: evt.oldIndex,-->
<!--		newIndex: evt.newIndex,-->
<!--		item: evt.item,-->
<!--	});-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--/* минимально — чтобы видно было что draggable работает */-->
<!--.cursor-move {-->
<!--	cursor: move;-->
<!--}-->
<!--</style>-->

<template>
	<div class="flex justify-center">
		<div class="flex overflow-x-scroll">
			<div
				v-for="column in columns"
				:key="column.title"
				class="bg-gray-100 rounded-lg px-3 py-3 column-width rounded mr-4"
			>
				<p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">
					{{ column.title }}
				</p>
				<!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
				<draggable
					:list="column.tasks"
					:item-key="column.title"
					:sort="false"
					:animation="200"
					@change="log"
					ghost-class="ghost-card"
					group="tasks"
				>
					<!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->

					<template #item v-for="task in column.tasks" :key="task.id">
						<TaskCard
							:key="task.id"
							:task="task"
							class="mt-3 cursor-move"
						></TaskCard>
					</template>
					<!-- </transition-group> -->
				</draggable>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import TaskCard from '@/components/board/TaskCard.vue';

const log = (log: any) => {
	console.log(log);
};

const columns = [
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
];
</script>

<style scoped>
.column-width {
	min-width: 320px;
	width: 320px;
}
/* Unfortunately @apply cannot be setup in codesandbox,
but you'd use "@apply border opacity-50 border-blue-500 bg-gray-200" here */
.ghost-card {
	opacity: 0.5;
	background: #f7fafc;
	border: 1px solid #4299e1;
}
</style>
