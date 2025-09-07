<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDebounceFn } from '@vueuse/core';

import {
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	useVueTable,
	type SortingState,
} from '@tanstack/vue-table';
import {
	Table,
	TableBody,
	TableCell,
	TableEmpty,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

import { Trash2 } from 'lucide-vue-next';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';

type Props<T> = {
	columns: any[];
	data: T[];
	enableSearch?: boolean;
};

const { t } = useI18n();

const props = defineProps<Props<any>>();

const sorting = ref<SortingState>([]);
const globalFilter = ref('');

// Local safe renderer similar to flexRender
const renderDef = (def: unknown, ctx: unknown) =>
	typeof def === 'function' ? (def as (ctx: unknown) => unknown)(ctx) : def;

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

const debouncedSetGlobalFilter = useDebounceFn((val: string | number) => {
	table.setGlobalFilter(String(val));
}, 150);

const setFilter = (value: string | number) => {
	debouncedSetGlobalFilter(value);
};

const onRemoveSubmit = () => {
	console.log('onRemoveSubmit');
};
</script>

<template>
	<div>
		<div
			v-if="props.enableSearch"
			class="flex items-center justify-between mb-3"
		>
			<Input
				class="w-[150px]"
				placeholder="Search..."
				:modelValue="globalFilter"
				@update:modelValue="setFilter"
			/>

			<ConfirmModal
				:title="t('are_you_sure_you_want_to_delete_this_contact')"
				@confirm="onRemoveSubmit"
			>
				<Button
					class="text-destructive"
					type="button"
					variant="link"
					:disabled="true"
				>
					<Trash2 class="h-4 w-4" />
					{{ t('delete') }}
				</Button>
			</ConfirmModal>
		</div>

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
						{{ renderDef(header.column.columnDef.header, header.getContext()) }}
						<span v-if="header.column.getIsSorted() === 'asc'">↑</span>
						<span v-else-if="header.column.getIsSorted() === 'desc'">↓</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<template v-if="table.getRowModel().rows.length">
					<TableRow v-for="row in table.getRowModel().rows" :key="row.id">
						<TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
							{{ renderDef(cell.column.columnDef.cell, cell.getContext()) }}
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
