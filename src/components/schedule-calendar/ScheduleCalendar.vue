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

import type { Task } from '@/types/Tasks.ts';

const props = defineProps<{
	tasks: Task[];
}>();

const calendarApp = createCalendar({
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
:deep(.sx__calendar-wrapper) {
	width: 100%;
	max-width: 100vw;
	height: 800px;
	max-height: 90vh;
}

/* Schedule X theme overrides to match app primary colors */
:deep(.sx__calendar-wrapper) {
	/* Core palette */
	--sx-color-primary: var(--primary);
	--sx-color-on-primary: var(--primary-foreground);
	--sx-color-primary-container: var(--primary);
	--sx-color-on-primary-container: var(--primary-foreground);

	--sx-color-secondary: var(--secondary);
	--sx-color-on-secondary: var(--secondary-foreground);
	--sx-color-secondary-container: var(--secondary);
	--sx-color-on-secondary-container: var(--secondary-foreground);

	--sx-color-tertiary: var(--accent);
	--sx-color-on-tertiary: var(--accent-foreground);
	--sx-color-tertiary-container: var(--accent);
	--sx-color-on-tertiary-container: var(--accent-foreground);

	/* Surfaces and backgrounds */
	--sx-color-surface: var(--card);
	--sx-color-on-surface: var(--card-foreground);
	--sx-color-surface-dim: var(--card);
	--sx-color-surface-bright: var(--background);
	--sx-color-surface-container: var(--card);
	--sx-color-surface-container-low: var(--card);
	--sx-color-surface-container-high: var(--card);

	--sx-color-background: var(--background);
	--sx-color-on-background: var(--foreground);

	/* Borders/outline */
	--sx-color-outline: var(--border);
	--sx-color-outline-variant: var(--input);
}

/* Dark mode overrides (scoped to .dark root) */
:deep(.dark .sx__calendar-wrapper) {
	--sx-color-primary: var(--primary);
	--sx-color-on-primary: var(--primary-foreground);
	--sx-color-primary-container: var(--primary);
	--sx-color-on-primary-container: var(--primary-foreground);

	--sx-color-secondary: var(--secondary);
	--sx-color-on-secondary: var(--secondary-foreground);
	--sx-color-secondary-container: var(--secondary);
	--sx-color-on-secondary-container: var(--secondary-foreground);

	--sx-color-tertiary: var(--accent);
	--sx-color-on-tertiary: var(--accent-foreground);
	--sx-color-tertiary-container: var(--accent);
	--sx-color-on-tertiary-container: var(--accent-foreground);

	--sx-color-surface: var(--card);
	--sx-color-on-surface: var(--card-foreground);
	--sx-color-surface-dim: var(--card);
	--sx-color-surface-bright: var(--background);
	--sx-color-surface-container: var(--card);
	--sx-color-surface-container-low: var(--card);
	--sx-color-surface-container-high: var(--card);

	--sx-color-background: var(--background);
	--sx-color-on-background: var(--foreground);

	--sx-color-outline: var(--border);
	--sx-color-outline-variant: var(--input);
}

/* Date picker and popups themed to app colors */
:deep(.sx__date-picker-popup) {
	--sx-color-primary: var(--primary);
	--sx-color-on-primary: var(--primary-foreground);
	--sx-color-primary-container: var(--primary);
	--sx-color-on-primary-container: var(--primary-foreground);

	--sx-color-secondary: var(--secondary);
	--sx-color-on-secondary: var(--secondary-foreground);
	--sx-color-secondary-container: var(--secondary);
	--sx-color-on-secondary-container: var(--secondary-foreground);

	--sx-color-tertiary: var(--accent);
	--sx-color-on-tertiary: var(--accent-foreground);
	--sx-color-tertiary-container: var(--accent);
	--sx-color-on-tertiary-container: var(--accent-foreground);

	--sx-color-surface: var(--card);
	--sx-color-on-surface: var(--card-foreground);
	--sx-color-surface-dim: var(--card);
	--sx-color-surface-bright: var(--background);
	--sx-color-surface-container: var(--card);
	--sx-color-surface-container-low: var(--card);
	--sx-color-surface-container-high: var(--card);

	--sx-color-background: var(--background);
	--sx-color-on-background: var(--foreground);

	--sx-color-outline: var(--border);
	--sx-color-outline-variant: var(--input);
}
</style>
