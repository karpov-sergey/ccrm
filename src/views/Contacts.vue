<script setup lang="ts">
import { ref } from 'vue';

import { Button } from '@/components/ui/button';
import EditContact from '@/components/modals/EditContact.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';

const isLoading = ref(false);

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
		</template>
	</section>
</template>
