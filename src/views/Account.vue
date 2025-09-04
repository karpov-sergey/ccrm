<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { UserPayload } from '@/types/User.ts';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const authStore = useAuthStore();
const { user } = storeToRefs(useAuthStore());
const { t } = useI18n();

const userDetailsFormSchema = toTypedSchema(
	z.object({
		firstName: z.string().min(2).max(50),
		lastName: z.string().min(2).max(50),
	})
);

const userDetailsForm = useForm({
	validationSchema: userDetailsFormSchema,
	initialValues: {
		firstName: user.value?.user_metadata?.firstName ?? '',
		lastName: user.value?.user_metadata?.lastName ?? '',
	},
});

const passwordChangeFormSchema = toTypedSchema(
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

const passwordChangeForm = useForm({
	validationSchema: passwordChangeFormSchema,
	initialValues: {
		newPassword: '',
		newPasswordVerification: '',
	},
});

const isUserDetailsSaving = ref(false);
const isPasswordChangeSaving = ref(false);

watch(
	user,
	(value) => {
		if (!value) return;
		userDetailsForm.resetForm({
			values: {
				firstName: value.user_metadata?.firstName ?? '',
				lastName: value.user_metadata?.lastName ?? '',
			},
		});
	},
	{ immediate: true }
);

const onUserDetailsSubmit = userDetailsForm.handleSubmit(
	async (values: UserPayload) => {
		isUserDetailsSaving.value = true;

		try {
			await authStore.updateUser(values);
		} catch (error) {
		} finally {
			isUserDetailsSaving.value = false;
		}
	}
);

const onPasswordChangeSubmit = passwordChangeForm.handleSubmit(
	async (values) => {
		isPasswordChangeSaving.value = true;

		try {
			await authStore.changePassword(values.newPassword);

			passwordChangeForm.resetForm({
				values: {
					newPassword: '',
					newPasswordVerification: '',
				},
			});
		} catch (error: any) {
			const code: string | undefined = error?.code;

			passwordChangeForm.setFieldTouched('newPassword', true);

			if (code === 'same_password') {
				passwordChangeForm.setFieldError(
					'newPassword',
					t('validation.new_password_should_be_different_from_old')
				);
			}
		} finally {
			isPasswordChangeSaving.value = false;
		}
	}
);
</script>

<template>
	<section class="py-4 lg:pt-12">
		<div
			class="grid gap-6 items-start mb-6 pb-6 px-6 border-b md:mb-8 md:pb-8 md:px-8 lg:grid-cols-3 lg:mb-12 lg:pb-12 lg:px-12"
		>
			<div class="flex flex-col gap-2">
				<div class="text-lg font-bold">Personal Information</div>
				<div class="text-sidebar-foreground/70 text-sm font-medium">
					Edit Personal Information and Avatar
				</div>
			</div>
			<form
				class="flex flex-col gap-6 col-span-2 lg:max-w-[600px]"
				@submit="onUserDetailsSubmit"
			>
				<div class="flex items-center gap-4">
					<Avatar class="h-24 w-24 rounded-lg">
						<AvatarImage
							:src="'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png'"
							:alt="`${user?.user_metadata.firstName} ${user?.user_metadata.lastName}`"
						/>
					</Avatar>
					<div class="flex flex-col gap-4">
						<Button type="button" variant="outline">Change avatar</Button>
						<div class="text-sidebar-foreground/50 text-sm font-medium">
							JPG, GIF or PNG. 1MB max.
						</div>
					</div>
				</div>
				<div class="grid items-start gap-6 content-start lg:grid-cols-2">
					<FormField v-slot="{ componentField }" name="firstName">
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input type="text" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="lastName">
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input type="text" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>

					<Button
						class="w-full md:w-auto justify-self-start"
						type="submit"
						:loading="isUserDetailsSaving"
						:disabled="
							isUserDetailsSaving ||
							isPasswordChangeSaving ||
							!userDetailsForm.meta.value.dirty ||
							!userDetailsForm.meta.value.valid
						"
					>
						Save
					</Button>
				</div>
			</form>
		</div>

		<div
			class="grid gap-6 items-start mb-6 pb-12 px-6 md:mb-8 md:pb-8 md:px-8 lg:grid-cols-3 lg:mb-12 lg:pb-12 lg:px-12"
		>
			<div class="flex flex-col gap-2">
				<div class="text-lg font-bold">Change password</div>
				<div class="text-sidebar-foreground/70 text-sm font-medium">
					Update your password associated with your account.
				</div>
			</div>
			<form
				class="col-span-2 lg:max-w-[600px]"
				@submit="onPasswordChangeSubmit"
			>
				<div class="grid grid-cols-1 items-start gap-6 content-start">
					<FormField v-slot="{ componentField }" name="newPassword">
						<FormItem>
							<FormLabel>Current password</FormLabel>
							<FormControl>
								<Input type="password" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="newPasswordVerification">
						<FormItem>
							<FormLabel>New password</FormLabel>
							<FormControl>
								<Input type="password" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>

					<Button
						class="w-full md:w-auto justify-self-start"
						type="submit"
						:loading="isPasswordChangeSaving"
						:disabled="
							isUserDetailsSaving ||
							isPasswordChangeSaving ||
							!passwordChangeForm.meta.value.dirty ||
							!passwordChangeForm.meta.value.valid
						"
					>
						Save
					</Button>
				</div>
			</form>
		</div>
	</section>
</template>
