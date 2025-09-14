<script setup lang="ts">
import { FormField } from '@/components/ui/form';

import ContactSelect from '@/components/contact-select/ContactSelect.vue';

import { ContactIcon } from 'lucide-vue-next';
</script>

<template>
	<ContactIcon class="h-4 w-4" />
	<FormField v-slot="{ value, handleChange }" name="associated_contact">
		<ContactSelect
			:model-value="value"
			@update:model-value="(v) => handleChange(v)"
		/>
	</FormField>
</template>

<style scoped></style>
