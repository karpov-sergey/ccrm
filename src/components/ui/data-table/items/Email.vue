<script setup lang="ts">
import Link from '@/components/ui/link/Link.vue';

import { ExternalLink } from 'lucide-vue-next';

import type { Contact } from '@/types/Contacts.ts';

const props = defineProps<{ contact: Contact }>();
</script>

<template>
	<Link
		v-if="!!props.contact.email"
		:href="`mailto:${props.contact.email}`"
		:text="props.contact.email"
	>
		<ExternalLink class="h-4 w-4" />
	</Link>
</template>
