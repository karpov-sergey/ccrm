<script setup lang="ts">
const props = defineProps<{
	href: string;
	text: string;
}>();
</script>

<template>
	<a
		:href="props.href"
		class="text-sm inline-flex gap-2 items-start text-muted-foreground underline hover:text-primary transition-colors"
		@click.stop
	>
		<span class="flex-none mt-0.5">
			<slot />
		</span>
		<span class="min-w-0 flex-1 break-all">
			{{ props.text }}
		</span>
	</a>
</template>
