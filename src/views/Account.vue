<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm, configure } from 'vee-validate';
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

configure({
	validateOnBlur: true,
	validateOnChange: false,
	validateOnInput: false,
	validateOnModelUpdate: false,
});

const authStore = useAuthStore();
const { user } = storeToRefs(useAuthStore());

const formSchema = toTypedSchema(
	z.object({
		firstName: z.string().min(2).max(50),
		lastName: z.string().min(2).max(50),
		position: z.string().min(2).max(50),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		firstName: user.value?.user_metadata?.firstName ?? '',
		lastName: user.value?.user_metadata?.lastName ?? '',
		position: user.value?.user_metadata?.position ?? '',
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
				position: value.user_metadata?.position ?? '',
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
	<section class="max-w-[800px] m-auto p-4">
		<div class="mb-4 text-xl font-bold">
			Account Settings {{ user?.user_metadata?.firstName ?? '' }}
		</div>

		<form class="grid grid-cols-2 gap-6 items-start" @submit="onSubmit">
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

			<FormField v-slot="{ componentField }" name="position">
				<FormItem>
					<FormLabel>Position</FormLabel>
					<FormControl>
						<Input type="text" v-bind="componentField" />
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>

			<div class="col-span-2 flex justify-end">
				<Button
					class="w-[180px]"
					type="submit"
					:loading="isSaving"
					:disabled="!form.meta.value.dirty"
				>
					Save
				</Button>
			</div>
		</form>
	</section>
</template>
