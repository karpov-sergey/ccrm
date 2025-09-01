<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.ts';

import AppSidebar from '@/components/app-sidebar/AppSidebar.vue';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher.vue';
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css';
import Spinner from '@/components/ui/spinner/Spinner.vue';

import { UserNavItems } from '@/enums/navigation/NavItems.ts';

const route = useRoute();
const { t } = useI18n();
const authStore = useAuthStore();

const isLoading = ref(true);

onBeforeMount(async () => {
	try {
		await authStore.getCurrentUser();
	} catch (error) {
	} finally {
		isLoading.value = false;
	}
});

const isUserPage = computed(() => {
	return Object.values(UserNavItems).includes(route.name as UserNavItems);
});

const currentPageName = computed(() => {
	return t(route.name as string);
});
</script>

<template>
	<div class="app-container">
		<div v-if="isLoading" class="flex justify-center items-center h-screen">
			<Spinner />
		</div>
		<template v-else>
			<Toaster />
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
	</div>
</template>
