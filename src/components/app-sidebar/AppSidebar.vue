<script setup lang="ts">
import { useRoute } from 'vue-router';

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

import { Home, SquareKanban } from 'lucide-vue-next';

const items = [
	{
		title: 'Home',
		url: '/',
		icon: Home,
	},
	{
		title: 'Board',
		url: '/board',
		icon: SquareKanban,
	},
];

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
						<SidebarMenuItem v-for="item in items" :key="item.title">
							<SidebarMenuButton asChild :is-active="route.path === item.url">
								<RouterLink :to="item.url">
									<component :is="item.icon" />
									<span>{{ item.title }}</span></RouterLink
								>
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
