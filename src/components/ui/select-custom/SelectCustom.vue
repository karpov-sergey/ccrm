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
		triggerClass?: string;
	}>(),
	{
		options: undefined,
		placeholder: undefined,
		triggerClass: undefined,
	}
);

const { t } = useI18n();

const resolvedPlaceholder = computed<string>(
	() => props.placeholder ?? t('select')
);
</script>

<template>
	<Select v-bind="$attrs">
		<SelectTrigger :class="props.triggerClass">
			<SelectValue :placeholder="resolvedPlaceholder" />
		</SelectTrigger>
		<SelectContent>
			<SelectGroup>
				<SelectItem
					v-for="option in props.options"
					:key="option.value"
					:value="option.value"
				>
					{{ option.label }}
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
