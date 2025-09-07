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

import { Trash2, PhoneOutgoing } from 'lucide-vue-next';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';

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
}

const { t } = useI18n();

const props = defineProps<DataTableProps>();

const emit = defineEmits(['delete-contacts']);

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

watch(inputValue, (newValue) => applyGlobalFilter(newValue));
watch(globalFilter, (newValue) => {
	if (newValue !== inputValue.value) inputValue.value = newValue ?? '';
});
</script>

<template>
	<div v-if="props.enableSearch" class="flex items-center justify-between mb-3">
		<Input
			class="w-[220px]"
			placeholder="Search..."
			:modelValue="inputValue"
			@update:modelValue="onInputChange"
		/>

		<ConfirmModal
			:title="t('are_you_sure_you_want_to_delete_this_contact')"
			@confirm="onRemoveSubmit"
		>
			<Button
				class="text-destructive"
				type="button"
				variant="link"
				:disabled="!selectedRows"
			>
				<Trash2 class="h-4 w-4" />
				{{ t('delete') }}
			</Button>
		</ConfirmModal>
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
				</TableRow>
			</TableHeader>
			<TableBody>
				<template v-if="table.getRowModel().rows.length">
					<TableRow
						v-for="row in table.getRowModel().rows"
						:key="row.id"
						:class="{ 'bg-muted': rowIsSelected(row) }"
					>
						<TableCell class="p-4">
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
							<template v-if="cell.column.id === 'phones'">
								<div
									v-for="(phone, index) in cell.getValue()"
									:key="`${phone}_${index}`"
									class="flex gap-2 items-center mb-1 text-muted-foreground last-of-type:mb-0 hover:text-primary transition-colors"
								>
									<PhoneOutgoing class="h-4 w-4" />
									<a
										:key="`${phone}_${index}`"
										:href="`tel:${cell.getValue()}`"
										class="underline"
									>
										{{ phone }}
									</a>
								</div>
							</template>
							<template v-else>
								{{ renderCell(cell) }}
							</template>
						</TableCell>
					</TableRow>
				</template>
				<TableEmpty
					v-else
					class="text-sm text-muted-foreground"
					:colspan="table.getAllLeafColumns().length + 1"
				>
					{{ t('no_results_found') }}
				</TableEmpty>
			</TableBody>
		</Table>
	</div>
</template>
