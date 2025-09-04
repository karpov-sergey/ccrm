import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { Home, SquareKanban } from 'lucide-vue-next';

import { UserNavItems } from '@/enums/navigation/NavItems.ts';

import type { FunctionalComponent } from 'vue';

interface NavigationItem {
	label: string;
	to: string;
	icon: FunctionalComponent;
	id: string;
}

export const useNavigation = () => {
	const { t } = useI18n();

	const userNavItems = computed<NavigationItem[]>(() => [
		{
			label: t(UserNavItems.HOME),
			to: '/',
			icon: Home,
			id: UserNavItems.HOME,
		},
		{
			label: t(UserNavItems.BOARD),
			to: '/board',
			icon: SquareKanban,
			id: UserNavItems.BOARD,
		},
	]);

	const accountNavItems = computed<NavigationItem[]>(() => [
		{
			label: t(UserNavItems.ACCOUNT),
			to: '/account',
			icon: Home,
			id: UserNavItems.ACCOUNT,
		},
	]);

	return {
		userNavItems,
		accountNavItems,
	};
};
