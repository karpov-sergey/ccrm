<script setup lang="ts">
import { ref, onBeforeMount, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useContactsStore } from '@/stores/contacts.ts';

import EditContact from '@/components/modals/edit-contact/EditContact.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import DataTable from '@/components/ui/data-table/DataTable.vue';

import { createColumnHelper } from '@tanstack/vue-table';

import { useFormattedDate } from '@/composables/common.ts';

import type { Contact } from '@/types/Contacts.ts';
import { toast } from 'vue-sonner';

const { t } = useI18n();
const { formattedDate } = useFormattedDate();
const contactsStore = useContactsStore();
const { contactsList } = storeToRefs(contactsStore);

const isLoading = ref(true);

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
	columnHelper.accessor('social', {
		header: () => 'Social',
	}),
	columnHelper.accessor(
		(row) => (row.birthday ? formattedDate(row.birthday) : ''),
		{
			id: 'birthday',
			header: () => 'Birthday',
			cell: (info) => info.getValue(),
		}
	),
	columnHelper.accessor('address', {
		header: () => 'Address',
	}),
	columnHelper.accessor('notes', {
		header: () => 'Notes',
	}),
];

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

const onDeleteContacts = async (ids: string[]) => {
	try {
		await contactsStore.removeContactsByIds(ids);

		toast.success(t('contacts_removed_successfully'));
	} catch (error) {
	} finally {
		await fetchContactsList();
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
				@contact-updated="fetchContactsList"
				@contact-removed="fetchContactsList"
			/>

			<DataTable
				:columns="contactColumns"
				:data="contactsList"
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
