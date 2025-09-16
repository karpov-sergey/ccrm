<script setup lang="ts">
import { watch, toRef } from 'vue';

import { ScheduleXCalendar } from '@schedule-x/vue';
import {
	createCalendar,
	createViewMonthGrid,
	createViewMonthAgenda,
	type CalendarEvent,
	viewMonthGrid,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import 'temporal-polyfill/global';

import { Clock } from 'lucide-vue-next';

import type { Task } from '@/types/Tasks.ts';

const props = defineProps<{
	tasks: Task[];
}>();

const emit = defineEmits<{
	(event: 'on-event-click', value: string): void;
}>();

const calendarApp = createCalendar({
	selectedDate: Temporal.Now.plainDateISO(),
	views: [createViewMonthGrid(), createViewMonthAgenda()],
	events: [],
	timezone: 'UTC',
	defaultView: viewMonthGrid.name,
	monthGridOptions: {
		nEventsPerDay: 20,
	},
	callbacks: {
		onEventClick(calendarEvent) {
			emit('on-event-click', calendarEvent.id.toString());
		},
	},
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
			const startPlain = Temporal.PlainDateTime.from(task.date);
			const start = startPlain.toZonedDateTime(FIXED_TIMEZONE_ID);
			const end = start.add({ minutes: 15 });

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

// Generate mock events for today when there are no tasks
const generateMockEventsForToday = (count = 10): CalendarEvent[] => {
	const today = Temporal.Now.plainDateISO();
	const baseTime = Temporal.PlainTime.from('09:00');
	const events: CalendarEvent[] = [];

	for (let i = 0; i < count; i++) {
		const startPlain = today.toPlainDateTime(baseTime).add({ hours: i });
		const start = startPlain.toZonedDateTime(FIXED_TIMEZONE_ID);
		const end = start.add({ minutes: 15 });

		events.push({
			id: `mock-${i + 1}`,
			title: `Test ${i + 1}`,
			start,
			end,
		});
	}

	return events;
};

watch(
	() => tasksRef.value,
	(newTasks) => {
		let events = mapTasksToEvents(newTasks || []);

		// Always include 10 mock events for today to make testing visible
		// (kept simple per request; remove or guard with a prop/flag when no longer needed)
		const mockToday = generateMockEventsForToday(10);
		events = [...mockToday, ...events];

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

		<template #monthGridEvent="{ calendarEvent }">
			<div
				class="w-full p-2 bg-primary text-background rounded-md cursor-pointer truncate"
			>
				{{
					calendarEvent.start.toPlainTime().toString({ smallestUnit: 'minute' })
				}}
				|
				{{ calendarEvent.title }}
			</div>
		</template>

		<template #monthAgendaEvent="{ calendarEvent }">
			<div class="w-full p-2 bg-primary text-background rounded-md">
				<div class="truncate mb-2">
					{{ calendarEvent.title }}
				</div>
				<div class="flex gap-2">
					<Clock class="h-4 w-4" />
					{{
						calendarEvent.start
							.toPlainTime()
							.toString({ smallestUnit: 'minute' })
					}}

					{{
						calendarEvent.start
							.toPlainDate()
							.toString({ smallestUnit: 'minute' })
					}}
				</div>
			</div>
		</template>
	</ScheduleXCalendar>
</template>

<style scoped>
/*noinspection CssUnusedSymbol*/
:deep(.sx__calendar) {
	border-color: var(--border);
}
/*noinspection CssUnusedSymbol*/
:deep(.sx__calendar-wrapper) {
	width: 100%;
	max-width: 100vw;
	height: 800px;
	max-height: 85vh;
}

/*noinspection CssUnusedSymbol*/
:deep(.sx__event-modal) {
	width: 300px;
	max-width: 92vw;
	border-radius: 0.65rem;
}

/*noinspection CssUnusedSymbol*/
:deep(.sx__month-grid-event) {
	width: 100% !important;
}

/*noinspection CssUnusedSymbol*/
:deep(.sx__date-picker-wrapper),
	/*noinspection CssUnusedSymbol*/
:deep(.sx__view-selection) {
	display: none;
}

/*noinspection CssUnusedSymbol*/
:deep(.sx__today-button) {
	/* Match primary Button (variant: default, size: default) */
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	white-space: nowrap;
	height: 2.25rem;
	padding: 0.5rem 1rem;
	border-radius: calc(var(--radius) - 2px);
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 500;
	cursor: pointer;

	color: var(--primary-foreground);
	background-color: var(--primary);
	border: 1px solid transparent;

	transition:
		background-color 0.2s ease-in-out,
		color 0.2s ease-in-out,
		box-shadow 0.2s ease-in-out,
		border-color 0.2s ease-in-out,
		opacity 0.2s ease-in-out;
}

/*noinspection CssUnusedSymbol*/
:deep(.sx__chevron-wrapper) {
	border-radius: 0.65rem;

	&:hover {
		background-color: var(--accent);
	}
}

/*noinspection CssUnusedSymbol*/
:deep(.sx__is-calendar-small .sx__chevron-wrapper) {
	min-height: 24px;
	min-width: 24px;
}

/*noinspection CssUnusedSymbol*/
:deep(.sx__is-calendar-small .sx__forward-backward-navigation),
:deep(.is-list-view .sx__forward-backward-navigation) {
	display: flex;
}

/*noinspection CssUnusedSymbol*/
:deep(.sx__ripple::before) {
	background: transparent;
}

/* Schedule X theme overrides to match app primary colors */
/*noinspection CssUnusedSymbol*/
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
/*noinspection CssUnusedSymbol*/
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
/*noinspection CssUnusedSymbol*/
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
