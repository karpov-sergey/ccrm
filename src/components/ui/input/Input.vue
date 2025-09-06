<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue';
import { useVModel } from '@vueuse/core';
import { cn } from '@/lib/utils';

const props = defineProps<{
	defaultValue?: string | number;
	modelValue?: string | number;
	class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<{
	(e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
	passive: true,
	defaultValue: props.defaultValue,
});

// Keep a reference to the native input to allow parent components to call focus()
const inputElement = ref<HTMLInputElement | null>(null);

function focus() {
	const element = inputElement.value;
	if (!element) return;
	element.focus();
}

function focusEnd() {
	const element = inputElement.value;
	if (!element) return;
	element.focus();
	try {
		const length = element.value?.length ?? 0;
		element.setSelectionRange?.(length, length);
	} catch {}
}

// Expose focus helpers and the native element to parent via template reference
// Allows: const refInstance = ref(); <Input ref="refInstance" />; refInstance.value?.focus(); refInstance.value?.focusEnd(); refInstance.value?.element
defineExpose({ focus, focusEnd, element: inputElement });
</script>

<template>
	<input
		ref="inputElement"
		v-model="modelValue"
		data-slot="input"
		:class="
			cn(
				'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
				'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
				props.class
			)
		"
	/>
</template>
