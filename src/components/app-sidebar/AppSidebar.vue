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
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar';
import NavUser from '@/components/nav-user/NavUser.vue';
import Logo from '@/components/logo/Logo.vue';

const route = useRoute();
const { userNavItems } = useNavigation();
const { setOpen, setOpenMobile } = useSidebar();
const { isLargeScreen } = useScreenWidth();

watch(route, () => {
	if (!isLargeScreen.value) {
		setOpen(false);
		setOpenMobile(false);
	}
});
</script>

<template>
	<Sidebar collapsible="icon">
		<SidebarHeader class="py-4">
			<Logo />
		</SidebarHeader>
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem
							v-for="item in userNavItems"
							class="pl-1"
							:key="item.id"
						>
							<SidebarMenuButton
								class="gap-2 text-base leading-6 hover:text-primary data-[active=true]:text-primary active:text-primary lg:text-sm pl-1"
								asChild
								size="auto"
								:is-active="route.path === item.to"
							>
								<RouterLink
									class="group-data-[collapsible=icon]:size-10!"
									:to="item.to"
									as="div"
								>
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
