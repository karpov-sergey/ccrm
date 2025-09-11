<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
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

const contactsStore = useContactsStore();

const isLoading = ref(true);
const { contactsList } = storeToRefs(contactsStore);

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
	<Select>
		<SelectTrigger class="w-[280px]" :disabled="isLoading">
			<Spinner v-if="isLoading" />
			<SelectValue placeholder="Select a contact" />
		</SelectTrigger>
		<SelectContent v-if="!isLoading" class="max-h-[300px] overflow-auto">
			<SelectGroup>
				<SelectItem
					v-for="contact in contactsList"
					:key="contact.id"
					:value="contact.id"
				>
					<div class="text-sm font-medium">
						{{ contact.first_name }} {{ contact.last_name }}
					</div>
				</SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>
</template>
