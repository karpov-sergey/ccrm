<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useNavigation } from '@/composables/navigation';

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
const { navItems } = useNavigation();

const user = {
	name: 'Julia Khavanskaya',
	email: 'CEO',
	avatar: '/avatars/shadcn.jpg',
};
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
						<SidebarMenuItem v-for="item in navItems" :key="item.id">
							<SidebarMenuButton asChild :is-active="route.path === item.to">
								<RouterLink :to="item.to">
									<component :is="item.icon" />
									<span>{{ item.label }}</span>
								</RouterLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
		<SidebarFooter>
			<NavUser :user="user" />
		</SidebarFooter>
	</Sidebar>
</template>
