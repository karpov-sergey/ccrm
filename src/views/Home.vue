<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { getAllTasks } from '@/api/tasks';
import { getGreetingKey } from '@/helpers/greeting.ts';

import { useAuthStore } from '@/stores/auth.ts';

import Spinner from '@/components/ui/spinner/Spinner.vue';
import TotalIncome from '@/components/widgets/TotalIncome.vue';

import type { Task } from '@/types/Tasks.ts';

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());

const isLoading = ref(true);
const tasks = ref<Task[]>([]);

const greetingText = computed(() => {
	const name = user.value?.user_metadata?.firstName ?? '';
	return t(getGreetingKey(), { name });
});

onBeforeMount(async () => {
	await fetchTasks();
});

const fetchTasks = async () => {
	try {
		tasks.value = await getAllTasks();
	} catch (error) {
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<section
		class="p-4"
		:class="{ 'flex justify-center items-center h-full': isLoading }"
	>
		<Spinner v-if="isLoading" />
		<template v-else>
			<div class="text-2xl font-semibold">
				{{ greetingText }}
			</div>
			<div class="text-muted-foreground mb-6">
				Welcome to the CCRM, your personal task management tool.
			</div>
			<div class="grid grid-cols-3 gap-4">
				<TotalIncome :tasks="tasks" />
			</div>
		</template>
	</section>
</template>
