<script setup lang="ts">
import { ref } from 'vue';

import { Button } from '@/components/ui/button';
import EditContact from '@/components/modals/EditContact.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';

const isLoading = ref(false);

import DataTable from '@/components/ui/data-table/DataTable.vue';
import { createColumnHelper } from '@tanstack/vue-table';

type Contact = {
	id: number;
	name: string;
	email: string;
};

const contacts: Contact[] = [
	{ id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
	{ id: 2, name: 'Bob Smith', email: 'bob@example.com' },
];

const columnHelper = createColumnHelper<Contact>();

const contactColumns = [
	columnHelper.accessor('name', {
		header: () => 'Name',
	}),
	columnHelper.accessor('email', {
		header: () => 'Email',
	}),
];

const onAddNewContactClick = () => {};
</script>

<template>
	<section
		class="flex p-4"
		:class="{ 'justify-center items-center h-full': isLoading }"
	>
		<Spinner v-if="isLoading" />
		<template v-else>
			<EditContact>
				<Button @click="onAddNewContactClick"> Add New Contact </Button>
			</EditContact>

			<DataTable
				:columns="contactColumns"
				:data="contacts"
				:enable-search="true"
			/>
		</template>
	</section>
</template>
