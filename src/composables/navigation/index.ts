import { Home, SquareKanban } from 'lucide-vue-next';

import type { NavigationItem } from '@/types/Navigation.ts';

export const useNavigation = () => {
	const navItems: NavigationItem[] = [
		{
			label: 'Home',
			to: '/',
			icon: Home,
			id: 'Home',
		},
		{
			label: 'Board',
			to: '/board',
			icon: SquareKanban,
			id: 'Board',
		},
	];

	return {
		navItems,
	};
};
