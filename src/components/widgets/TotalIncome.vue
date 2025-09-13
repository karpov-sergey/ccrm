<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';

import { useAuthStore } from '@/stores/auth.ts';

import type { Task } from '@/types/Tasks.ts';
import { computed } from 'vue';

const props = defineProps<{
	tasks: Task[];
}>();

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());

const totalIncome = computed(() => {
	return props.tasks.reduce((acc, task) => {
		return acc + Number(task.paid);
	}, 0);
});
</script>

<template>
	<div class="rounded-lg border p-4 bg-sidebar">
		<div class="font-semibold">
			{{ t('total_income') }}
		</div>
		<div class="text-sm text-muted-foreground mb-2">
			View your income since
			<span class="font-semibold">
				{{ dayjs(user?.created_at!).format('MMMM DD, YYYY') }}
			</span>
		</div>
		<div class="flex items-end gap-2">
			<div>
				{{ user?.user_metadata.currency }}
			</div>
			<div class="font-semibold text-3xl">
				{{ totalIncome }}
			</div>
		</div>
	</div>
</template>
