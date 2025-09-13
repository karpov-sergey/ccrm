<script setup lang="ts">
import { ScheduleXCalendar } from '@schedule-x/vue';
import {
	createCalendar,
	createViewDay,
	createViewMonthAgenda,
	createViewMonthGrid,
	createViewWeek,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import 'temporal-polyfill/global';
// import '@schedule-x/theme-shadcn/dist/index.css';

import type { Task } from '@/types/Tasks.ts';

const props = defineProps<{
	tasks: Task[];
}>();

const calendarApp = createCalendar({
	// theme: 'shadcn',
	selectedDate: Temporal.PlainDate.from('2023-12-19'),
	views: [
		createViewDay(),
		createViewWeek(),
		createViewMonthGrid(),
		createViewMonthAgenda(),
	],
	events: [
		{
			id: 1,
			title: 'Event 1',
			start: Temporal.PlainDate.from('2023-12-19'),
			end: Temporal.PlainDate.from('2023-12-19'),
		},
		{
			id: 2,
			title: 'Event 2',
			start: Temporal.ZonedDateTime.from(
				'2023-12-20T12:00:00+09:00[Asia/Tokyo]'
			),
			end: Temporal.ZonedDateTime.from('2023-12-20T13:00:00+09:00[Asia/Tokyo]'),
		},
	],
});
</script>

<template>
	<ScheduleXCalendar :calendar-app="calendarApp" />
</template>

<style scoped>
.sx-vue-calendar-wrapper {
	width: 100%;
	max-width: 100vw;
	height: 800px;
	max-height: 90vh;
}

:deep(.sx__date-picker-popup) {
	max-height: 200px;
}
</style>
