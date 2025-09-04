<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';

import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';
import { Input } from '@/components/ui/input';
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Edit } from 'lucide-vue-next';
import { createTask } from '@/api/tasks';

const emit = defineEmits(['close']);

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());

const formSchema = toTypedSchema(
	z.object({
		title: z.string().min(2).max(50),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		title: user.value?.user_metadata?.firstName ?? '',
	},
});

const isSaving = ref(false);
const isTitleEditMode = ref(false);

const titleEditModeToggle = () => {
	isTitleEditMode.value = !isTitleEditMode.value;
};

watch(
	user,
	(value) => {
		if (!value) return;
		form.resetForm({
			values: {
				title: value.user_metadata?.firstName ?? '',
			},
		});
	},
	{ immediate: true }
);

const onSubmit = form.handleSubmit(async (values) => {
	console.log(values);

	try {
		await createTask({
			title: values.title,
			user_id: user.value?.id,
		});
	} catch (error) {
	} finally {
		isSaving.value = false;
	}
});

const onCancelClick = () => {
	emit('close');
};
</script>

<template>
	<form class="grid gap-4" @submit="onSubmit">
		<div class="text-xl pb-2 pr-4 border-b">
			<!--			v-show="isTitleEditMode"-->

			<FormField v-slot="{ componentField }" name="title">
				<FormItem>
					<FormControl>
						<Input
							type="text"
							v-bind="componentField"
							@blur="titleEditModeToggle"
							@keyup.enter.prevent.stop="titleEditModeToggle"
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
			<!--			<div v-show="!isTitleEditMode" class="flex justify-between items-center">-->
			<!--				{{ user?.user_metadata.firstName }}-->
			<!--				<Edit class="cursor-pointer" @click="titleEditModeToggle" />-->
			<!--			</div>-->
		</div>
		<div>123</div>
		<div class="flex gap-4 items-end">
			<Button type="button" variant="secondary" @click="onCancelClick">
				{{ t('cancel') }}
			</Button>
			<Button type="submit">
				{{ t('save') }}
			</Button>
		</div>
	</form>
</template>
