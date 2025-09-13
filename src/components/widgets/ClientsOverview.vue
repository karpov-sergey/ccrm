<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { Task } from '@/types/Tasks.ts';
import type { Contact } from '@/types/Contacts.ts';

interface TopClientItem {
	contact: Contact;
	count: number;
}

const props = defineProps<{
	tasks: Task[];
}>();

const { t } = useI18n();

const topClients = computed<TopClientItem[]>(() => {
	const map = new Map<string, TopClientItem>();

	for (const task of props.tasks) {
		const contact = task.associated_contact;

		if (!contact) continue; // skip tasks without associated contact

		const id = contact.id;
		const existing = map.get(id);

		if (existing) {
			existing.count += 1;
		} else {
			map.set(id, { contact, count: 1 });
		}
	}

	return Array.from(map.values())
		.sort((a, b) => b.count - a.count)
		.slice(0, 3);
});
</script>

<template>
	<div class="flex flex-col justify-between rounded-lg border p-4 bg-sidebar">
		<div>
			<div class="font-semibold">
				{{ t('clients_overview') }}
			</div>
			<div class="text-sm text-muted-foreground mb-2">
				{{ t('your_top_clients') }}
			</div>
		</div>
		<div>
			<div v-if="topClients.length === 0" class="text-sm text-muted-foreground">
				{{ t('no_results_found') }}
			</div>
			<ul v-else>
				<li
					v-for="item in topClients"
					:key="item.contact.id"
					class="flex justify-between text-sm mb-2 last-of-type:mb-0"
				>
					<span>
						{{ item.contact.first_name }} {{ item.contact.last_name }}
					</span>
					<span class="font-medium">
						{{ item.count }}
					</span>
				</li>
			</ul>
		</div>
	</div>
</template>
