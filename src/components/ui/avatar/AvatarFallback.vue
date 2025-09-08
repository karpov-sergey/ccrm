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
	AvatarFallbackProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = reactiveOmit(props, 'class');

// Pick a random color once per component instance
const randomClass = PALETTE[Math.floor(Math.random() * PALETTE.length)];
</script>

<template>
	<AvatarFallback
		data-slot="avatar-fallback"
		v-bind="delegatedProps"
		:class="
			cn(
				randomClass,
				'flex size-full items-center justify-center rounded-full font-light [word-spacing:-0.2rem]',
				props.class
			)
		"
	>
		<slot />
	</AvatarFallback>
</template>
