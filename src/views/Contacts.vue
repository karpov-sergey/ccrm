<script setup lang="ts">
import { Button } from '@/components/ui/button';
import EditContact from '@/components/modals/EditContact.vue';

const onAddNewContactClick = () => {};
</script>

<template>
	<section class="p-4">
		<EditContact>
			<Button @click="onAddNewContactClick"> Add New Contact </Button>
		</EditContact>
	</section>
</template>
