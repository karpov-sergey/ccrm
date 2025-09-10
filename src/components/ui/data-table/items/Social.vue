<script setup lang="ts">
import { computed } from 'vue';

import { Icon } from '@iconify/vue';

import type { Contact } from '@/types/Contacts.ts';

const props = defineProps<{ contact: Contact }>();

const ensureHttps = (url: string): string => {
	if (!url) {
		return '';
	}

	if (/^https?:\/\//i.test(url)) {
		return url;
	}

	return `https://${url}`;
};

const sanitizeUsername = (value: string): string => {
	return value.trim().replace(/^@+/, '');
};

const instagramLink = computed((): string => {
	const value = props.contact.instagram?.trim();

	if (!value) {
		return '';
	}

	if (/instagram\.com/i.test(value)) {
		return ensureHttps(value);
	}

	const username = sanitizeUsername(value);

	if (!username) {
		return '';
	}

	return `https://instagram.com/${encodeURIComponent(username)}`;
});

const facebookLink = computed((): string => {
	const value = props.contact.facebook?.trim();

	if (!value) return '';

	if (/facebook\.com/i.test(value)) {
		return ensureHttps(value);
	}

	const path = sanitizeUsername(value);

	if (!path) {
		return '';
	}

	return `https://facebook.com/${encodeURIComponent(path)}`;
});

const whatsAppLink = computed((): string => {
	const value = props.contact.whatsapp?.trim();

	if (!value) {
		return '';
	}

	// If it's already a wa.me or whatsapp domain, just ensure protocol
	if (/(wa\.me|whatsapp\.com)/i.test(value)) {
		return ensureHttps(value);
	}

	// Normalize phone: keep digits only, allow leading + in input
	const digits = value.replace(/[^\d+]/g, '');
	const normalized = digits.replace(/^\+/, '');

	// Basic validation: E.164 length 7-15 digits
	if (!/^\d{7,15}$/.test(normalized)) {
		return '';
	}

	return `https://wa.me/${normalized}`;
});

const telegramLink = computed((): string => {
	const value = props.contact.telegram?.trim();
	if (!value) {
		return '';
	}

	if (/t\.me\//i.test(value) || /telegram\.me\//i.test(value)) {
		return ensureHttps(value);
	}

	const username = sanitizeUsername(value);

	// Telegram usernames: 5-32 chars, letters, digits, underscore
	if (!/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
		return '';
	}

	return `https://t.me/${username}`;
});
</script>

<template>
	<div class="flex gap-2 items-center">
		<a
			v-if="instagramLink"
			:href="instagramLink"
			target="_blank"
			rel="noopener noreferrer"
			@click.stop
		>
			<Icon
				icon="simple-icons:instagram"
				class="w-6 h-6 mb-2 text-muted-foreground/70 hover:text-muted-foreground"
			/>
		</a>

		<a
			v-if="whatsAppLink"
			:href="whatsAppLink"
			target="_blank"
			rel="noopener noreferrer"
			@click.stop
		>
			<Icon
				icon="simple-icons:whatsapp"
				class="w-6 h-6 mb-2 text-muted-foreground/70 hover:text-muted-foreground"
			/>
		</a>

		<a
			v-if="telegramLink"
			:href="telegramLink"
			target="_blank"
			rel="noopener noreferrer"
			@click.stop
		>
			<Icon
				icon="simple-icons:telegram"
				class="w-6 h-6 mb-2 text-muted-foreground/70 hover:text-muted-foreground"
			/>
		</a>

		<a
			v-if="facebookLink"
			:href="facebookLink"
			target="_blank"
			rel="noopener noreferrer"
			@click.stop
		>
			<Icon
				icon="simple-icons:facebook"
				class="w-6 h-6 mb-2 text-muted-foreground/70 hover:text-muted-foreground"
			/>
		</a>
	</div>
</template>
