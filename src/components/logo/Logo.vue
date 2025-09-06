<script setup lang="ts">
import { ChefHat } from 'lucide-vue-next';
</script>

<template>
	<RouterLink class="pl-2" to="/">
		<div class="flex">
			<div
				class="flex gap-2 items-center hover:text-primary transition-[color] duration-200 ease-in-out"
			>
				<ChefHat class="size-8" />
				<div
					class="md:text-[0px] font-bold md:group-data-[state=expanded]:text-xl transition-[font-size] duration-200 ease-in-out"
				>
					CCRM
				</div>
			</div>
		</div>
	</RouterLink>
</template>
