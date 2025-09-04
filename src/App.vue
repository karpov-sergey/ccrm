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
		<div
			v-if="isLoading"
			class="flex justify-center items-center min-h-dvh px-4"
		>
			<Spinner />
		</div>
		<template v-else>
			<Toaster />
			<SidebarProvider v-if="isUserPage">
				<AppSidebar />
				<SidebarInset class="flex flex-1 flex-col min-w-0">
					<header
						class="relative flex h-10 md:h-16 shrink-0 items-center gap-2 px-4 border-b"
					>
						<SidebarTrigger />

						<h1
							class="absolute left-1/2 -translate-x-1/2 text-center text-xl lg:static lg:translate-x-0 lg:left-auto lg:text-left lg:text-2xl font-bold"
						>
							{{ currentPageName }}
						</h1>
					</header>
					<div class="flex-1 min-h-0 overflow-auto">
						<RouterView />
					</div>
				</SidebarInset>
			</SidebarProvider>
			<div v-else class="flex justify-center items-center min-h-dvh px-4">
				<RouterView />
			</div>
		</template>
	</div>
</template>
