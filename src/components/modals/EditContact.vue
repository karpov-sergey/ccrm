<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { createContact } from '@/api/contacts';
import { storeToRefs } from 'pinia';

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());

const isModalOpen = ref(false);
const isSaving = ref(false);

const formSchema = toTypedSchema(
	z.object({
		firstName: z.string().min(2).max(50),
		lastName: z.string().min(2).max(50),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		firstName: '',
		lastName: '',
	},
});

// watch(
// 	user,
// 	(value) => {
// 		if (!value) return;
// 		form.resetForm({
// 			values: {
// 				firstName: value.user_metadata?.firstName ?? '',
// 				lastName: value.user_metadata?.lastName ?? '',
// 			},
// 		});
// 	},
// 	{ immediate: true }
// );

const onSubmit = form.handleSubmit(async (values) => {
	isSaving.value = true;

	try {
		await createContact({
			first_name: values.firstName,
			last_name: values.lastName,
			user_id: user.value?.id,
		});

		isModalOpen.value = false;
	} catch (error) {
	} finally {
		isSaving.value = false;
	}
});

const onOpenClick = () => {
	isModalOpen.value = true;
};

const onOpenUpdate = (isOpen: boolean) => {
	if (!isOpen) {
		isModalOpen.value = false;
	}
};

const onCancelClick = () => {};
</script>

<template>
	<Dialog v-model:open="isModalOpen" @update:open="onOpenUpdate">
		<DialogTrigger as-child>
			<slot @click="onOpenClick" />
		</DialogTrigger>
		<DialogContent class="sm:max-w-[425px]" @open-auto-focus.prevent>
			<form @submit="onSubmit">
				<DialogHeader>
					<DialogTitle>
						{{ t('edit_contact') }}
					</DialogTitle>
					<DialogDescription>
						Make changes to this contact here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<div class="grid gap-4 py-4">
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
				</div>
				<DialogFooter class="flex gap-2">
					<DialogClose as-child>
						<Button type="button" variant="outline" @click="onCancelClick">
							{{ t('cancel') }}
						</Button>
					</DialogClose>
					<Button
						type="submit"
						:loading="isSaving"
						:disabled="
							isSaving || !form.meta.value.dirty || !form.meta.value.valid
						"
					>
						{{ t('save') }}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>

<style scoped></style>
