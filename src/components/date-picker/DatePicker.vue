<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { DateValue } from '@internationalized/date';
import { getLocalTimeZone, today, parseDate } from '@internationalized/date';

import { ref, watch } from 'vue';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const { t } = useI18n();

const props = defineProps<{ modelValue?: string | null }>();

const emit = defineEmits<{
	(e: 'update:modelValue', v: string | null): void;
}>();

const items = [
	{ value: 0, label: t('calendar.today') },
	{ value: 1, label: t('calendar.tomorrow') },
	{ value: 3, label: t('calendar.in_3_days') },
	{ value: 7, label: t('calendar.in_a_week') },
];

const value = ref<DateValue>();
const isOpen = ref(false);

watch(
	() => props.modelValue,
	(v) => {
		try {
			value.value = v ? parseDate(v) : undefined;
		} catch (e) {
			value.value = undefined;
		}
	},
	{ immediate: true }
);

const close = () => (isOpen.value = false);

const onCalendarUpdate = (v?: DateValue) => {
	emit('update:modelValue', v ? v.toString() : null);
	close();
};

const onOpenUpdate = (isOpen: boolean) => {
	if (!isOpen) {
		close();
	}
};
</script>

<template>
	<Popover :open="isOpen" @update:open="onOpenUpdate">
		<PopoverTrigger as-child @click="isOpen = !isOpen">
			<slot />
		</PopoverTrigger>
		<PopoverContent class="flex w-auto flex-col gap-y-2 p-2">
			<Select
				@update:model-value="
					(v) => {
						if (!v) return;
						const d = today(getLocalTimeZone()).add({ days: Number(v) });
						emit('update:modelValue', d.toString());
						close();
					}
				"
			>
				<SelectTrigger class="w-full">
					<SelectValue placeholder="Select day" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem
						v-for="item in items"
						:key="item.value"
						:value="item.value.toString()"
					>
						{{ item.label }}
					</SelectItem>
				</SelectContent>
			</Select>
			<Calendar v-model="value" @update:modelValue="onCalendarUpdate" />
		</PopoverContent>
	</Popover>
</template>

<style scoped></style>
