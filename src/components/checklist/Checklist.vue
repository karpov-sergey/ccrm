<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

import { Trash2, Plus, CheckCheck } from 'lucide-vue-next';

import type { ChecklistItem } from '@/types/Checklist.ts';

const props = defineProps<{
	modelValue?: ChecklistItem[] | null;
	placeholder?: string;
	disabled?: boolean;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: ChecklistItem[] | null): void;
	(e: 'change', value: ChecklistItem[] | null): void;
}>();

const { t } = useI18n();

const items = ref<ChecklistItem[]>(
	props.modelValue ? [...props.modelValue] : []
);

// Prevent feedback loops when syncing from parent to local state
const isSyncingFromProps = ref(false);

watch(
	() => props.modelValue,
	(newValue) => {
		isSyncingFromProps.value = true;
		items.value = newValue ? [...newValue] : [];
		nextTick(() => {
			isSyncingFromProps.value = false;
		});
	}
);

watch(
	items,
	(nextItems) => {
		if (isSyncingFromProps.value) return;
		const copiedItems = nextItems.map((item) => ({ ...item }));
		emit('update:modelValue', copiedItems);
		emit('change', copiedItems);
	},
	{ deep: true }
);

const progress = computed(() => {
	const total = items.value.length;
	const done = items.value.filter((item) => item.completed).length;

	return { done, total };
});

const isAllChecked = computed(() => {
	return items.value.length && items.value.every((item) => item.completed);
});

const addItem = () => {
	const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

	items.value.push({ id, title: '', completed: false });
};

const removeItem = (id: string) => {
	items.value = items.value.filter((item) => item.id !== id);
};
</script>

<template>
	<div class="grid gap-2">
		<div class="flex items-center gap-2">
			<CheckCheck
				class="h-4 w-4"
				:class="{
					'text-primary': isAllChecked,
				}"
			/>
			<div class="font-medium">Checklist</div>
			<div>{{ progress.done }}/{{ progress.total }}</div>
		</div>

		<div class="overflow-hidden">
			<div
				v-for="item in items"
				class="flex items-center gap-3 px-6 py-2"
				:key="item.id"
			>
				<Checkbox
					type="checkbox"
					v-model="item.completed"
					class="accent-primary cursor-pointer"
					:disabled="disabled"
				/>
				<Input
					v-model="item.title"
					class="flex-1 border-0 h-auto focus-visible:ring-0 shadow-none border-b-1 rounded-none"
					:class="{ 'line-through': item.completed && !!item.title.length }"
					:placeholder="placeholder || t('please_enter_item_name')"
					:disabled="disabled"
				/>
				<Button
					type="button"
					size="icon"
					variant="ghost"
					:disabled="disabled"
					@click="removeItem(item.id)"
				>
					<Trash2 class="h-4 w-4 text-muted-foreground" />
				</Button>
			</div>
			<Button
				type="button"
				variant="outline"
				class="w-full py-3 flex items-center justify-center gap-2 text-sm hover:bg-transparent hover:text-primary border-0 focus-visible:ring-0 shadow-none"
				:disabled="disabled"
				@click="addItem"
			>
				<Plus class="h-4 w-4" />
				<span>Add item</span>
			</Button>
		</div>
	</div>
</template>
