<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
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
import { toast } from 'vue-sonner';
import Link from '@/components/ui/link/Link.vue';

import { createContact, updateContact } from '@/api/contacts';

import {
	Plus,
	Trash2,
	Edit,
	PhoneOutgoing,
	ExternalLink,
} from 'lucide-vue-next';

import type { Contact } from '@/types/Contacts.ts';

const props = defineProps<{
	isForceEdit?: boolean;
	contact?: Contact;
}>();

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());

const emit = defineEmits(['contact-created']);

const isModalOpen = ref(false);
const isSaving = ref(false);
const isEditModeSwitched = ref(false);

const phoneRegex = /^[+0-9 ()-]{4,20}$/;

const formSchema = toTypedSchema(
	z.object({
		firstName: z.string().nonempty().min(2).max(50),
		lastName: z.string().min(2).max(50).optional(),
		phones: z
			.array(
				z
					.string()
					.transform((v) => v.trim())
					.refine((v) => v.length === 0 || phoneRegex.test(v), {
						message: t('invalid_phone_number'),
					})
			)
			.max(5)
			.optional(),
		email: z.string().email().optional(),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		firstName: '',
		lastName: '',
		phones: [''],
		email: '',
	},
});

const isEditMode = computed((): boolean => {
	return props.isForceEdit || isEditModeSwitched.value;
});

const phonesCanAddMore = computed(() => {
	const phones = form.values.phones;

	if (!phones?.length) {
		return true;
	}

	if (!phones[phones.length - 1].match(phoneRegex)) {
		return false;
	}

	return phones.length < 5;
});

const canRemovePhone = (index: number) => {
	if (form.values.phones && form.values.phones.length > 1) {
		return true;
	}

	return index > 0;
};

const addPhone = () => {
	if (!phonesCanAddMore.value) {
		return;
	}

	const phones = [...((form.values.phones as string[] | undefined) ?? [])];

	phones.push('');
	form.setFieldValue('phones', phones);
};

const removePhone = (index: number) => {
	const phones = [...(form.values.phones ?? [])];

	phones.splice(index, 1);
	if (phones.length === 0) {
		phones.push('');
	}

	form.setFieldValue('phones', phones);
};

const onSubmit = form.handleSubmit(async (values) => {
	isSaving.value = true;

	try {
		if (props.contact?.id) {
			await updateContact({
				id: props.contact.id,
				first_name: values.firstName,
				last_name: values.lastName || '',
				user_id: user.value?.id,
				phones: (values.phones || [])
					.map((p) => p.trim())
					.filter((p) => p.length > 0),
				email: values.email || '',
			});

			toast.success(t('contact_updated_successfully'));
		} else {
			await createContact({
				first_name: values.firstName,
				last_name: values.lastName || '',
				user_id: user.value?.id,
				phones: (values.phones || [])
					.map((p) => p.trim())
					.filter((p) => p.length > 0),
				email: values.email || '',
			});

			toast.success(t('contact_created_successfully'));
		}

		isModalOpen.value = false;

		emit('contact-created');
	} catch (error) {
	} finally {
		isSaving.value = false;
	}
});

const resetFormValuesFromContact = () => {
	if (props.contact) {
		form.resetForm({
			values: {
				firstName: props.contact.first_name ?? '',
				lastName: props.contact.last_name ?? '',
				phones: (props.contact.phones && props.contact.phones.length > 0
					? props.contact.phones
					: ['']) as string[],
				email: props.contact.email ?? '',
			},
		});
	} else {
		form.resetForm({
			values: {
				firstName: '',
				lastName: '',
				phones: [''],
				email: '',
			},
		});
	}
};

const onOpenClick = () => {
	resetFormValuesFromContact();
	isEditModeSwitched.value = false;
	isModalOpen.value = true;
};

const onOpenUpdate = (isOpen: boolean) => {
	if (isOpen) {
		resetFormValuesFromContact();
		isEditModeSwitched.value = false;
		isModalOpen.value = true;
	} else {
		isModalOpen.value = false;
		isEditModeSwitched.value = false;
	}
};

const toggleEditMode = () => {
	isEditModeSwitched.value = !isEditModeSwitched.value;
};
</script>

<template>
	<Dialog v-model:open="isModalOpen" @update:open="onOpenUpdate">
		<DialogTrigger as-child>
			<slot @click="onOpenClick" />
		</DialogTrigger>
		<DialogContent class="sm:max-w-[425px]" @open-auto-focus.prevent>
			<DialogHeader>
				<DialogTitle>
					{{ t(props.contact ? 'edit_contact' : 'add_new_contact') }}
				</DialogTitle>
				<DialogDescription>
					Make changes to this contact here. Click save when you're done.
				</DialogDescription>
			</DialogHeader>
			<form id="contact-form" class="grid gap-4 py-4" @submit="onSubmit">
				<FormField v-slot="{ value, componentField }" name="firstName">
					<FormItem>
						<FormLabel>
							{{ t('first_name') }}
						</FormLabel>
						<FormControl>
							<Input v-if="isEditMode" type="text" v-bind="componentField" />
							<div v-else class="border-b pb-1">
								{{ value }}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField
					v-if="isEditMode || contact?.last_name"
					v-slot="{ value, componentField }"
					name="lastName"
				>
					<FormItem>
						<FormLabel>
							{{ t('last_name') }}
						</FormLabel>
						<FormControl>
							<Input v-if="isEditMode" type="text" v-bind="componentField" />
							<div v-else class="border-b pb-1">
								{{ value }}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<div
					v-if="isEditMode || contact?.phones?.length"
					class="flex flex-col gap-2"
				>
					<label
						class="flex items-center justify-between text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						<span>
							{{ t('phones') }}
						</span>

						<span class="text-xs text-muted-foreground">
							{{ form.values.phones?.length ?? 1 }}/5
						</span>
					</label>
					<div
						v-for="(_, index) in form.values.phones"
						:key="`${index}`"
						class="flex items-start gap-2"
					>
						<FormField
							:name="`phones.${index}`"
							v-slot="{ value, componentField }"
						>
							<FormItem class="flex-1">
								<FormControl>
									<Input
										v-if="isEditMode"
										type="tel"
										placeholder="+1 234 567 890"
										v-bind="componentField"
									/>
									<div v-else class="border-b pb-1">
										<Link :href="`tel:${value}`" :text="value">
											<PhoneOutgoing class="h-4 w-4" />
										</Link>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
						<Button
							v-if="isEditMode && canRemovePhone(index)"
							type="button"
							variant="destructive"
							size="icon"
							@click="removePhone(index)"
						>
							<Trash2 class="h-4 w-4" />
						</Button>
					</div>

					<Button
						v-if="isEditMode"
						class="w-full"
						type="button"
						variant="secondary"
						:disabled="!phonesCanAddMore"
						@click="addPhone"
					>
						<Plus class="h-4 w-4" />
					</Button>
				</div>

				<FormField
					v-if="isEditMode || contact?.email?.length"
					v-slot="{ value, componentField }"
					name="email"
				>
					<FormItem>
						<FormLabel>
							{{ t('email') }}
						</FormLabel>
						<FormControl>
							<Input v-if="isEditMode" type="text" v-bind="componentField" />
							<div v-else class="border-b pb-1">
								<Link :href="`mailto:${value}`" :text="value">
									<ExternalLink class="h-4 w-4" />
								</Link>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
			</form>
			<DialogFooter
				class="flex flex-row items-center justify-between gap-2 pt-6"
			>
				<Button
					v-if="!props.isForceEdit && props.contact"
					type="button"
					size="icon"
					@click="toggleEditMode"
				>
					<Edit class="h-4 w-4" />
				</Button>
				<div class="w-full flex items-center justify-end gap-2">
					<DialogClose as-child>
						<Button type="button" variant="outline">
							{{ t('cancel') }}
						</Button>
					</DialogClose>
					<Button
						v-if="isEditMode"
						type="submit"
						form="contact-form"
						:loading="isSaving"
						:disabled="
							isSaving || !form.meta.value.dirty || !form.meta.value.valid
						"
					>
						{{ t('save') }}
					</Button>
				</div>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<style scoped></style>
