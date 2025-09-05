<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';

import { createTask } from '@/api/tasks';

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
	task: Task;
}>();

const emit = defineEmits(['close']);

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());

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
		title: props.task.title || 'Card Title',
		status: props.task.status || 'todo',
		description: props.task.description || null,
	},
});

const isSaving = ref(false);
const isTitleEditMode = ref(false);

// Description edit/view state
const isDescriptionEditMode = ref(false);

const titleEditModeToggle = () => {
	isTitleEditMode.value = !isTitleEditMode.value;
};

const descriptionEditModeToggle = () => {
	isDescriptionEditMode.value = !isDescriptionEditMode.value;
};

const onSubmit = form.handleSubmit(async (values) => {
	try {
		await createTask({
			title: values.title,
			status: values.status,
			user_id: user.value?.id,
			column_id: 1,
			description: values.description || null,
		});
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
				<!-- Edit mode: show input -->
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
				<!-- View mode: show text with edit icon -->
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

		<div class="min-h-[400px] px-6 pb-12">
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
						theme="snow"
						contentType="html"
						v-model="form.values.description"
						@update:content="(val: any) => handleChange(val)"
					/>
				</FormField>
			</div>
			<div v-show="!isDescriptionEditMode" class="ql-snow max-w-none">
				<!-- Render with Quill's content styles for visual parity with editor -->
				<div
					v-if="form.values?.description"
					class="ql-editor"
					v-html="form.values?.description as any"
				></div>
				<div v-else class="text-muted-foreground">—</div>
			</div>
		</div>
		<div class="flex gap-4 items-end px-6">
			<Button type="button" variant="secondary" @click="onCancelClick">
				{{ t('cancel') }}
			</Button>
			<Button ref="savebtn" type="submit">
				{{ t('save') }}
			</Button>
		</div>
	</form>
</template>
