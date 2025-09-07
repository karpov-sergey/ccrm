<script setup lang="ts">
import {
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	useVueTable,
	type SortingState,
} from '@tanstack/vue-table';
import { ref } from 'vue';
import {
	Table,
	TableBody,
	TableCell,
	TableEmpty,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

type Props<T> = {
	columns: any[];
	data: T[];
	enableSearch?: boolean;
};

const props = defineProps<Props<any>>();

// состояния таблицы
const sorting = ref<SortingState>([]);
const globalFilter = ref('');

const table = useVueTable({
	data: props.data,
	columns: props.columns,
	state: {
		get sorting() {
			return sorting.value;
		},
		get globalFilter() {
			return globalFilter.value;
		},
	},
	onSortingChange: (updater) => {
		// updater can be a function or a value
		sorting.value =
			typeof updater === 'function' ? updater(sorting.value) : updater;
	},
	onGlobalFilterChange: (value) => {
		globalFilter.value = value as string;
	},
	getCoreRowModel: getCoreRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
});
</script>

<template>
	<div>
		<!-- Поиск -->
		<div v-if="props.enableSearch" class="mb-3">
			<input
				type="text"
				:value="globalFilter"
				@input="
					table.setGlobalFilter(($event.target as HTMLInputElement).value)
				"
				placeholder="Search..."
				class="w-full rounded border p-2"
			/>
		</div>

		<!-- Таблица -->
		<Table>
			<TableHeader>
				<TableRow
					v-for="headerGroup in table.getHeaderGroups()"
					:key="headerGroup.id"
				>
					<TableHead
						v-for="header in headerGroup.headers"
						:key="header.id"
						class="cursor-pointer"
						@click="header.column.getToggleSortingHandler()?.($event)"
					>
						{{
							typeof header.column.columnDef.header === 'function'
								? header.column.columnDef.header()
								: header.column.columnDef.header
						}}
						<span v-if="header.column.getIsSorted() === 'asc'">↑</span>
						<span v-else-if="header.column.getIsSorted() === 'desc'">↓</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<template v-if="table.getRowModel().rows.length">
					<TableRow v-for="row in table.getRowModel().rows" :key="row.id">
						<TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
							{{ cell.getValue?.() ?? cell.renderValue?.() }}
						</TableCell>
					</TableRow>
				</template>
				<TableEmpty v-else :colspan="table.getAllLeafColumns().length">
					No results.
				</TableEmpty>
			</TableBody>
		</Table>
	</div>
</template>
