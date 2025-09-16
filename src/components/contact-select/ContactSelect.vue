<script setup lang="ts">
import { ref, onBeforeMount, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { useI18n } from 'vue-i18n';
import { useContactsStore } from '@/stores/contacts.ts';

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import EditContact from '@/components/modals/edit-contact/EditContact.vue';

import type { Contact } from '@/types/Contacts.ts';

const props = defineProps<{ modelValue?: Contact | null }>();
const emit = defineEmits<{
	(e: 'update:modelValue', value: Contact | null): void;
}>();

const contactsStore = useContactsStore();
const { t } = useI18n();

const { contactsList } = storeToRefs(contactsStore);
const editModalRef = ref<any>(null);
const isLoading = ref(true);
const isOpen = ref(false);

const selectedId = ref<string | null>(props.modelValue?.id ?? null);

watch(
	() => props.modelValue,
	(v) => {
		selectedId.value = v?.id ?? null;
	}
);

const selectedContact = computed(
	() => contactsList.value.find((c) => c.id === selectedId.value) || null
);

const selectedContactLabel = computed(() => {
	const conctact = selectedContact.value ?? props.modelValue ?? null;

	if (!conctact) {
		return '';
	}

	return [conctact.first_name, conctact.last_name].filter(Boolean).join(' ');
});

onBeforeMount(async () => {
	await fetchContactsList();
});

const fetchContactsList = async () => {
	isLoading.value = true;
	try {
		await contactsStore.fetchContactsList();
	} catch (error) {
	} finally {
		isLoading.value = false;
	}
};

const onAddNewContactClick = () => {
	isOpen.value = false;

	editModalRef.value?.open?.();
};
</script>

<template>
	<Select
		v-model:open="isOpen"
		:model-value="selectedId ?? undefined"
		@update:model-value="
			(v) => {
				const id = (v as string) ?? null;
				selectedId = id as any;
				const full = contactsList.find((contact) => contact.id === id) ?? null;
				emit('update:modelValue', full as any);
			}
		"
	>
		<SelectTrigger class="w-full md:w-[280px]" :disabled="isLoading">
			<Spinner v-if="isLoading" />
			<SelectValue placeholder="Select a contact">
				{{ selectedContactLabel || 'Select a contact' }}
			</SelectValue>
		</SelectTrigger>
		<SelectContent v-if="!isLoading" class="max-h-[300px] overflow-auto">
			<SelectGroup>
				<Button class="w-full" variant="outline" @click="onAddNewContactClick">
					{{ t('add_new_contact') }}
				</Button>

				<SelectItem
					v-for="contact in contactsList"
					:key="contact.id"
					:value="contact.id"
				>
					{{ contact.first_name }} {{ contact.last_name }}
				</SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>

	<EditContact
		ref="editModalRef"
		:is-creation="true"
		@contact-updated="fetchContactsList"
	/>
</template>
