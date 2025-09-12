<script setup lang="ts">
import type { AvatarFallbackProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AvatarFallback } from 'reka-ui';
import { cn } from '@/lib/utils';

// Curated set of pleasant background colors (Tailwind classes)
const PALETTE = [
	'bg-rose-500 text-white',
	'bg-pink-500 text-white',
	'bg-fuchsia-500 text-white',
	'bg-violet-500 text-white',
	'bg-indigo-500 text-white',
	'bg-sky-500 text-white',
	'bg-teal-500 text-white',
	'bg-emerald-500 text-white',
	'bg-lime-500 text-black',
	'bg-amber-500 text-black',
	'bg-orange-500 text-white',
	'bg-red-500 text-white',
];

const props = defineProps<
	AvatarFallbackProps & { class?: HTMLAttributes['class']; seed?: string }
>();

const delegatedProps = reactiveOmit(props, 'class', 'seed');

function hashString(str: string): number {
	// Simple deterministic 32-bit hash (djb2 variant)
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		hash = ((hash << 5) + hash) + str.charCodeAt(i);
		hash = hash | 0; // force 32-bit
	}
	return Math.abs(hash);
}

function pickClass(seed: string | undefined): string {
	const base = (seed ?? '').trim();
	// Fallback to a stable default string to keep color consistent when no seed
	const s = base.length ? base : 'default-avatar';
	const idx = hashString(s) % PALETTE.length;
	return PALETTE[idx];
}

// Choose a deterministic class based on provided seed or slot text (passed via prop by parent)
const colorClass = pickClass(props.seed);
</script>

<template>
	<AvatarFallback
		data-slot="avatar-fallback"
		v-bind="delegatedProps"
		:class="
			cn(
				colorClass,
				'flex size-full items-center justify-center rounded-full font-light [word-spacing:-0.2rem]',
				props.class
			)
		"
	>
		<slot />
	</AvatarFallback>
</template>
