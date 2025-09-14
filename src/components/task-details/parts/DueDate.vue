<script setup lang="ts">
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

import { useDueDateVariant } from '@/composables/dateStatus.ts';
import { useFormattedDate } from '@/composables/common.ts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/date-picker/DatePicker.vue';
import TimePicker from '@/components/ui/time-picker/TimePicker.vue';

import {
	Check,
	TimerReset,
	X,
	Calendar as CalendarIcon,
} from 'lucide-vue-next';

const { dueDateBadgeVariant, dueDateText } = useDueDateVariant();
const { formattedDate } = useFormattedDate();
const { t } = useI18n();

const isDueDateEditMode = ref(false);

// Draft/original buffers for due date editing (stored as YYYY-MM-DD string)
const dueDateDraft = ref<string | null>(null);
const dueDateOriginal = ref<string | null>(null);

const onDueDateEditSave = () => {
	form.setFieldValue('date', dueDateDraft.value ?? null);
	isDueDateEditMode.value = false;
	dueDateDraft.value = null;
	dueDateOriginal.value = null;
};

const onDueDateEditCancel = () => {
	form.setFieldValue('date', dueDateOriginal.value ?? null);
	isDueDateEditMode.value = false;
	dueDateDraft.value = null;
	dueDateOriginal.value = null;
};

const dueDateEditModeToggle = () => {
	if (!isDueDateEditMode.value) {
		dueDateOriginal.value = form.values?.date ?? null;
		dueDateDraft.value = dueDateOriginal.value;
	} else {
		dueDateDraft.value = null;
		dueDateOriginal.value = null;
	}
	isDueDateEditMode.value = !isDueDateEditMode.value;
};
</script>

<template>
	<TimerReset class="h-4 w-4" />
	<div v-if="isDueDateEditMode" class="w-full flex gap-2 justify-between">
		<div class="flex gap-2">
			<DatePicker :is-preselect-visible="true" v-model="dueDateDraft">
				<Button variant="outline">
					{{ dueDateDraft ? formattedDate(dueDateDraft) : t('pick_date') }}
					<CalendarIcon class="h-4 w-4 text-muted-foreground" />
				</Button>
			</DatePicker>

			<TimePicker>
				<Button variant="outline">
					{{ dueDateDraft ? formattedDate(dueDateDraft) : t('pick_time') }}
					<CalendarIcon class="h-4 w-4 text-muted-foreground" />
				</Button>
			</TimePicker>
		</div>
		<div class="flex gap-2">
			<Button
				type="button"
				variant="outline"
				size="icon"
				@click="onDueDateEditCancel"
			>
				<X class="h-4 w-4" />
			</Button>

			<Button type="button" size="icon" @click="onDueDateEditSave">
				<Check class="h-4 w-4" />
			</Button>
		</div>
	</div>
	<div
		v-else
		class="flex gap-2 cursor-pointer py-1.5"
		:class="{ 'text-sm text-muted-foreground py-2': !form.values?.date }"
		@click="dueDateEditModeToggle"
	>
		<Badge
			v-if="form.values?.date"
			:variant="dueDateBadgeVariant(form.values?.date)"
			class="flex gap-2 text-sm"
		>
			{{ dueDateText(form.values?.date) }}
		</Badge>

		{{
			form.values?.date ? formattedDate(form.values?.date) : t('add_due_date')
		}}
	</div>
</template>
