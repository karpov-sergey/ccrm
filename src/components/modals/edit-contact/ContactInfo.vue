<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Link from '@/components/ui/link/Link.vue';
import SocialLinksList from '@/components/social-links-list/SocialLinksList.vue';

import { PhoneOutgoing } from 'lucide-vue-next';

import type { Contact } from '@/types/Contacts.ts';

const props = defineProps<{ contact: Contact }>();

const { t } = useI18n();
</script>

<template>
	<div class="grid grid-cols-2 gap-4">
		<div v-if="!!props.contact.phones.length">
			<div class="text-sm font-medium mb-2">
				{{ t('phones') }}
			</div>
			<div class="flex flex-col gap-2">
				<Link
					v-for="(phone, index) in props.contact.phones"
					:href="`tel:${phone}`"
					:text="phone"
					:key="index"
				>
					<PhoneOutgoing class="h-4 w-4" />
				</Link>
			</div>
		</div>

		<SocialLinksList :contact="props.contact" />
	</div>
</template>
