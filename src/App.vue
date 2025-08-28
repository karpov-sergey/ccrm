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

const route = useRoute();

const currentPageName = computed(() => {
	return route.name;
});
</script>

<template>
	<SidebarProvider>
		<AppSidebar />
		<SidebarInset>
			<header
				class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
			>
				<div class="flex items-center align-middle gap-2 px-4">
					<SidebarTrigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-4" />
					<h1 class="text-2xl font-bold">{{ currentPageName }}</h1>
					<!--					<Breadcrumb>-->
					<!--						<BreadcrumbList>-->
					<!--							<BreadcrumbItem class="hidden md:block">-->
					<!--								<BreadcrumbLink href="#">-->
					<!--									Building Your Application-->
					<!--								</BreadcrumbLink>-->
					<!--							</BreadcrumbItem>-->
					<!--							<BreadcrumbSeparator class="hidden md:block" />-->
					<!--							<BreadcrumbItem>-->
					<!--								<BreadcrumbPage>Data Fetching</BreadcrumbPage>-->
					<!--							</BreadcrumbItem>-->
					<!--						</BreadcrumbList>-->
					<!--					</Breadcrumb>-->
				</div>
			</header>
			<Separator orientation="horizontal" class="mb-2" />
			<main>
				<RouterView />
			</main>
		</SidebarInset>
	</SidebarProvider>
</template>
