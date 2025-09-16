<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import SelectCustom from '@/components/ui/select-custom/SelectCustom.vue';
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';

import { Flag } from 'lucide-vue-next';

import type { Option } from '@/types/common.ts';

const { t } = useI18n();

const taskStatusOptions: Option[] = [
	{ value: 'todo', label: t('todo') },
	{ value: 'in_progress', label: t('in_progress') },
	{ value: 'review', label: t('review') },
	{ value: 'done', label: t('done') },
];
</script>

<template>
	<Flag class="h-4 w-4" />
	<FormField v-slot="{ componentField }" name="status">
		<FormItem class="w-full md:w-auto">
			<FormControl>
				<SelectCustom
					v-bind="componentField"
					:placeholder="t('status')"
					:options="taskStatusOptions"
					:trigger-class="'w-full md:w-auto'"
				/>
			</FormControl>
			<FormMessage />
		</FormItem>
	</FormField>
</template>

<style scoped></style>
