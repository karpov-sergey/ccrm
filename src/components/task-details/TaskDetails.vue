<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import DOMPurify from 'dompurify';

import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';
import { useDueDateVariant } from '@/composables/dateStatus.ts';

import { createTask, deleteTask, updateTask } from '@/api/tasks';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import SelectCustom from '@/components/ui/select-custom/SelectCustom.vue';
import Checklist from '@/components/checklist/Checklist.vue';
import { toast } from 'vue-sonner';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';
import DatePicker from '@/components/date-picker/DatePicker.vue';
import ContactSelect from '@/components/contact-select/ContactSelect.vue';

import {
	CornerDownLeft,
	Check,
	X,
	Edit,
	Trash2,
	Calendar as CalendarIcon,
	Flag,
	NotebookPen,
	TimerReset,
	Contact as ContactIcon,
} from 'lucide-vue-next';

import type { Task } from '@/types/Tasks.ts';
import { Badge } from '@/components/ui/badge';

const props = defineProps<{
	task?: Task;
	originalStatus?: string;
}>();

const emit = defineEmits(['close', 'updateBoard']);

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());
const { dueDateBadgeVariant, dueDateText } = useDueDateVariant();

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
		date: z.string().nullable().optional(),
		checklist: z
			.array(
				z.object({
					id: z.string(),
					title: z.string().default(''),
					completed: z.boolean().default(false),
				})
			)
			.optional(),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		title: props.task?.title || 'Card Title',
		//@ts-ignore
		status:
			props.task?.status ||
			(!!props.originalStatus && props.originalStatus) ||
			'todo',
		description: props.task?.description || null,
		date: props.task?.date || null,
		checklist: props.task?.checklist || [],
	},
});

const isSaving = ref(false);
const isTitleEditMode = ref(false);
const isDescriptionEditMode = ref(false);
const isDueDateEditMode = ref(false);
const isCreateMode = !props.task?.id;

// Draft/original buffers for description editing
const descriptionDraft = ref<string | null>(null);
const descriptionOriginal = ref<string | null>(null);

// Draft/original buffers for due date editing (stored as YYYY-MM-DD string)
const dueDateDraft = ref<string | null>(null);
const dueDateOriginal = ref<string | null>(null);

const titleInputRef = ref<{
	focus: () => void;
	focusEnd?: () => void;
	element?: HTMLInputElement | null;
} | null>(null);

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

const titleEditModeToggle = () => {
	isTitleEditMode.value = !isTitleEditMode.value;

	if (isTitleEditMode.value) {
		nextTick(() => {
			focusTitleInput();
		});
	}
};

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

const dueDateEditModeToggle = () => {
	if (!isDueDateEditMode.value) {
		dueDateOriginal.value = form.values?.date ?? null;
		dueDateDraft.value = dueDateOriginal.value;
	} else {
		dueDateDraft.value = null;
		dueDateOriginal.value = null;
	}
	isDueDateEditMode.value = !isDueDateEditMode.value;
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

const onFormEnterKeyUp = (event: KeyboardEvent) => {
	const element = event.target as HTMLElement | null;

	element?.blur?.();
};

const onSubmit = form.handleSubmit(async (values) => {
	if (!!isTitleEditMode.value) {
		return;
	}

	const data = {
		title: values.title,
		status: values.status,
		user_id: user.value?.id,
		column_id: getColumnId(values.status),
		sort_index: props.task?.sort_index || null,
		description: values.description
			? DOMPurify.sanitize(values.description, {
					USE_PROFILES: { html: true },
				})
			: null,
		date: values.date ?? null,
		checklist: values.checklist ?? [],
	};

	try {
		isSaving.value = true;

		if (isCreateMode) {
			await createTask(data);

			toast.success(t('task_created_successfully'));
		} else {
			await updateTask({ ...data, id: props.task.id });

			toast.success(t('task_updated_successfully'));
		}

		emit('updateBoard');
	} catch (error) {
	} finally {
		isSaving.value = false;
	}
});

const onRemoveSubmit = async () => {
	try {
		if (!props.task?.id) {
			return;
		}

		await deleteTask(props.task.id);

		toast.success(t('task_deleted_successfully'));
	} catch (error) {
	} finally {
		emit('updateBoard');
	}
};

const onCancelClick = () => {
	emit('close');
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

const onDueDateEditSave = () => {
	form.setFieldValue('date', dueDateDraft.value ?? null);
	isDueDateEditMode.value = false;
	dueDateDraft.value = null;
	dueDateOriginal.value = null;
};

const onDueDateEditCancel = () => {
	form.setFieldValue('date', dueDateOriginal.value ?? null);
	isDueDateEditMode.value = false;
	dueDateDraft.value = null;
	dueDateOriginal.value = null;
};

watch(
	() => props.task,
	(task) => {
		if (!task) {
			return;
		}

		// If task prop changes, exit description edit and clear buffers
		isDescriptionEditMode.value = false;
		descriptionDraft.value = null;
		descriptionOriginal.value = null;
		// Exit due date edit and clear buffers
		isDueDateEditMode.value = false;
		dueDateDraft.value = null;
		dueDateOriginal.value = null;
		// Keep form in sync with incoming task props
		form.resetForm({
			values: {
				title: task.title || 'Card Title',
				status: task.status || 'todo',
				description: task.description || null,
				date: task.date || null,
				checklist: task.checklist || [],
			},
		});
	},
	{ immediate: true, deep: false }
);
</script>

<template>
	<form
		id="task-form"
		class="grid gap-2 overflow-y-auto"
		@submit="onSubmit"
		@keyup.enter.prevent.stop="onFormEnterKeyUp"
	>
		<div class="text-xl pb-4 px-4 md:px-6 border-b-1">
			<FormField v-slot="{ componentField, value }" name="title">
				<div v-if="isTitleEditMode">
					<FormItem class="relative pt-1">
						<CornerDownLeft
							class="h-4 w-4 absolute top-3.5 right-2 text-primary"
						/>
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
		</div>
		<div class="flex items-center gap-2 px-4 md:px-6 pb-2 border-b-1">
			<Flag class="h-4 w-4" />
			<FormField v-slot="{ componentField }" name="status">
				<FormItem>
					<FormControl>
						<SelectCustom v-bind="componentField" :placeholder="t('status')" />
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
		</div>

		<div class="flex items-center gap-2 px-4 md:px-6 pb-2 border-b-1">
			<ContactIcon class="h-4 w-4" />
			<ContactSelect />
		</div>

		<div class="px-4 md:px-6 pb-6 border-b-1">
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
					class="ql-editor font-normal p-2!"
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
		</div>

		<div class="flex items-center gap-2 px-4 md:px-6 pb-2 border-b-1">
			<TimerReset class="h-4 w-4" />
			<div v-if="isDueDateEditMode" class="w-full flex gap-2 justify-between">
				<DatePicker :is-preselect-visible="true" v-model="dueDateDraft">
					<Button variant="outline">
						{{
							dueDateDraft
								? new Date(dueDateDraft).toLocaleDateString(undefined, {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})
								: 'Pick a date'
						}}
						<CalendarIcon class="h-4 w-4 text-muted-foreground" />
					</Button>
				</DatePicker>

				<div class="flex gap-2">
					<Button
						type="button"
						variant="outline"
						size="icon"
						@click="onDueDateEditCancel"
					>
						<X class="h-4 w-4" />
					</Button>

					<Button type="button" size="icon" @click="onDueDateEditSave">
						<Check class="h-4 w-4" />
					</Button>
				</div>
			</div>
			<div
				v-else
				class="flex gap-2 cursor-pointer py-1.5"
				:class="{ 'text-sm text-muted-foreground py-2': !form.values?.date }"
				@click="dueDateEditModeToggle"
			>
				<Badge
					v-if="form.values?.date"
					:variant="dueDateBadgeVariant(form.values?.date)"
					class="flex gap-2 text-sm"
				>
					{{ dueDateText(form.values?.date) }}
				</Badge>

				{{
					form.values?.date
						? new Date(form.values.date).toLocaleDateString(undefined, {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})
						: t('add_due_date')
				}}
			</div>
		</div>

		<div class="px-4 md:px-6 pb-6">
			<FormField v-slot="{ value, handleChange }" name="checklist">
				<Checklist
					:modelValue="value"
					@update:modelValue="(v) => handleChange(v)"
				/>
			</FormField>
		</div>
	</form>

	<div class="flex gap-4 justify-between px-6 pt-4">
		<ConfirmModal
			v-if="!isCreateMode"
			:title="t('are_you_sure_you_want_to_delete_this_item')"
			@confirm="onRemoveSubmit"
		>
			<Button class="text-destructive" type="button" variant="link">
				<Trash2 class="h-4 w-4" />
				{{ t('delete') }}
			</Button>
		</ConfirmModal>
		<div class="w-full flex justify-end items-end gap-4">
			<Button type="button" variant="outline" @click="onCancelClick">
				{{ t('cancel') }}
			</Button>
			<Button
				type="submit"
				form="task-form"
				:disabled="isSaving || !form.meta.value.dirty"
				:loading="isSaving"
			>
				{{ t('save') }}
			</Button>
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
