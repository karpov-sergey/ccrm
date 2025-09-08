<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { useI18n } from 'vue-i18n';
import { useScreenWidth } from '@/composables/common';

import type { DateValue } from '@internationalized/date';
import { getLocalTimeZone, today, parseDate } from '@internationalized/date';

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

const props = defineProps<{
	modelValue?: string | null;
	isPreselectVisible?: boolean;
}>();
const emit = defineEmits<{
	(event: 'update:modelValue', value: string | null): void;
}>();

interface QuickSelectItem {
	value: number;
	label: string;
}
const quickSelectItems: QuickSelectItem[] = [
	{ value: 0, label: t('calendar.today') },
	{ value: 1, label: t('calendar.tomorrow') },
	{ value: 3, label: t('calendar.in_3_days') },
	{ value: 7, label: t('calendar.in_a_week') },
];

const selectedDateValue = ref<DateValue>();
const isPopoverOpen = ref(false);

const { isMobileScreen } = useScreenWidth();
const isNativeDateInputSupported = ref(false);
const shouldUseNativeDatePicker = computed(
	() => isMobileScreen.value && isNativeDateInputSupported.value
);

// Feature detect native date input support (SSR-safe)
onMounted(() => {
	try {
		const input = document.createElement('input');
		input.setAttribute('type', 'date');
		isNativeDateInputSupported.value = input.type === 'date';
	} catch {
		isNativeDateInputSupported.value = false;
	}
});

// For native input binding
const nativeInputStringValue = ref<string | undefined>(undefined);
const nativeInputRef = ref<HTMLInputElement | null>(null);

watch(
	() => props.modelValue,
	(nextModel) => {
		try {
			selectedDateValue.value = nextModel ? parseDate(nextModel) : undefined;
			nativeInputStringValue.value = nextModel ?? undefined;
		} catch {
			selectedDateValue.value = undefined;
			nativeInputStringValue.value = undefined;
		}
	},
	{ immediate: true }
);

const closePopover = () => (isPopoverOpen.value = false);

const onCalendarUpdate = (nextDateValue?: DateValue) => {
	emit('update:modelValue', nextDateValue ? nextDateValue.toString() : null);
	closePopover();
};

const onPopoverOpenUpdate = (nextOpen: boolean) => {
	if (!nextOpen) {
		closePopover();
	}
};

const onNativeDateChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const value = target.value || '';
	// Native date input returns YYYY-MM-DD; emit the same format
	emit('update:modelValue', value ? value : null);
};
</script>

<template>
	<!-- Mobile: use native date picker when supported (iOS-safe overlay) -->
	<div v-if="shouldUseNativeDatePicker" class="w-full relative">
		<!-- Transparent overlay input to capture the tap and open native picker -->
		<input
			ref="nativeInputRef"
			class="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
			type="date"
			:aria-label="t('calendar.select_date') || 'Select date'"
			:value="nativeInputStringValue"
			@change="onNativeDateChange"
			@input="onNativeDateChange"
		/>
		<!-- Visual trigger (non-interactive to let input receive the click) -->
		<div class="pointer-events-none">
			<slot />
		</div>
	</div>
	<Popover v-else :open="isPopoverOpen" @update:open="onPopoverOpenUpdate">
		<PopoverTrigger as-child @click="isPopoverOpen = !isPopoverOpen">
			<slot />
		</PopoverTrigger>
		<PopoverContent class="flex w-auto flex-col gap-y-2 p-2">
			<Select
				v-if="isPreselectVisible"
				@update:model-value="
					(value) => {
						if (!value) return;
						const date = today(getLocalTimeZone()).add({ days: Number(value) });
						emit('update:modelValue', date.toString());
						closePopover();
					}
				"
			>
				<SelectTrigger class="w-full">
					<SelectValue placeholder="Select day" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem
						v-for="quick in quickSelectItems"
						:key="quick.value"
						:value="quick.value.toString()"
					>
						{{ quick.label }}
					</SelectItem>
				</SelectContent>
			</Select>
			<Calendar
				v-model="selectedDateValue"
				@update:modelValue="onCalendarUpdate"
			/>
		</PopoverContent>
	</Popover>
</template>

<style scoped></style>
