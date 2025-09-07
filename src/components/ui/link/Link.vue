<script setup lang="ts">
const props = defineProps<{
	href: string;
	text: string;
}>();
</script>

<template>
	<a
		:href="props.href"
		class="text-sm inline-flex gap-2 items-center text-muted-foreground underline hover:text-primary transition-colors"
	>
		<slot />

		{{ props.text }}
	</a>
</template>
