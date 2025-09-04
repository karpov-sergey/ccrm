<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
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
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

import type { UserPayload } from '@/types/User.ts';

const authStore = useAuthStore();
const { user } = storeToRefs(useAuthStore());
const { t } = useI18n();

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
	<div class="flex flex-col gap-2">
		<div class="text-lg font-bold">
			{{ t('personal_information') }}
		</div>
		<div class="text-sidebar-foreground/70 text-sm font-medium">
			{{ t('change_personal_information') }}
		</div>
	</div>
	<form
		class="flex flex-col gap-6 col-span-2 lg:max-w-[600px]"
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
				<Button type="button" variant="outline">
					{{ t('change_avatar') }}
				</Button>
				<div class="text-sidebar-foreground/50 text-sm font-medium">
					{{ t('jpg_gif_png_1_max') }}
				</div>
			</div>
		</div>
		<div class="grid items-start gap-6 content-start lg:grid-cols-2">
			<FormField v-slot="{ componentField }" name="firstName">
				<FormItem>
					<FormLabel>
						{{ t('first_name') }}
					</FormLabel>
					<FormControl>
						<Input type="text" v-bind="componentField" />
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>

			<FormField v-slot="{ componentField }" name="lastName">
				<FormItem>
					<FormLabel>
						{{ t('last_name') }}
					</FormLabel>
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
				:disabled="isSaving || !form.meta.value.dirty || !form.meta.value.valid"
			>
				{{ t('save') }}
			</Button>
		</div>
	</form>
</template>
