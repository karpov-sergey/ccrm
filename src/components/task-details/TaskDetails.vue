<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import DOMPurify from 'dompurify';

import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';

import { createTask, updateTask } from '@/api/tasks';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Edit, CornerDownLeft } from 'lucide-vue-next';

import type { Task } from '@/types/tasks.ts';

const props = defineProps<{
	task?: Task;
}>();

const emit = defineEmits(['close', 'updateBoard']);

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());

const toolbarOptions = [
	['bold', 'italic', 'underline'], // toggled buttons
	['image'],
	[{ color: [] }, { background: [] }], // dropdown with defaults from theme

	[{ list: 'ordered' }, { list: 'bullet' }],

	[{ align: [] }],

	['clean'], // remove formatting button
];

const formSchema = toTypedSchema(
	z.object({
		title: z.string().min(2).max(50),
		status: z.enum(['todo', 'in_progress', 'review', 'done']),
		description: z.string().max(20000).nullable().optional(),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		title: props.task?.title || 'Card Title',
		status: props.task?.status || 'todo',
		description: props.task?.description || null,
	},
});

const isSaving = ref(false);
const isTitleEditMode = ref(false);
const isCreateMode = !props.task?.id;

const isDescriptionEditMode = ref(false);

const titleEditModeToggle = () => {
	isTitleEditMode.value = !isTitleEditMode.value;
};

const descriptionEditModeToggle = () => {
	isDescriptionEditMode.value = !isDescriptionEditMode.value;
};

//temporary hardcoded column id, remove after columns set by user
const getColumnId = (status: string) => {
	const columnMap = {
		todo: 1,
		in_progress: 2,
		review: 3,
		done: 4,
	};

	//@ts-ignore
	return columnMap[status] || 1;
};

const onSubmit = form.handleSubmit(async (values) => {
	const data = {
		title: values.title,
		status: values.status,
		user_id: user.value?.id,
		column_id: getColumnId(values.status),
		description: values.description
			? DOMPurify.sanitize(values.description, {
					USE_PROFILES: { html: true },
				})
			: null,
	};

	try {
		isSaving.value = true;

		if (isCreateMode) {
			await createTask(data);
		} else {
			await updateTask({ ...data, id: props.task.id });
		}

		emit('updateBoard');
	} catch (error) {
	} finally {
		isSaving.value = false;
	}
});

const onCancelClick = () => {
	emit('close');
};

watch(
	() => props.task,
	(task) => {
		if (!task) return;
		// Keep form in sync with incoming task props
		form.resetForm({
			values: {
				title: task.title || 'Card Title',
				status: task.status || 'todo',
				description: (task as any).description || null,
			},
		});
	},
	{ immediate: true, deep: false }
);
</script>

<template>
	<form class="grid gap-2" @submit="onSubmit">
		<div class="text-xl pb-2 px-6 border-b-1">
			<FormField v-slot="{ componentField, value }" name="title">
				<div v-if="isTitleEditMode">
					<FormItem class="relative">
						<CornerDownLeft
							class="h-4 w-4 absolute top-2.5 right-2 text-primary"
						/>
						<FormControl>
							<Input
								v-bind="componentField"
								class="pr-10"
								type="text"
								autofocus
								@keydown.enter="titleEditModeToggle"
								@blur="titleEditModeToggle"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</div>
				<div v-else class="flex justify-between items-center">
					<div class="truncate pr-2">
						{{ value }}
					</div>
					<Edit
						class="h-4 w-4 text-primary cursor-pointer"
						@click="titleEditModeToggle"
					/>
				</div>
			</FormField>
		</div>
		<div class="px-6 pb-2 border-b-1">
			<FormField v-slot="{ componentField }" name="status">
				<FormItem>
					<FormControl>
						<Select v-bind="componentField">
							<SelectTrigger>
								<SelectValue :placeholder="t('status')" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="todo"> To Do </SelectItem>
									<SelectItem value="in_progress"> In Progress </SelectItem>
									<SelectItem value="review"> Review </SelectItem>
									<SelectItem value="done"> Done </SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
		</div>

		<div class="px-6 pb-6 border-b-1">
			<!-- Description: edit/view toggle similar to title -->
			<div class="flex justify-between items-center mb-2">
				<div class="font-medium">Description</div>
				<Edit
					class="h-4 w-4 text-primary cursor-pointer"
					@click="descriptionEditModeToggle"
				/>
			</div>
			<div v-show="isDescriptionEditMode" class="border rounded-md">
				<FormField v-slot="{ value, handleChange }" name="description">
					<QuillEditor
						:content="value"
						theme="snow"
						contentType="html"
						:toolbar="toolbarOptions"
						@update:content="handleChange"
					/>
				</FormField>
			</div>
			<div v-show="!isDescriptionEditMode" class="ql-snow max-w-none text-sm">
				<!-- Render with Quill's content styles for visual parity with editor -->
				<div
					v-if="form.values?.description"
					class="ql-editor font-normal p-2!"
					v-html="
						DOMPurify.sanitize(form.values?.description as any, {
							USE_PROFILES: { html: true },
						})
					"
				></div>
				<div v-else class="text-muted-foreground">—</div>
			</div>
		</div>
		<div class="flex gap-4 items-end px-6 pt-4">
			<Button type="button" variant="secondary" @click="onCancelClick">
				{{ t('cancel') }}
			</Button>
			<Button type="submit" :disabled="isSaving" :loading="isSaving">
				{{ t('save') }}
			</Button>
		</div>
	</form>
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
