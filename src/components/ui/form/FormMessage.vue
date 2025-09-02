<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { ErrorMessage } from 'vee-validate';
import { toValue, computed } from 'vue';
import { cn } from '@/lib/utils';
import { useFormField } from './useFormField';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();

const { name, formMessageId, isTouched } = useFormField();

// Show error message only after the user leaves the field (blur)
const shouldShow = computed(() => toValue(isTouched));
</script>

<template>
	<ErrorMessage
		v-if="shouldShow"
		:id="formMessageId"
		data-slot="form-message"
		as="p"
		:name="toValue(name)"
		:class="cn('text-destructive-foreground text-xs', props.class)"
	/>
</template>
