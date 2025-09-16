<script setup lang="ts">
import { ref } from 'vue';

import DOMPurify from 'dompurify';

import { useI18n } from 'vue-i18n';
import { useFormContext } from 'vee-validate';

import { FormField } from '@/components/ui/form';
import { QuillEditor } from '@vueup/vue-quill';
import { Button } from '@/components/ui/button';

import { Check, NotebookPen, X } from 'lucide-vue-next';

const { t } = useI18n();
const form = useFormContext();

const isDescriptionEditMode = ref(false);

const descriptionDraft = ref<string | null>(null);
const descriptionOriginal = ref<string | null>(null);

const toolbarOptions = [
	['bold', 'italic', 'underline'], // toggled buttons
	// ['image'],
	[{ color: [] }, { background: [] }], // dropdown with defaults from theme

	[{ list: 'ordered' }, { list: 'bullet' }],

	[{ align: [] }],

	['clean'], // remove formatting button
];

const descriptionEditModeToggle = () => {
	// toggling into edit mode: snapshot original and prepare draft
	if (!isDescriptionEditMode.value) {
		descriptionOriginal.value = form.values?.description ?? null;
		descriptionDraft.value = descriptionOriginal.value;
	} else {
		// leaving edit mode without explicit save: discard draft
		descriptionDraft.value = null;
		descriptionOriginal.value = null;
	}

	isDescriptionEditMode.value = !isDescriptionEditMode.value;
};

const onDescriptionEditSave = () => {
	// commit draft into form value, sanitize, exit edit mode
	const raw = descriptionDraft.value;
	const sanitized = raw
		? DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } })
		: null;
	form.setFieldValue('description', sanitized);
	isDescriptionEditMode.value = false;
	descriptionDraft.value = null;
	descriptionOriginal.value = null;
};

const onDescriptionEditCancel = () => {
	// revert to original form value, exit edit mode
	form.setFieldValue('description', descriptionOriginal.value ?? null);
	isDescriptionEditMode.value = false;
	descriptionDraft.value = null;
	descriptionOriginal.value = null;
};
</script>

<template>
	<div class="flex items-center gap-2 mb-2">
		<NotebookPen class="h-4 w-4" />
		<div class="font-medium">
			{{ t('description') }}
		</div>
	</div>
	<div v-show="isDescriptionEditMode" class="">
		<FormField v-slot name="description">
			<QuillEditor
				theme="snow"
				contentType="html"
				:content="descriptionDraft ?? ''"
				:toolbar="toolbarOptions"
				@update:content="(val) => (descriptionDraft = val as any)"
				@keyup.enter.stop.prevent
			/>
		</FormField>
		<div class="flex justify-end gap-2 mt-2">
			<Button
				type="button"
				variant="outline"
				size="icon"
				@click="onDescriptionEditCancel"
			>
				<X class="h-4 w-4" />
			</Button>

			<Button type="button" size="icon" @click="onDescriptionEditSave">
				<Check class="h-4 w-4" />
			</Button>
		</div>
	</div>
	<div
		v-show="!isDescriptionEditMode"
		class="ql-snow max-w-none text-sm cursor-text"
		@click="descriptionEditModeToggle"
	>
		<div
			v-if="form.values?.description"
			class="ql-editor font-normal px-6! py-0!"
			v-html="
				DOMPurify.sanitize(form.values?.description as any, {
					USE_PROFILES: { html: true },
				})
			"
		></div>
		<div v-else class="text-sm text-muted-foreground cursor-pointer">
			{{ t('add_description') }}
		</div>
	</div>
</template>

<style scoped>
/* Ensure Quill editor uses the same default font as the app */
/*noinspection CssUnusedSymbol*/
:global(.ql-toolbar),
:global(.ql-snow .ql-editor),
:global(.ql-editor) {
	font-family: inherit;
	font-size: inherit;
	line-height: inherit;
	color: inherit;
}
/* Prevent Quill content from overflowing the modal horizontally */
:global(.ql-editor) {
	overflow-wrap: anywhere;
}
</style>
