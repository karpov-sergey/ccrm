import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { UserNavItems, ExternalNavItems } from '@/enums/navigation/NavItems.ts';

const isLoggedIn = true;

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: UserNavItems.HOME,
		component: () => import('../views/Home.vue'),
		beforeEnter: async () => {
			await beforeEnterHook();
		},
	},
	{
		path: '/board',
		name: UserNavItems.BOARD,
		component: () => import('../views/Board.vue'),
		beforeEnter: async () => {
			await beforeEnterHook();
		},
	},
	{
		path: '/login',
		name: ExternalNavItems.LOGIN,
		component: () => import('../views/Login.vue'),
	},
	{
		path: '/signup',
		name: ExternalNavItems.SIGNUP,
		component: () => import('../views/SignUp.vue'),
	},
];

const beforeEnterHook = async () => {
	if (!isLoggedIn) {
		await router.push({ path: '/login' });
	}
};

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
