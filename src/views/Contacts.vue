<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/ui/button';
import EditContact from '@/components/modals/EditContact.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import DataTable from '@/components/ui/data-table/DataTable.vue';

import { createColumnHelper } from '@tanstack/vue-table';
import { deleteContacts, getAllContacts } from '@/api/contacts';

import { Plus, EyeIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';

import type { Contact } from '@/types/Contacts.ts';
import { toast } from 'vue-sonner';

const { t } = useI18n();

const isLoading = ref(true);
const contacts = ref<Contact[]>([]);

const columnHelper = createColumnHelper<Contact>();

const contactColumns = [
	// Selection column will be provided by DataTable itself as the first column
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
			<div class="mb-2">
				<EditContact
					:is-force-edit="true"
					@contact-created="updateContactsList"
				>
					<Button class="flex gap-2 items-center">
						<Plus class="w-4 h-4" />
						{{ t('add_new_contact') }}
					</Button>
				</EditContact>
			</div>

			<Icon icon="simple-icons:facebook" class="w-6 h-6 mb-2" />

			<DataTable
				:columns="contactColumns"
				:data="contacts"
				:enable-search="true"
				@delete-contacts="onDeleteContacts"
			>
				<template #row-actions-header> </template>
				<template #row-actions="{ row }: { row: Contact }">
					<EditContact
						:contact="row"
						@contact-created="updateContactsList"
						@contact-removed="updateContactsList"
					>
						<Button type="button" size="icon">
							<EyeIcon class="w-4 h-4" />
						</Button>
					</EditContact>
				</template>
			</DataTable>
		</template>
	</section>
</template>
