<script setup lang="ts">
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';
import { useFormattedDate } from '@/composables/common.ts';

import Link from '@/components/ui/link/Link.vue';
import SocialLinksList from '@/components/social-links-list/SocialLinksList.vue';

import { PhoneOutgoing, ExternalLink } from 'lucide-vue-next';

import type { Contact } from '@/types/Contacts.ts';

const props = defineProps<{ contact: Contact }>();

const { t } = useI18n();
const { formattedDate } = useFormattedDate();

const isSocialLinksVisible = computed(() => {
	return (
		!!props.contact.instagram ||
		!!props.contact.telegram ||
		!!props.contact.whatsapp ||
		!!props.contact.facebook
	);
});
</script>

<template>
	<div>
		<div class="grid md:grid-cols-2 items-start gap-4">
			<div v-if="!!contact.birthday" class="text-sm font-medium">
				{{ formattedDate(contact.birthday) }}
			</div>
			<SocialLinksList v-if="isSocialLinksVisible" :contact="props.contact" />
			<div v-if="!!props.contact.phones.length" class="flex flex-col gap-3">
				<div v-for="(phone, index) in props.contact.phones">
					<Link :href="`tel:${phone}`" :text="phone" :key="index">
						<PhoneOutgoing class="h-4 w-4" />
					</Link>
				</div>
			</div>

			<div v-if="!!contact.email">
				<Link :href="`mailto:${props.contact.email}`" :text="contact.email">
					<ExternalLink class="h-4 w-4" />
				</Link>
			</div>

			<div v-if="!!contact.address" class="md:col-span-2">
				<div class="text-sm font-medium mb-1">
					{{ t('address') }}
				</div>
				<div class="text-sm">
					{{ contact.address }}
				</div>
			</div>

			<div v-if="!!contact.notes" class="md:col-span-2">
				<div class="text-sm font-medium mb-1">
					{{ t('notes') }}
				</div>
				<div class="text-sm">
					{{ contact.notes }}
				</div>
			</div>

			<div class="md:col-span-2 text-muted-foreground text-sm">
				{{ t('created') }}:
				{{ formattedDate(contact.created_at) }}
			</div>
		</div>
	</div>
</template>
