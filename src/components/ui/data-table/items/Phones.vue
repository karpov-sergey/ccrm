<script setup lang="ts">
import Link from '@/components/ui/link/Link.vue';

import { PhoneOutgoing } from 'lucide-vue-next';

import type { Contact } from '@/types/Contacts.ts';

const props = defineProps<{ contact: Contact }>();
</script>

<template>
	<div
		v-for="(phone, index) in props.contact.phones"
		:key="`${phone}_${index}`"
		class="mb-1 last-of-type:mb-0"
	>
		<Link :key="`${phone}_${index}`" :href="`tel:${phone}`" :text="phone">
			<PhoneOutgoing class="h-4 w-4" />
		</Link>
	</div>
</template>
