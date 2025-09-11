<script setup lang="ts">
import { ref, onBeforeMount, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { useContactsStore } from '@/stores/contacts.ts';

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import type { Contact } from '@/types/Contacts.ts';

const props = defineProps<{ modelValue?: Contact | null }>();
const emit = defineEmits<{
	(e: 'update:modelValue', value: Contact | null): void;
}>();

const contactsStore = useContactsStore();

const isLoading = ref(true);
const { contactsList } = storeToRefs(contactsStore);

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
</script>

<template>
	<Select
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
		<SelectTrigger class="w-[280px]" :disabled="isLoading">
			<Spinner v-if="isLoading" />
			<SelectValue placeholder="Select a contact">
				{{ selectedContactLabel || 'Select a contact' }}
			</SelectValue>
		</SelectTrigger>
		<SelectContent v-if="!isLoading" class="max-h-[300px] overflow-auto">
			<SelectGroup>
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
</template>
