<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

type Option = { value: string; label: string };

const props = withDefaults(
	defineProps<{
		options?: Option[];
		placeholder?: string;
	}>(),
	{
		options: undefined,
		placeholder: undefined,
	}
);

const { t } = useI18n();

const defaultOptions: Option[] = [
	{ value: 'todo', label: 'To Do' },
	{ value: 'in_progress', label: 'In Progress' },
	{ value: 'review', label: 'Review' },
	{ value: 'done', label: 'Done' },
];

const resolvedOptions = computed<Option[]>(() =>
	props.options && props.options.length ? props.options : defaultOptions
);
const resolvedPlaceholder = computed<string>(
	() => props.placeholder ?? t('select')
);
</script>

<template>
	<Select v-bind="$attrs">
		<SelectTrigger>
			<SelectValue :placeholder="resolvedPlaceholder" />
		</SelectTrigger>
		<SelectContent>
			<SelectGroup>
				<SelectItem
					v-for="option in resolvedOptions"
					:key="option.value"
					:value="option.value"
				>
					{{ t(option.value) }}
				</SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>
</template>

<script lang="ts">
export default {
	inheritAttrs: true,
};
</script>
