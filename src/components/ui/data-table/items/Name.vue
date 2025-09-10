<script setup lang="ts">
import { useNameAbbreviation } from '@/composables/common.ts';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Heart } from 'lucide-vue-next';

import type { Contact } from '@/types/Contacts.ts';

const { nameAbbreviation } = useNameAbbreviation();

const props = defineProps<{ contact: Contact }>();

const contactName = `${props.contact.first_name} ${props.contact.last_name}`;
</script>

<template>
	<div class="flex items-center gap-2">
		<Avatar>
			<AvatarFallback>
				{{ nameAbbreviation(contactName) }}
			</AvatarFallback>
		</Avatar>

		<div class="truncate font-semibold capitalize">
			{{ contactName }}
		</div>

		<Heart
			v-if="props.contact.favourite"
			class="h-4 w-4 text-red-500"
			aria-label="Favorite contact"
		/>
	</div>
</template>
