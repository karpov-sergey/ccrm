import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { Home, SquareKanban } from 'lucide-vue-next';

import type { NavigationItem } from '@/types/Navigation.ts';
import { UserNavItems } from '@/enums/navigation/NavItems.ts';

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

	return {
		userNavItems,
	};
};
