<script setup lang="ts">
import { ref } from 'vue';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

const isPopoverOpen = ref(false);

const onPopoverOpenUpdate = (nextOpen: boolean) => {
	if (!nextOpen) {
		closePopover();
	}
};

const closePopover = () => {
	isPopoverOpen.value = false;
};
</script>

<template>
	<Popover :open="isPopoverOpen" @update:open="onPopoverOpenUpdate">
		<PopoverTrigger as-child @click="isPopoverOpen = !isPopoverOpen">
			<slot />
		</PopoverTrigger>
		<PopoverContent class="flex w-auto flex-col gap-y-2 p-2">
			<input
				type="datetime-local"
				id="meeting-time"
				name="meeting-time"
				value="2018-06-12T19:30"
				min="2018-06-07T00:00"
				max="2018-06-14T00:00"
			/>
			<!--			<Select-->
			<!--				v-if="isPreselectVisible"-->
			<!--				@update:model-value="-->
			<!--					(value) => {-->
			<!--						if (!value) return;-->
			<!--						const date = today(getLocalTimeZone()).add({ days: Number(value) });-->
			<!--						emit('update:modelValue', date.toString());-->
			<!--						closePopover();-->
			<!--					}-->
			<!--				"-->
			<!--			>-->
			<!--				<SelectTrigger class="w-full">-->
			<!--					<SelectValue placeholder="Select day" />-->
			<!--				</SelectTrigger>-->
			<!--				<SelectContent>-->
			<!--					<SelectItem-->
			<!--						v-for="quick in quickSelectItems"-->
			<!--						:key="quick.value"-->
			<!--						:value="quick.value.toString()"-->
			<!--					>-->
			<!--						{{ quick.label }}-->
			<!--					</SelectItem>-->
			<!--				</SelectContent>-->
			<!--			</Select>-->
			<!--			<Calendar-->
			<!--				v-model="selectedDateValue"-->
			<!--				:is-with-year-and-month="props.isWithYearAndMonth"-->
			<!--				@update:modelValue="onCalendarUpdate"-->
			<!--				@date-click="closePopover"-->
			<!--			/>-->
		</PopoverContent>
	</Popover>
</template>
