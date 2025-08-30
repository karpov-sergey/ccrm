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

import { useNavigation } from '@/composables/navigation';

import { UserNavItems } from '@/enums/navigation/NavItems.ts';

import type { NavigationItem } from '@/types/Navigation.ts';

const route = useRoute();
const { userNavItems } = useNavigation();

const isUserPage = computed(() => {
	return Object.values(UserNavItems).includes(route.name as UserNavItems);
});

const currentPageName = computed(() => {
	return userNavItems.value.find((item: NavigationItem) => {
		return route.name === item.id;
	})?.label;
});
</script>

<template>
	<SidebarProvider v-if="isUserPage">
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
	<div v-else class="flex justify-center items-center h-screen">
		<RouterView />
	</div>
</template>
