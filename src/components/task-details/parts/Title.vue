<script setup lang="ts">
import { nextTick, ref } from 'vue';

import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { CornerDownLeft, Edit } from 'lucide-vue-next';

const isTitleEditMode = ref(false);

const titleInputRef = ref<{
	focus: () => void;
	focusEnd?: () => void;
	element?: HTMLInputElement | null;
} | null>(null);

const titleEditModeToggle = () => {
	isTitleEditMode.value = !isTitleEditMode.value;

	if (isTitleEditMode.value) {
		nextTick(() => {
			focusTitleInput();
		});
	}
};

// Focus title input via the Input.vue exposed helpers
const focusTitleInput = () => {
	const api = titleInputRef.value;

	if (!api) {
		return;
	}

	// Prefer placing the caret at the end
	api.focusEnd?.();
	// Fallback to simple focus if focusEnd is not available
	api.focus?.();
};
</script>

<template>
	<FormField v-slot="{ componentField, value }" name="title">
		<div v-if="isTitleEditMode">
			<FormItem class="relative pt-1">
				<CornerDownLeft class="h-4 w-4 absolute top-3.5 right-2 text-primary" />
				<FormControl>
					<Input
						v-bind="componentField"
						ref="titleInputRef"
						class="pr-10"
						type="text"
						@blur="titleEditModeToggle"
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		</div>

		<div
			v-else
			class="flex justify-between items-center"
			@click="titleEditModeToggle"
		>
			{{ value }}
			<Edit
				class="h-4 w-4 text-primary cursor-pointer"
				@click="titleEditModeToggle"
			/>
		</div>
	</FormField>
</template>
