<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { useAuthStore } from '@/stores/auth.ts';

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

const formSchema = toTypedSchema(
	z.object({
		firstName: z.string().min(2).max(50),
		lastName: z.string().min(2).max(50),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		firstName: user.value?.user_metadata?.firstName ?? '',
		lastName: user.value?.user_metadata?.lastName ?? '',
	},
});

const isSaving = ref(false);

watch(
	user,
	(value) => {
		if (!value) return;
		form.resetForm({
			values: {
				firstName: value.user_metadata?.firstName ?? '',
				lastName: value.user_metadata?.lastName ?? '',
			},
		});
	},
	{ immediate: true }
);

const onSubmit = form.handleSubmit(async (values: UserPayload) => {
	isSaving.value = true;
	try {
		await authStore.updateUser(values);
	} catch (error) {
	} finally {
		isSaving.value = false;
	}
});
</script>

<template>
	<section class="py-4 lg:pt-12">
		<div class="grid grid-cols-3 gap-6 items-start mb-12 pb-12 px-12 border-b">
			<div class="flex flex-col gap-2">
				<div class="text-lg font-bold">Personal Information</div>
				<div class="text-sidebar-foreground/70 text-sm font-medium">
					Edit Personal Information and Avatar
				</div>
			</div>
			<form
				class="flex flex-col gap-6 col-span-2 max-w-[600px]"
				@submit="onSubmit"
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
				<div class="grid grid-cols-2 items-start gap-6 content-start">
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
						:loading="isSaving"
						:disabled="
							isSaving || !form.meta.value.dirty || !form.meta.value.valid
						"
					>
						Save
					</Button>
				</div>
			</form>
		</div>

		<div class="grid grid-cols-3 gap-6 items-start mb-12 pb-12 px-12">
			<div class="flex flex-col gap-2">
				<div class="text-lg font-bold">Change password</div>
				<div class="text-sidebar-foreground/70 text-sm font-medium">
					Update your password associated with your account.
				</div>
			</div>
			<form class="col-span-2 max-w-[600px]" @submit="onSubmit">
				<div class="grid grid-cols-1 items-start gap-6 content-start">
					<FormField v-slot="{ componentField }" name="firstName">
						<FormItem>
							<FormLabel>Current password</FormLabel>
							<FormControl>
								<Input type="text" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="lastName">
						<FormItem>
							<FormLabel>New password</FormLabel>
							<FormControl>
								<Input type="text" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="lastName">
						<FormItem>
							<FormLabel>Confirm password</FormLabel>
							<FormControl>
								<Input type="text" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>

					<Button
						class="w-full md:w-auto justify-self-start"
						type="submit"
						:loading="isSaving"
						:disabled="
							isSaving || !form.meta.value.dirty || !form.meta.value.valid
						"
					>
						Save
					</Button>
				</div>
			</form>
		</div>
	</section>
</template>
