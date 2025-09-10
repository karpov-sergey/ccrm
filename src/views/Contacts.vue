<script setup lang="ts">
import { ref, onBeforeMount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

import EditContact from '@/components/modals/EditContact.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import DataTable from '@/components/ui/data-table/DataTable.vue';

import { createColumnHelper } from '@tanstack/vue-table';
import { deleteContacts, getAllContacts } from '@/api/contacts';

import type { Contact } from '@/types/Contacts.ts';
import { toast } from 'vue-sonner';

const { t } = useI18n();

const isLoading = ref(true);
const contacts = ref<Contact[]>([]);

const isCreation = ref(false);

const editingContact = ref<Contact | undefined>(undefined);
const editModalRef = ref<any>(null);

const onRowClick = async (contact: Contact) => {
	isCreation.value = false;
	editingContact.value = contact;

	await nextTick();

	editModalRef.value?.open?.();
};

const onCreateClick = async () => {
	isCreation.value = true;
	editingContact.value = undefined;

	await nextTick();

	editModalRef.value?.open?.();
};

const columnHelper = createColumnHelper<Contact>();

const contactColumns = [
	columnHelper.accessor((row) => `${row.first_name} ${row.last_name}`.trim(), {
		id: 'name',
		header: () => 'Name',
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor('phones', {
		header: () => 'Phones',
	}),
	columnHelper.accessor('email', {
		header: () => 'Email',
	}),
];

onBeforeMount(async () => {
	await updateContactsList();
});

const updateContactsList = async () => {
	isLoading.value = true;

	try {
		contacts.value = await getAllContacts();
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};

const onDeleteContacts = async (ids: string[]) => {
	try {
		await deleteContacts(ids);

		toast.success(t('contacts_removed_successfully'));
	} catch (error) {
	} finally {
		await updateContactsList();
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
			<!-- Edit modal outside of DataTable, opened on row click -->
			<EditContact
				ref="editModalRef"
				:contact="editingContact"
				:is-creation="isCreation"
				@contact-updated="updateContactsList"
				@contact-removed="updateContactsList"
			/>

			<!--			<Icon icon="simple-icons:facebook" class="w-6 h-6 mb-2" />-->

			<DataTable
				:columns="contactColumns"
				:data="contacts"
				:enable-search="true"
				:remove-confirm-title="
					t('are_you_sure_you_want_to_delete_this_contact')
				"
				@delete-contacts="onDeleteContacts"
				@row-click="onRowClick"
				@add-click="onCreateClick"
			/>
		</template>
	</section>
</template>
