<script setup lang="ts">
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { CakeSlice } from 'lucide-vue-next';
</script>

<template>
	<RouterLink class="pl-2" to="/">
		<SidebarMenuButton size="lg" class="cursor-pointer">
			<div
				class="flex align-middle items-center gap-2 text-xs group-data-[state=expanded]:text-2xl transition-[font-size,line-height] duration-200 ease-in-out"
			>
				<CakeSlice class="size-8" />
				<div class="text-xl font-bold">CCRM</div>
			</div>
		</SidebarMenuButton>
	</RouterLink>
</template>
