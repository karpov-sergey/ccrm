<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useNavigation } from '@/composables/navigation';
import { useSidebar } from '@/components/ui/sidebar';
import { useScreenWidth } from '@/composables/common.ts';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar';
import NavUser from '@/components/nav-user/NavUser.vue';
import Logo from '@/components/logo/Logo.vue';

const route = useRoute();
const { userNavItems } = useNavigation();
const { toggleSidebar } = useSidebar();
const { isLargeScreen } = useScreenWidth();

watch(route, () => {
	if (!isLargeScreen.value) {
		toggleSidebar();
	}
});
</script>

<template>
	<Sidebar collapsible="icon">
		<SidebarHeader>
			<Logo />
		</SidebarHeader>
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupLabel>Application</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem v-for="item in userNavItems" :key="item.id">
							<SidebarMenuButton
								class="gap-4 text-base leading-6 hover:text-primary data-[active=true]:text-primary active:text-primary lg:text-sm"
								asChild
								size="auto"
								:is-active="route.path === item.to"
							>
								<RouterLink :to="item.to" as="div">
									<component class="w-6! h-6!" :is="item.icon" />
									<span>{{ item.label }}</span>
								</RouterLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
		<SidebarFooter>
			<NavUser />
		</SidebarFooter>
	</Sidebar>
</template>
