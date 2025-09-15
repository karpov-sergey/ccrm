<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/auth.ts';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const props = defineProps<{
	modelValue?: string | null;
}>();

const emit = defineEmits<{
	(event: 'update:modelValue', value: string | null): void;
}>();

const { user } = storeToRefs(useAuthStore());

const isPopoverOpen = ref(false);
const selectedHour = ref(0);
const selectedMinute = ref(0);
const selectedPeriod = ref('AM');

const is12HourFormat = computed(() => {
	return user.value?.user_metadata.timeFormat === '12h';
});

const hoursToDisplay = computed(() => {
	return is12HourFormat.value ? 12 : 24;
});

const to24Hour = (hour: number, period: 'AM' | 'PM', use12h: boolean) => {
	if (!use12h) {
		return hour;
	}

	const base12 = Math.abs(hour) % 12;

	return period === 'AM' ? base12 : base12 + 12;
};

const toDisplayHour = (hour: number, use12h: boolean) => {
	return use12h ? Math.abs(hour) % 12 : hour;
};

const onPopoverOpenUpdate = (nextOpen: boolean) => {
	if (!nextOpen) {
		closePopover();
	}
};

const closePopover = () => {
	isPopoverOpen.value = false;
};

const handleTimeChange = (type: 'hour' | 'minute', value: number) => {
	if (type === 'hour') {
		selectedHour.value = value;
	} else {
		selectedMinute.value = value;
	}

	// Emit respecting 12h/24h format; always emit in 24h up to parent
	const hourToEmit = to24Hour(
		selectedHour.value,
		selectedPeriod.value as 'AM' | 'PM',
		is12HourFormat.value
	);

	emit(
		'update:modelValue',
		`${hourToEmit.toString().padStart(2, '0')}:${selectedMinute.value
			.toString()
			.padStart(2, '0')}`
	);
};

const handlePeriodChange = (value: 'AM' | 'PM') => {
	selectedPeriod.value = value;
	const hour24 = to24Hour(selectedHour.value, value, is12HourFormat.value);
	emit(
		'update:modelValue',
		`${hour24.toString().padStart(2, '0')}:${selectedMinute.value
			.toString()
			.padStart(2, '0')}`
	);
};

const isHourSelected = (hour: number) => {
	const displayHour = toDisplayHour(selectedHour.value, is12HourFormat.value);

	return hour === displayHour;
};

watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			const [hour, minute] = val.split(':');

			selectedHour.value = parseInt(hour, 10);
			selectedMinute.value = parseInt(minute, 10);

			selectedPeriod.value = selectedHour.value >= 12 ? 'PM' : 'AM';
		} else {
			selectedHour.value = 0;
			selectedMinute.value = 0;
		}
	},
	{ immediate: true }
);
</script>

<template>
	<Popover :open="isPopoverOpen" @update:open="onPopoverOpenUpdate">
		<PopoverTrigger as-child @click="isPopoverOpen = !isPopoverOpen">
			<slot />
		</PopoverTrigger>
		<PopoverContent class="flex w-auto flex-col gap-y-2 p-2">
			<!--			<input-->
			<!--				type="datetime-local"-->
			<!--				id="meeting-time"-->
			<!--				name="meeting-time"-->
			<!--				value="2018-06-12T19:30"-->
			<!--				min="2018-06-07T00:00"-->
			<!--				max="2018-06-14T00:00"-->
			<!--			/>-->

			<div
				class="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x"
			>
				<ScrollArea class="w-64 sm:w-auto">
					<div class="flex flex-col gap-2 p-2">
						<Button
							v-for="hour in Array.from({ length: hoursToDisplay })
								.map((_, i) => i)
								.reverse()"
							:key="hour"
							:variant="isHourSelected(hour) ? 'default' : 'ghost'"
							size="icon"
							class="sm:w-full shrink-0 aspect-square"
							@click="handleTimeChange('hour', hour)"
						>
							{{ hour.toString().padStart(2, '0') }}
						</Button>
					</div>
					<ScrollBar orientation="horizontal" class="sm:hidden" />
				</ScrollArea>
				<ScrollArea class="w-64 sm:w-auto">
					<div class="flex sm:flex-col p-2">
						<Button
							v-for="minute in Array.from({ length: 12 }).map((_, i) => i * 5)"
							:key="minute"
							:variant="minute === selectedMinute ? 'default' : 'ghost'"
							size="icon"
							class="sm:w-full shrink-0 aspect-square"
							@click="handleTimeChange('minute', minute)"
						>
							{{ minute.toString().padStart(2, '0') }}
						</Button>
					</div>
					<ScrollBar orientation="horizontal" class="sm:hidden" />
				</ScrollArea>

				<ScrollArea v-if="is12HourFormat" class="w-64 sm:w-auto">
					<div class="flex sm:flex-col p-2">
						<Button
							v-for="period in ['AM', 'PM'] as const"
							:key="period"
							:variant="period === selectedPeriod ? 'default' : 'ghost'"
							size="icon"
							class="sm:w-full shrink-0 aspect-square"
							@click="handlePeriodChange(period)"
						>
							{{ period }}
						</Button>
					</div>
					<ScrollBar orientation="horizontal" class="sm:hidden" />
				</ScrollArea>
			</div>
		</PopoverContent>
	</Popover>
</template>
