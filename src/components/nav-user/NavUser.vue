<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/auth.ts';
import { useNavigation } from '@/composables/navigation';

import { BadgeCheck, ChevronsUpDown, LogOut, Sparkles } from 'lucide-vue-next';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';

const authStore = useAuthStore();
const { accountNavItems } = useNavigation();
const { isMobile } = useSidebar();

const { user } = storeToRefs(useAuthStore());

const avatarFallbackText = computed(() => {
	if (
		!user.value?.user_metadata.firstName &&
		!user.value?.user_metadata.lastName
	) {
		return 'U';
	}

	return `${user.value?.user_metadata.firstName.substring(0, 1)}${user.value?.user_metadata.lastName.substring(0, 1)}`;
});

const onLogoutClick = async () => {
	await authStore.logout();
	window.location.reload();
};
</script>
<template>
	<SidebarMenu>
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger as-child>
					<SidebarMenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
					>
						<Avatar class="h-8 w-8 rounded-lg">
							<!--							<AvatarImage-->
							<!--								:src="props.user.avatar"-->
							<!--								:alt="`${user?.user_metadata.firstName} ${user?.user_metadata.lastName}`"-->
							<!--							/>-->
							<AvatarFallback class="rounded-lg uppercase">
								{{ avatarFallbackText }}
							</AvatarFallback>
						</Avatar>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold capitalize">
								{{ user?.user_metadata.firstName || 'User' }}
								{{ user?.user_metadata.lastName }}
							</span>
							<span class="truncate text-xs">
								{{ user?.user_metadata.email }}
							</span>
						</div>
						<ChevronsUpDown class="ml-auto size-4" />
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
					:side="isMobile ? 'bottom' : 'right'"
					align="end"
					:side-offset="4"
				>
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<Sparkles />
							Upgrade to Pro
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<RouterLink
							v-for="item in accountNavItems"
							:to="item.to"
							:key="item.id"
						>
							<DropdownMenuItem>
								<BadgeCheck />
								{{ item.label }}
							</DropdownMenuItem>
						</RouterLink>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem class="cursor-pointer" @click="onLogoutClick">
						<LogOut />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	</SidebarMenu>
</template>
