<script setup lang="ts">
import { ref, computed, watch, type VNodeChild } from 'vue';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';
import Name from './items/Name.vue';
import Phones from './items/Phones.vue';
import Email from './items/Email.vue';

import { Plus, Trash2 } from 'lucide-vue-next';

import type {
	Header,
	Cell,
	HeaderContext,
	CellContext,
	ColumnDef,
	Row,
} from '@tanstack/vue-table';

interface DataTableProps {
	columns: ColumnDef<any, any>[];
	data: any[];
	enableSearch?: boolean;
	removeConfirmTitle?: string;
}

const { t } = useI18n();

const props = defineProps<DataTableProps>();

const emit = defineEmits(['delete-contacts', 'row-click', 'add-click']);

const sorting = ref<SortingState>([]);
const globalFilter = ref('');
const inputValue = ref('');
const rowSelection = ref<Record<string, boolean>>({});

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
		get rowSelection() {
			return rowSelection.value;
		},
	},
	onSortingChange: (updater) => {
		sorting.value =
			typeof updater === 'function' ? updater(sorting.value) : updater;
	},
	onGlobalFilterChange: (value) => {
		globalFilter.value = value as string;
	},
	onRowSelectionChange: (updater) => {
		rowSelection.value =
			typeof updater === 'function' ? updater(rowSelection.value) : updater;
	},
	getCoreRowModel: getCoreRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
});

type Renderable<RowData, TValue> =
	| VNodeChild
	| ((
			ctx: HeaderContext<RowData, TValue> | CellContext<RowData, TValue>
	  ) => VNodeChild);

const renderDefinition = <RowData, TValue>(
	definition: Renderable<RowData, TValue>,
	context: HeaderContext<RowData, TValue> | CellContext<RowData, TValue>
): VNodeChild => {
	return typeof definition === 'function'
		? (
				definition as (
					ctx: HeaderContext<RowData, TValue> | CellContext<RowData, TValue>
				) => VNodeChild
			)(context)
		: definition;
};

const onHeaderClick = <RowData, TValue>(
	header: Header<RowData, TValue>,
	event: MouseEvent
): void => {
	header.column.getToggleSortingHandler()?.(event);
};

const renderHeader = <RowData, TValue>(
	header: Header<RowData, TValue>
): VNodeChild => {
	return renderDefinition<RowData, TValue>(
		header.column.columnDef.header as Renderable<RowData, TValue>,
		header.getContext() as HeaderContext<RowData, TValue>
	);
};

const renderCell = <RowData, TValue>(
	cell: Cell<RowData, TValue>
): VNodeChild => {
	return renderDefinition<RowData, TValue>(
		cell.column.columnDef.cell as Renderable<RowData, TValue>,
		cell.getContext() as CellContext<RowData, TValue>
	);
};

const headerCheckboxState = computed<boolean | 'indeterminate'>(() => {
	return table.getIsAllPageRowsSelected()
		? true
		: table.getIsSomePageRowsSelected()
			? 'indeterminate'
			: false;
});

const onToggleAllSelection = (value: boolean | 'indeterminate'): void => {
	table.toggleAllPageRowsSelected(!!value);
};

const rowIsSelected = <RowData,>(row: Row<RowData>): boolean => {
	return row.getIsSelected();
};

const onToggleRowSelection = <RowData,>(
	row: Row<RowData>,
	value: boolean | 'indeterminate'
): void => {
	row.toggleSelected(!!value);
};

const applyGlobalFilter = useDebounceFn((value: string | number) => {
	table.setGlobalFilter(String(value));
}, 200);

const onInputChange = (value: string | number): void => {
	inputValue.value = String(value ?? '');
};

const onRemoveSubmit = () => {
	const ids = table.getSelectedRowModel().rows.map((row) => row.original.id);

	emit('delete-contacts', ids);
};

const selectedRows = computed(() => {
	return table.getSelectedRowModel().rows.length;
});

const onAddClick = () => {
	emit('add-click');
};

watch(inputValue, (newValue) => applyGlobalFilter(newValue));
watch(globalFilter, (newValue) => {
	if (newValue !== inputValue.value) inputValue.value = newValue ?? '';
});
</script>

<template>
	<div
		class="flex flex-col items-center gap-4 mb-4 md:flex-row md:justify-between"
	>
		<Button
			class="w-full flex gap-2 items-center md:w-auto"
			@click="onAddClick"
		>
			<Plus class="w-4 h-4" />
			{{ t('add_new_contact') }}
		</Button>
		<div class="w-full flex flex-col items-center gap-4 md:flex-row md:w-auto">
			<Input
				v-if="props.enableSearch"
				class="w-full md:w-[220px]"
				placeholder="Search..."
				:modelValue="inputValue"
				@update:modelValue="onInputChange"
			/>
			<ConfirmModal
				:title="
					removeConfirmTitle || t('are_you_sure_you_want_to_delete_this_item')
				"
				@confirm="onRemoveSubmit"
			>
				<Button
					class="w-full text-destructive md:w-auto"
					type="button"
					variant="link"
					:disabled="!selectedRows"
				>
					<Trash2 class="h-4 w-4" />
					{{ t('delete') }}
				</Button>
			</ConfirmModal>
		</div>
	</div>
	<div class="rounded-lg border">
		<Table>
			<TableHeader>
				<TableRow
					v-for="headerGroup in table.getHeaderGroups()"
					:key="headerGroup.id"
				>
					<TableHead>
						<Checkbox
							:modelValue="headerCheckboxState"
							@update:modelValue="onToggleAllSelection"
						/>
					</TableHead>
					<TableHead
						v-for="header in headerGroup.headers"
						:key="header.id"
						class="cursor-pointer"
						@click="onHeaderClick(header, $event)"
					>
						{{ renderHeader(header) }}
						<span v-if="header.column.getIsSorted() === 'asc'">↑</span>
						<span v-else-if="header.column.getIsSorted() === 'desc'">↓</span>
						<span v-else></span>
					</TableHead>

					<!-- Extra actions column header (non-sortable) -->
					<!--					<TableHead>-->
					<!--						<slot name="row-actions-header" />-->
					<!--					</TableHead>-->
				</TableRow>
			</TableHeader>
			<TableBody>
				<template v-if="table.getRowModel().rows.length">
					<TableRow
						v-for="row in table.getRowModel().rows"
						class="cursor-pointer"
						:class="{ 'bg-muted': rowIsSelected(row) }"
						:key="row.id"
						@click="emit('row-click', row.original)"
					>
						<TableCell class="p-4" @click.stop>
							<Checkbox
								:modelValue="rowIsSelected(row)"
								@update:modelValue="
									(val: boolean | 'indeterminate') =>
										onToggleRowSelection(row, val)
								"
							/>
						</TableCell>
						<TableCell
							v-for="cell in row.getVisibleCells()"
							class="p-4"
							:key="cell.id"
						>
							<Name v-if="cell.column.id === 'name'" :contact="row.original" />

							<Phones
								v-else-if="cell.column.id === 'phones'"
								:contact="row.original"
							/>

							<Email
								v-else-if="cell.column.id === 'email'"
								:contact="row.original"
							/>

							<template v-else>
								{{ renderCell(cell) }}
							</template>
						</TableCell>
						<!--						<TableCell class="p-4">-->
						<!--							<slot name="row-actions" :row="row.original" />-->
						<!--						</TableCell>-->
					</TableRow>
				</template>
				<TableEmpty
					v-else
					class="text-sm text-muted-foreground"
					:colspan="table.getAllLeafColumns().length + 1 + 1"
				>
					{{ t('no_results_found') }}
				</TableEmpty>
			</TableBody>
		</Table>
	</div>
</template>
