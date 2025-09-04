<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/ui/button';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const authStore = useAuthStore();
const { t } = useI18n();

const formSchema = toTypedSchema(
	z
		.object({
			newPassword: z.string().min(6).max(50),
			newPasswordVerification: z.string().min(6).max(50),
		})
		.superRefine((val, ctx) => {
			if (val.newPassword !== val.newPasswordVerification) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: t('validation.passwords_must_be_same'),
					path: ['newPasswordVerification'],
				});
			}
		})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		newPassword: '',
		newPasswordVerification: '',
	},
});

const isSaving = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
	isSaving.value = true;

	try {
		await authStore.changePassword(values.newPassword);

		form.resetForm({
			values: {
				newPassword: '',
				newPasswordVerification: '',
			},
		});
	} catch (error: any) {
		const code: string | undefined = error?.code;

		form.setFieldTouched('newPassword', true);

		if (code === 'same_password') {
			form.setFieldError(
				'newPassword',
				t('validation.new_password_should_be_different_from_old')
			);
		}
	} finally {
		isSaving.value = false;
	}
});
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="text-lg font-bold">
			{{ t('change_password') }}
		</div>
		<div class="text-sidebar-foreground/70 text-sm font-medium">
			{{ t('update_your_password_associated_with_your_account') }}
		</div>
	</div>
	<form class="col-span-2 lg:max-w-[600px]" @submit="onSubmit">
		<div class="grid grid-cols-1 items-start gap-6 content-start">
			<FormField v-slot="{ componentField }" name="newPassword">
				<FormItem>
					<FormLabel>
						{{ t('new_password') }}
					</FormLabel>
					<FormControl>
						<Input type="password" v-bind="componentField" />
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>

			<FormField v-slot="{ componentField }" name="newPasswordVerification">
				<FormItem>
					<FormLabel>
						{{ t('verify_new_password') }}
					</FormLabel>
					<FormControl>
						<Input type="password" v-bind="componentField" />
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>

			<Button
				class="w-full md:w-auto justify-self-start"
				type="submit"
				:loading="isSaving"
				:disabled="isSaving || !form.meta.value.dirty || !form.meta.value.valid"
			>
				{{ t('save') }}
			</Button>
		</div>
	</form>
</template>
