<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useScreenWidth } from '@/composables/common';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

const { t } = useI18n();

const emit = defineEmits<{
	(event: 'update:modelValue', value: string | null): void;
}>();

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
			TIME
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
