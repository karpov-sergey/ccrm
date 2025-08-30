import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { Home, SquareKanban } from 'lucide-vue-next';

import type { NavigationItem } from '@/types/Navigation.ts';
import { NavItems } from '@/enums/navigation/NavItems.ts';

export const useNavigation = () => {
	const { t } = useI18n();

	const navItems = computed<NavigationItem[]>(() => [
		{
			label: t(NavItems.HOME),
			to: '/',
			icon: Home,
			id: NavItems.HOME,
		},
		{
			label: t(NavItems.BOARD),
			to: '/board',
			icon: SquareKanban,
			id: NavItems.BOARD,
		},
	]);

	return {
		navItems,
		t,
	};
};
