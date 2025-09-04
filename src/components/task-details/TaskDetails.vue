<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

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

const emit = defineEmits(['close']);

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());

const formSchema = toTypedSchema(
	z.object({
		title: z.string().min(2).max(50),
		status: z.enum(['todo', 'in_progress', 'review', 'done']),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		title: 'My Best Task I ever had',
		status: 'todo',
	},
});

const isSaving = ref(false);
const isTitleEditMode = ref(false);

const titleEditModeToggle = () => {
	isTitleEditMode.value = !isTitleEditMode.value;
};

const onSubmit = form.handleSubmit(async (values) => {
	console.log(values);

	try {
		await createTask({
			title: values.title,
			status: values.status,
			user_id: user.value?.id,
			column_id: 1,
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
	user,
	(value) => {
		if (!value) return;
		form.resetForm({
			values: {
				title: '',
				status: 'todo',
			},
		});
	},
	{ immediate: true }
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
						{{ value || 'My Best Task I ever had' }}
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
