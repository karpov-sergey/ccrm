<script lang="ts" setup>
import { computed, type Ref } from 'vue';
import type { CalendarRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { CalendarRoot, useForwardPropsEmits, useDateFormatter } from 'reka-ui';
import { cn } from '@/lib/utils';
import type { DateValue } from '@internationalized/date';
import { getLocalTimeZone, today } from '@internationalized/date';
import { createYearRange, createYear, toDate } from 'reka-ui/date';

import { useVModel } from '@vueuse/core';

import {
	CalendarCell,
	CalendarCellTrigger,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHead,
	CalendarGridRow,
	CalendarHeadCell,
	CalendarHeader,
	CalendarHeading,
	CalendarNextButton,
	CalendarPrevButton,
} from '.';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const formatter = useDateFormatter('en');

const props = withDefaults(
	defineProps<
		CalendarRootProps & {
			class?: HTMLAttributes['class'];
			isWithYearAndMonth?: boolean;
		}
	>(),
	{
		modelValue: undefined,
		placeholder() {
			return today(getLocalTimeZone());
		},
		weekdayFormat: 'short',
		isWithYearAndMonth: false,
	}
);

const emits = defineEmits(['date-click', 'update:modelValue']);

const delegatedProps = computed(() => {
	const { class: _, placeholder: __, ...delegated } = props;

	return delegated;
});

const placeholder = useVModel(props, 'modelValue', emits, {
	passive: true,
	defaultValue: today(getLocalTimeZone()),
}) as Ref<DateValue>;

const forwarded = useForwardPropsEmits(delegatedProps, emits);

const onCellClick = () => {
	emits('date-click');
};
</script>

<template>
	<CalendarRoot
		v-slot="{ grid, weekDays, date }"
		data-slot="calendar"
		:class="cn('p-3', props.class)"
		v-bind="forwarded"
	>
		<CalendarHeader>
			<CalendarHeading class="w-full flex items-center justify-between gap-2">
				<template v-if="props.isWithYearAndMonth">
					<Select
						:default-value="placeholder.month.toString()"
						@update:model-value="
							(v) => {
								if (!v || !placeholder) return;
								if (Number(v) === placeholder?.month) return;
								placeholder = placeholder.set({
									month: Number(v),
								});
							}
						"
					>
						<SelectTrigger aria-label="Select month" class="w-[60%]">
							<SelectValue placeholder="Select month" />
						</SelectTrigger>
						<SelectContent class="max-h-[200px]">
							<SelectItem
								v-for="month in createYear({ dateObj: date })"
								:key="month.toString()"
								:value="month.month.toString()"
							>
								{{ formatter.custom(toDate(month), { month: 'long' }) }}
							</SelectItem>
						</SelectContent>
					</Select>
					<Select
						:default-value="placeholder.year.toString()"
						@update:model-value="
							(v) => {
								if (!v || !placeholder) return;
								if (Number(v) === placeholder?.year) return;
								placeholder = placeholder.set({
									year: Number(v),
								});
							}
						"
					>
						<SelectTrigger aria-label="Select year" class="w-[40%]">
							<SelectValue placeholder="Select year" />
						</SelectTrigger>
						<SelectContent class="max-h-[200px]">
							<SelectItem
								v-for="yearValue in createYearRange({
									start: today(getLocalTimeZone()).add({ years: -100 }),
									end: today(getLocalTimeZone()),
								})"
								:key="yearValue.toString()"
								:value="yearValue.year.toString()"
							>
								{{ yearValue.year }}
							</SelectItem>
						</SelectContent>
					</Select>
				</template>
			</CalendarHeading>

			<div v-if="!props.isWithYearAndMonth" class="flex items-center gap-1">
				<CalendarPrevButton />
				<CalendarNextButton />
			</div>
		</CalendarHeader>

		<div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
			<CalendarGrid v-for="month in grid" :key="month.value.toString()">
				<CalendarGridHead>
					<CalendarGridRow>
						<CalendarHeadCell v-for="day in weekDays" :key="day">
							{{ day }}
						</CalendarHeadCell>
					</CalendarGridRow>
				</CalendarGridHead>
				<CalendarGridBody>
					<CalendarGridRow
						v-for="(weekDates, index) in month.rows"
						:key="`weekDate-${index}`"
						class="mt-2 w-full"
					>
						<CalendarCell
							v-for="weekDate in weekDates"
							:key="weekDate.toString()"
							:date="weekDate"
							@click="onCellClick"
						>
							<CalendarCellTrigger
								class="cursor-pointer"
								:day="weekDate"
								:month="month.value"
							/>
						</CalendarCell>
					</CalendarGridRow>
				</CalendarGridBody>
			</CalendarGrid>
		</div>
	</CalendarRoot>
</template>
