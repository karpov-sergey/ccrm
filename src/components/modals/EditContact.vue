<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';
import { useFormattedDate } from '@/composables/common.ts';

import { Button } from '@/components/ui/button';
import DatePicker from '@/components/date-picker/DatePicker.vue';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'vue-sonner';
import Link from '@/components/ui/link/Link.vue';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';

import { createContact, deleteContacts, updateContact } from '@/api/contacts';

import {
	Plus,
	Trash2,
	Edit,
	PhoneOutgoing,
	ExternalLink,
	Heart,
} from 'lucide-vue-next';

import type { Contact } from '@/types/Contacts.ts';
import { Checkbox } from '@/components/ui/checkbox';

const props = defineProps<{
	isCreation?: boolean;
	contact?: Contact;
}>();

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());
const { formattedDate } = useFormattedDate();

const emit = defineEmits(['contact-updated', 'contact-removed']);

const isModalOpen = ref(false);
const isSaving = ref(false);
const isEditModeSwitched = ref(false);

const phoneRegex = /^[+0-9 ()-]{4,20}$/;

const formSchema = toTypedSchema(
	z.object({
		firstName: z.string().min(2).max(50),
		lastName: z.string().max(50).optional(),
		favorite: z.boolean().optional(),
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
		email: z.union([z.literal(''), z.string().email()]),
		birthday: z.string().optional(),
		instagram: z.string().max(100).optional(),
		facebook: z.string().max(100).optional(),
		whatsapp: z.string().max(100).optional(),
		telegram: z.string().max(100).optional(),
		address: z.string().max(100).optional(),
		notes: z.string().max(500).optional(),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		firstName: '',
		lastName: '',
		favorite: false,
		phones: [''],
		email: '',
		birthday: '',
		instagram: '',
		facebook: '',
		whatsapp: '',
		telegram: '',
		address: '',
		notes: '',
	},
});

const isEditMode = computed((): boolean => {
	return props.isCreation || isEditModeSwitched.value;
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
				favorite: values.favorite || false,
				user_id: user.value?.id,
				phones: (values.phones || [])
					.map((p) => p.trim())
					.filter((p) => p.length > 0),
				email: values.email || '',
				birthday: values.birthday || '',
				instagram: values.instagram || '',
				facebook: values.facebook || '',
				whatsapp: values.whatsapp || '',
				telegram: values.telegram || '',
				address: values.address || '',
				notes: values.notes || '',
			});

			toast.success(t('contact_updated_successfully'));
		} else {
			await createContact({
				first_name: values.firstName,
				last_name: values.lastName || '',
				favorite: values.favorite || false,
				user_id: user.value?.id,
				phones: (values.phones || [])
					.map((p) => p.trim())
					.filter((p) => p.length > 0),
				email: values.email || '',
				birthday: values.birthday || '',
				instagram: values.instagram || '',
				facebook: values.facebook || '',
				whatsapp: values.whatsapp || '',
				telegram: values.telegram || '',
				address: values.address || '',
				notes: values.notes || '',
			});

			toast.success(t('contact_created_successfully'));
		}

		isModalOpen.value = false;

		emit('contact-updated');
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
				favorite: props.contact.favorite ?? false,
				phones: (props.contact.phones && props.contact.phones.length > 0
					? props.contact.phones
					: ['']) as string[],
				email: props.contact.email ?? '',
				birthday: (props.contact.birthday as unknown as string) ?? '',
				instagram: (props.contact.instagram as unknown as string) ?? '',
				facebook: (props.contact.facebook as unknown as string) ?? '',
				whatsapp: (props.contact.whatsapp as unknown as string) ?? '',
				telegram: (props.contact.telegram as unknown as string) ?? '',
				address: (props.contact.address as unknown as string) ?? '',
				notes: (props.contact.notes as unknown as string) ?? '',
			},
		});
	} else {
		form.resetForm({
			values: {
				firstName: '',
				lastName: '',
				favorite: false,
				phones: [''],
				email: '',
				birthday: '',
				instagram: '',
				facebook: '',
				whatsapp: '',
				telegram: '',
				address: '',
				notes: '',
			},
		});
	}
};

const onOpenClick = () => {
	resetFormValuesFromContact();

	isEditModeSwitched.value = false;
	isModalOpen.value = true;
};

// Expose a method so parents can open the modal programmatically
const open = () => {
	resetFormValuesFromContact();
	isEditModeSwitched.value = false;
	isModalOpen.value = true;
};

defineExpose({ open });

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

const onRemoveSubmit = async () => {
	try {
		if (!props.contact?.id) {
			return;
		}

		await deleteContacts([props.contact?.id]);

		toast.success(t('contact_removed_successfully'));

		isModalOpen.value = false;

		emit('contact-removed');
	} catch (error) {
	} finally {
	}
};
</script>

<template>
	<Dialog v-model:open="isModalOpen" @update:open="onOpenUpdate">
		<DialogTrigger as-child>
			<slot @click="onOpenClick" />
		</DialogTrigger>
		<DialogContent class="md:max-w-[600px] p-2 md:p-4" @open-auto-focus.prevent>
			<DialogHeader class="flex flex-row items-start justify-between gap-4">
				<div class="flex flex-col gap-1">
					<DialogTitle>
						{{ t(props.contact ? 'edit_contact' : 'add_new_contact') }}
					</DialogTitle>
					<DialogDescription>
						Make changes to this contact here. Click save when you're done.
					</DialogDescription>
				</div>
				<Button
					v-if="!props.isCreation && props.contact"
					type="button"
					size="icon"
					@click="toggleEditMode"
				>
					<Edit class="h-4 w-4" />
				</Button>
			</DialogHeader>
			<form
				id="contact-form"
				class="grid lg:grid-cols-2 content-start items-start gap-4 py-4 px-2 overflow-y-auto"
				@submit="onSubmit"
			>
				<FormField v-slot="{ value, componentField }" name="favourite">
					<FormItem>
						<FormControl>
							<Checkbox
								v-if="isEditMode"
								class="data-[state=checked]:bg-transparent"
								v-bind="componentField"
							>
								<Heart class="col-span-2 h-6 w-6 text-red-500" />
							</Checkbox>
							<div v-else>
								{{ value }}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ value, componentField }" name="firstName">
					<FormItem>
						<FormLabel>
							{{ t('first_name') }}
						</FormLabel>
						<FormControl>
							<Input v-if="isEditMode" type="text" v-bind="componentField" />
							<div v-else>
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
							<div v-else>
								{{ value }}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<div
					v-if="isEditMode || contact?.phones?.length"
					class="flex flex-col gap-2 md:col-span-2"
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
									<div v-else>
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

					<div class="px-2">
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
				</div>

				<FormField
					v-if="isEditMode || contact?.instagram"
					v-slot="{ value, componentField }"
					name="instagram"
				>
					<FormItem>
						<FormLabel>
							{{ t('instagram') }}
						</FormLabel>
						<FormControl>
							<Input
								v-if="isEditMode"
								type="text"
								placeholder="https://instagram.com/username"
								v-bind="componentField"
							/>
							<div v-else>
								<Link :href="value" :text="value">
									<ExternalLink class="h-4 w-4" />
								</Link>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField
					v-if="isEditMode || contact?.facebook"
					v-slot="{ value, componentField }"
					name="facebook"
				>
					<FormItem>
						<FormLabel>
							{{ t('facebook') }}
						</FormLabel>
						<FormControl>
							<Input
								v-if="isEditMode"
								type="text"
								placeholder="https://facebook.com/profile"
								v-bind="componentField"
							/>
							<div v-else>
								<Link :href="value" :text="value">
									<ExternalLink class="h-4 w-4" />
								</Link>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField
					v-if="isEditMode || contact?.whatsapp"
					v-slot="{ value, componentField }"
					name="whatsapp"
				>
					<FormItem>
						<FormLabel>
							{{ t('whatsapp') }}
						</FormLabel>
						<FormControl>
							<Input
								v-if="isEditMode"
								type="text"
								placeholder="https://wa.me/1234567890"
								v-bind="componentField"
							/>
							<div v-else>
								<Link :href="value" :text="value">
									<ExternalLink class="h-4 w-4" />
								</Link>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField
					v-if="isEditMode || contact?.telegram"
					v-slot="{ value, componentField }"
					name="telegram"
				>
					<FormItem>
						<FormLabel>
							{{ t('telegram') }}
						</FormLabel>
						<FormControl>
							<Input
								v-if="isEditMode"
								type="text"
								placeholder="https://t.me/username"
								v-bind="componentField"
							/>
							<div v-else>
								<Link :href="value" :text="value">
									<ExternalLink class="h-4 w-4" />
								</Link>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

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
							<div v-else>
								<Link :href="`mailto:${value}`" :text="value">
									<ExternalLink class="h-4 w-4" />
								</Link>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField
					v-if="isEditMode || contact?.birthday"
					v-slot="{ value, componentField }"
					name="birthday"
				>
					<FormItem>
						<FormLabel>
							{{ t('date_of_birth') }}
						</FormLabel>
						<FormControl>
							<DatePicker
								v-if="isEditMode"
								:model-value="value"
								@update:model-value="componentField['onUpdate:modelValue']"
							>
								<Button
									variant="outline"
									class="w-full justify-start text-left font-normal"
								>
									{{ value ? formattedDate(value) : t('birthday') }}
								</Button>
							</DatePicker>
							<div v-else>
								{{ formattedDate(value) }}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField
					v-if="isEditMode || contact?.address"
					v-slot="{ value, componentField }"
					name="address"
				>
					<FormItem class="md:col-span-2">
						<FormLabel>
							{{ t('address') }}
						</FormLabel>
						<FormControl>
							<Input v-if="isEditMode" type="text" v-bind="componentField" />
							<div v-else>
								{{ value }}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField
					v-if="isEditMode || contact?.notes"
					v-slot="{ value, componentField }"
					name="notes"
				>
					<FormItem class="md:col-span-2">
						<FormLabel>
							{{ t('notes') }}
						</FormLabel>
						<FormControl>
							<Textarea
								v-if="isEditMode"
								v-bind="componentField"
								class="max-h-[200px]"
								rows="4"
							/>
							<div v-else>
								{{ value }}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<div
					v-if="contact?.id"
					class="col-span-2 text-muted-foreground text-sm"
				>
					Created:
					{{ formattedDate(contact.created_at) }}
				</div>
			</form>
			<DialogFooter
				class="flex flex-row items-center justify-between gap-2 pt-6"
			>
				<ConfirmModal
					v-if="!isEditMode"
					:title="t('are_you_sure_you_want_to_delete_this_contact')"
					@confirm="onRemoveSubmit"
				>
					<Button class="text-destructive" type="button" variant="link">
						<Trash2 class="h-4 w-4" />
						{{ t('delete') }}
					</Button>
				</ConfirmModal>
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
