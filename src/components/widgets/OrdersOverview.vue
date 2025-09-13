<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';

import { useI18n } from 'vue-i18n';

import { TimerReset, Check } from 'lucide-vue-next';

import type { Task } from '@/types/Tasks.ts';

const props = defineProps<{
	tasks: Task[];
}>();

const { t } = useI18n();

const completedTasks = computed(() => {
	return props.tasks.filter((task) => task.status === 'done').length;
});

const dueSoonTasks = computed(() => {
	const limit = dayjs().add(3, 'day').endOf('day');

	return props.tasks.filter((task) => {
		if (task.status === 'done' || !task.date) {
			return false;
		}
		const day = dayjs(task.date);

		return !day.isAfter(limit);
	});
});
</script>

<template>
	<div class="flex flex-col justify-between rounded-lg border p-4 bg-sidebar">
		<div>
			<div class="font-semibold">
				{{ t('orders_overview') }}
			</div>
			<div class="text-sm text-muted-foreground mb-2">
				{{ t('view_your_orders') }}
			</div>
		</div>
		<div>
			<ul>
				<li class="flex justify-between text-sm mb-2">
					<div class="flex gap-2 items-center">
						{{ t('due_soon') }}

						<TimerReset
							v-if="!!dueSoonTasks.length"
							class="w-4 h-4 text-primary"
						/>
						<Check v-else class="w-4 h-4 text-success" />
					</div>
					<span class="font-medium">
						{{ dueSoonTasks.length }}
					</span>
				</li>

				<li class="flex justify-between text-sm mb-2">
					<span>
						{{ t('total') }}
					</span>
					<span class="font-medium">
						{{ tasks.length }}
					</span>
				</li>

				<li class="flex justify-between text-sm mb-2">
					<span>
						{{ t('done') }}
					</span>
					<span class="font-medium">
						{{ completedTasks }}
					</span>
				</li>
			</ul>
			<!--			<div class="flex items-center gap-2">-->
			<!--				<div>-->
			<!--					{{ t('total') }}-->
			<!--				</div>-->
			<!--				<div class="font-semibold text-3xl">-->
			<!--					{{ tasks.length }}-->
			<!--				</div>-->
			<!--			</div>-->

			<!--			<div class="flex items-center gap-2">-->
			<!--				<div>-->
			<!--					{{ t('done') }}-->
			<!--				</div>-->
			<!--				<div class="font-semibold text-3xl">-->
			<!--					{{ completedTasks }}-->
			<!--				</div>-->
			<!--			</div>-->

			<!--			<div class="flex items-center gap-2">-->
			<!--				<div>-->
			<!--					{{ t('due_soon') }}-->
			<!--				</div>-->
			<!--				<div class="font-semibold text-3xl">-->
			<!--					{{ dueSoonTasks.length }}-->
			<!--				</div>-->
			<!--			</div>-->
		</div>
	</div>
</template>
