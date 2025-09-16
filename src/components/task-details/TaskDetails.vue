<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import DOMPurify from 'dompurify';

import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';

import { createTask, deleteTask, updateTask } from '@/api/tasks';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import Checklist from '@/components/checklist/Checklist.vue';
import { toast } from 'vue-sonner';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';
import Title from '@/components/task-details/parts/Title.vue';
import Status from '@/components/task-details/parts/Status.vue';
import Contact from '@/components/task-details/parts/Contact.vue';
import Price from '@/components/task-details/parts/Price.vue';
import DueDate from '@/components/task-details/parts/DueDate.vue';
import Description from '@/components/task-details/parts/Description.vue';

import { Trash2 } from 'lucide-vue-next';

import type { Task } from '@/types/Tasks.ts';

const props = defineProps<{
	task?: Task;
	originalStatus?: string;
}>();

const emit = defineEmits(['close', 'updateBoard']);

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());

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
		price: z.number().min(0).nullable().optional(),
		paid: z.number().min(0).nullable().optional(),
		associated_contact: z.any().nullable().optional(),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		title: props.task?.title || t('card_title'),
		//@ts-ignore
		status:
			props.task?.status ||
			(!!props.originalStatus && props.originalStatus) ||
			'todo',
		description: props.task?.description || null,
		date: props.task?.date || null,
		checklist: props.task?.checklist || [],
		price: props.task?.price ?? 0,
		paid: props.task?.paid ?? 0,
		associated_contact: props.task?.associated_contact || null,
	},
});

const isSaving = ref(false);
const isTitleEditMode = ref(false);
const isCreateMode = !props.task?.id;

const currencyCode = computed(
	() => user.value?.user_metadata?.currency || 'USD'
);

const amountToBePaid = computed(() => {
	const price = Number(form.values?.price ?? 0);
	const paid = Number(form.values?.paid ?? 0);
	if (!Number.isFinite(price) || !Number.isFinite(paid)) return 0;
	// Work in cents to avoid floating point precision issues
	const priceCents = Math.round(price * 100);
	const paidCents = Math.round(paid * 100);
	const remainingCents = Math.max(priceCents - paidCents, 0);

	return remainingCents / 100;
});

const formattedToBePaid = computed(() => {
	try {
		return new Intl.NumberFormat(undefined, {
			style: 'currency',
			currency: currencyCode.value,
			currencyDisplay: 'code',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amountToBePaid.value);
	} catch (e) {
		return `${currencyCode.value} ${amountToBePaid.value.toFixed(2)}`;
	}
});

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
		price: values.price ?? null,
		paid: values.paid ?? null,
		associated_contact: values.associated_contact ?? null,
		to_be_paid: amountToBePaid.value,
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

watch(
	() => props.task,
	(task) => {
		if (!task) {
			return;
		}
		// Keep form in sync with incoming task props
		form.resetForm({
			values: {
				title: task.title || t('card_title'),
				status: task.status || 'todo',
				description: task.description || null,
				date: task.date || null,
				checklist: task.checklist || [],
				price: task.price ?? null,
				paid: task.paid ?? null,
				associated_contact: task.associated_contact || null,
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
		<div class="text-xl pb-4 px-4 border-b-1">
			<Title />
		</div>
		<div class="flex items-center gap-2 px-4 pb-2 border-b-1">
			<Status />
		</div>

		<div class="flex items-center gap-2 px-4 pb-2 border-b-1">
			<Contact />
		</div>

		<div class="flex items-start gap-2 px-4 pb-2 border-b-1">
			<Price
				:amount-to-be-paid="amountToBePaid"
				:formatted-to-be-paid="formattedToBePaid"
			/>
		</div>

		<div class="flex items-center gap-2 px-4 pb-2 border-b-1">
			<DueDate />
		</div>

		<div class="px-4 pb-4 border-b-1">
			<Description />
		</div>

		<div class="px-4">
			<FormField v-slot="{ value, handleChange }" name="checklist">
				<Checklist
					:modelValue="value"
					@update:modelValue="(v) => handleChange(v)"
				/>
			</FormField>
		</div>
	</form>

	<div class="flex gap-4 justify-between items-end px-6 pt-4">
		<ConfirmModal
			v-if="!isCreateMode"
			:title="t('are_you_sure_you_want_to_delete_this_item')"
			@confirm="onRemoveSubmit"
		>
			<Button type="button" variant="destructive" size="icon">
				<Trash2 class="h-4 w-4" />
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
