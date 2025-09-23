<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.ts';

import { createItem } from '@/api/items';

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
// import { Textarea } from '@/components/ui/textarea';
import { toast } from 'vue-sonner';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';

import type { Item as ItemType } from '@/types/Items.ts';
import { Edit, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
	isCreation?: boolean;
	item?: ItemType;
}>();

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());

const emit = defineEmits(['item-updated', 'item-removed']);

const isModalOpen = ref(false);
const isSaving = ref(false);
const isEditModeSwitched = ref(false);

const formSchema = toTypedSchema(
	z.object({
		title: z.string().min(2).max(100),
		images: z.array(z.string()).max(7).optional(),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		title: '',
		images: [''],
	},
});

const isEditMode = computed((): boolean => {
	return props.isCreation || isEditModeSwitched.value;
});

const onSubmit = form.handleSubmit(async (values) => {
	isSaving.value = true;

	try {
		if (props.item?.id) {
			console.log('update');

			toast.success(t('item_updated_successfully'));
		} else {
			await createItem({
				user_id: user.value?.id!,
				title: values.title,
				images: values.images || [''],
			});

			toast.success(t('item_created_successfully'));
		}

		isModalOpen.value = false;

		emit('item-updated');
	} catch (error) {
	} finally {
		isSaving.value = false;
	}
});

const resetFormValuesFromItem = () => {
	if (props.item) {
		form.resetForm({
			values: {
				title: props.item.title ?? '',
				images: props.item.images ?? [''],
			},
		});
	} else {
		form.resetForm({
			values: {
				title: '',
				images: [''],
			},
		});
	}
};

const onOpenClick = () => {
	resetFormValuesFromItem();

	isEditModeSwitched.value = false;
	isModalOpen.value = true;
};

const open = () => {
	resetFormValuesFromItem();

	isEditModeSwitched.value = false;
	isModalOpen.value = true;
};

defineExpose({ open });

const onOpenUpdate = (isOpen: boolean) => {
	if (isOpen) {
		resetFormValuesFromItem();

		isEditModeSwitched.value = false;
		isModalOpen.value = true;
	} else {
		isModalOpen.value = false;
		isEditModeSwitched.value = false;
	}
};

const toggleEditMode = () => {
	isEditModeSwitched.value = !isEditModeSwitched.value;

	resetFormValuesFromItem();
};

const onRemoveSubmit = async () => {
	try {
		if (!props.item?.id) {
			return;
		}

		// await createItem([props.contact?.id]);

		toast.success(t('item_removed_successfully'));

		isModalOpen.value = false;

		emit('item-removed');
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
			<DialogHeader
				class="flex flex-row items-center justify-between gap-4 text-left"
			>
				<div class="flex flex-col gap-1">
					<DialogTitle>
						<template v-if="isEditMode">
							{{ t(props.item ? 'edit_item' : 'add_new_item') }}
						</template>
						<div class="text-xl" v-else>
							{{ item?.title }}
						</div>
					</DialogTitle>
					<DialogDescription v-show="isEditMode">
						{{ t('make_changes_to_this_item_here') }}
					</DialogDescription>
				</div>
				<Button
					v-if="!props.isCreation && props.item"
					type="button"
					size="icon"
					@click="toggleEditMode"
				>
					<Edit class="h-4 w-4" />
				</Button>
			</DialogHeader>
			<form
				v-if="isEditMode"
				id="contact-form"
				class="grid lg:grid-cols-2 content-start items-start gap-4 py-4 px-2 overflow-y-auto"
				@submit="onSubmit"
			>
				<FormField v-slot="{ componentField }" name="title">
					<FormItem>
						<FormLabel>
							{{ t('title') }}
						</FormLabel>
						<FormControl>
							<Input type="text" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
			</form>
			<DialogFooter
				class="flex flex-row items-center justify-between gap-2 pt-6"
			>
				<ConfirmModal
					:title="t('are_you_sure_you_want_to_delete_this_contact')"
					@confirm="onRemoveSubmit"
				>
					<Button type="button" variant="destructive" size="icon">
						<Trash2 class="h-4 w-4" />
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
