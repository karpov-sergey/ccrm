<script setup lang="ts">
import { ref } from 'vue';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const isPopoverOpen = ref(false);
const selectedHour = ref(0);
const selectedMinute = ref(0);

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

	console.log(type, value);
};
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
							v-for="hour in Array.from({ length: 24 })
								.map((_, i) => i)
								.reverse()"
							:key="hour"
							:variant="hour === selectedHour ? 'default' : 'ghost'"
							size="icon"
							class="sm:w-full shrink-0 aspect-square"
							@click="() => handleTimeChange('hour', hour)"
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
							@click="() => handleTimeChange('minute', minute)"
						>
							{{ minute.toString().padStart(2, '0') }}
						</Button>
					</div>
					<ScrollBar orientation="horizontal" class="sm:hidden" />
				</ScrollArea>
			</div>
		</PopoverContent>
	</Popover>
</template>
