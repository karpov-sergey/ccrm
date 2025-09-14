<script setup lang="ts">
import { watch, toRef } from 'vue';

import { ScheduleXCalendar } from '@schedule-x/vue';
import {
	createCalendar,
	createViewDay,
	createViewMonthAgenda,
	createViewMonthGrid,
	createViewWeek,
	type CalendarEvent,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import 'temporal-polyfill/global';
import { createEventModalPlugin } from '@schedule-x/event-modal';

import type { Task } from '@/types/Tasks.ts';

const props = defineProps<{
	tasks: Task[];
}>();

const eventModal = createEventModalPlugin();

const calendarApp = createCalendar({
	selectedDate: Temporal.Now.plainDateISO(),
	plugins: [eventModal],
	views: [
		createViewDay(),
		createViewWeek(),
		createViewMonthGrid(),
		createViewMonthAgenda(),
	],
	events: [],
	timezone: 'UTC',
});

const FIXED_TIMEZONE_ID = 'UTC';
const tasksRef = toRef(props, 'tasks');

const mapTasksToEvents = (tasks: Task[]): CalendarEvent[] => {
	const events: CalendarEvent[] = [];
	for (const task of tasks) {
		if (!task?.date) {
			continue;
		}

		try {
			const plainDate = Temporal.PlainDate.from(task.date);
			const startPlain = plainDate.toPlainDateTime(
				Temporal.PlainTime.from('10:00')
			);
			const endPlain = plainDate.toPlainDateTime(
				Temporal.PlainTime.from('12:00')
			);
			const start = startPlain.toZonedDateTime(FIXED_TIMEZONE_ID);
			const end = endPlain.toZonedDateTime(FIXED_TIMEZONE_ID);

			events.push({
				id: task.id,
				title: task.title,
				start,
				end,
			});
		} catch (error) {
			// skip invalid date
		}
	}
	return events;
};

watch(
	() => tasksRef.value,
	(newTasks) => {
		const events = mapTasksToEvents(newTasks || []);
		calendarApp.events.set(events);
	},
	{ immediate: true, deep: true }
);
</script>

<template>
	<ScheduleXCalendar :calendar-app="calendarApp">
		<template #dateGridEvent="{ calendarEvent }">
			<div>{{ calendarEvent.title }}</div>
		</template>

		<template #timeGridEvent="{ calendarEvent }">
			<div
				class="p-2 bg-primary/60 h-full border-none! border-primary text-sm text-primary-foreground cursor-pointer"
			>
				{{ calendarEvent.title }}
			</div>
		</template>

		<template #monthGridEvent="{ calendarEvent }">
			<div>{{ calendarEvent.title }}###</div>
		</template>

		<template #eventModal="{ calendarEvent }">
			<div
				class="shadow-lg rounded-lg p-4 bg-background border overflow-hidden"
			>
				{{ calendarEvent.title }}

				<button>btn</button>
			</div>
		</template>
	</ScheduleXCalendar>
</template>

<style scoped>
:deep(.sx__calendar-wrapper) {
	width: 100%;
	max-width: 100vw;
	height: 800px;
	max-height: 90vh;
}

:deep(.sx__event-modal) {
	border-radius: 0.65rem;
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
