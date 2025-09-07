<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';

import { Button } from '@/components/ui/button';
import EditContact from '@/components/modals/EditContact.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import DataTable from '@/components/ui/data-table/DataTable.vue';

import { createColumnHelper } from '@tanstack/vue-table';
import { getAllContacts } from '@/api/contacts';

import type { Contact } from '@/types/Contacts.ts';

const isLoading = ref(true);
const contacts = ref<Contact[]>([]);

const columnHelper = createColumnHelper<Contact>();

const contactColumns = [
	columnHelper.accessor('first_name', {
		header: () => 'Name',
	}),
	columnHelper.accessor('email', {
		header: () => 'Email',
	}),
];

onBeforeMount(async () => {
	await updateContactsList();
});

const updateContactsList = async () => {
	try {
		contacts.value = await getAllContacts();
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<section
		class="p-4"
		:class="{ 'flex justify-center items-center h-full': isLoading }"
	>
		<Spinner v-if="isLoading" />
		<template v-else>
			<div class="mb-4">
				<EditContact>
					<Button> Add New Contact </Button>
				</EditContact>
			</div>
			<DataTable
				:columns="contactColumns"
				:data="contacts"
				:enable-search="true"
			/>
		</template>
	</section>
</template>
