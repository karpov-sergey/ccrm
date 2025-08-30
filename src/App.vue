<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import AppSidebar from '@/components/app-sidebar/AppSidebar.vue';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher.vue';

const route = useRoute();

const currentPageName = computed(() => {
	return route.name;
});
</script>

<template>
	<SidebarProvider>
		<AppSidebar />
		<SidebarInset class="flex flex-1 flex-col min-w-0">
			<header
				class="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b"
			>
				<div class="flex items-center align-middle gap-2">
					<SidebarTrigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-4" />
					<h1 class="text-2xl font-bold">{{ currentPageName }}</h1>
				</div>
				<LanguageSwitcher />
			</header>
			<div class="flex-1 min-h-0 overflow-auto">
				<RouterView />
			</div>
		</SidebarInset>
	</SidebarProvider>
</template>
