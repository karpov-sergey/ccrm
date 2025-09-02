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
	<section class="m-auto p-4 lg:w-[800px] lg:pt-12">
		<div class="text-lg font-bold">General</div>

		<div class="mb-6 text-sidebar-foreground/70 text-sm font-medium">
			Personal Settings
		</div>

		<form @submit="onSubmit">
			<div class="grid gap-6 items-start md:grid-cols-2 mb-12">
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

				<!--			<FormField v-slot="{ componentField }" name="position">-->
				<!--				<FormItem>-->
				<!--					<FormLabel>Position</FormLabel>-->
				<!--					<FormControl>-->
				<!--						<Input type="text" v-bind="componentField" />-->
				<!--					</FormControl>-->
				<!--					<FormMessage />-->
				<!--				</FormItem>-->
				<!--			</FormField>-->
			</div>

			<div class="col-span-2 flex justify-end">
				<Button
					class="w-full md:w-[200px]"
					type="submit"
					:loading="isSaving"
					:disabled="!form.meta.value.dirty || !form.meta.value.valid"
				>
					Save
				</Button>
			</div>
		</form>
	</section>
</template>
