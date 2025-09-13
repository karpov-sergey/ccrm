import { createRouter, createWebHistory } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.ts';

import type { RouteRecordRaw } from 'vue-router';
import { UserNavItems, ExternalNavItems } from '@/enums/navigation/NavItems.ts';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: UserNavItems.HOME,
		component: () => import('../views/Home.vue'),
		beforeEnter: async () => {
			await loggedInHook();
		},
	},
	{
		path: '/board',
		name: UserNavItems.BOARD,
		component: () => import('../views/Board.vue'),
		beforeEnter: async () => {
			await loggedInHook();
		},
	},

	{
		path: '/account',
		name: UserNavItems.ACCOUNT,
		component: () => import('../views/Account.vue'),
		beforeEnter: async () => {
			await loggedInHook();
		},
	},

	{
		path: '/contacts',
		name: UserNavItems.CONTACTS,
		component: () => import('../views/Contacts.vue'),
		beforeEnter: async () => {
			await loggedInHook();
		},
	},

	{
		path: '/calendar',
		name: UserNavItems.CALENDAR,
		component: () => import('../views/Calendar.vue'),
		beforeEnter: async () => {
			await loggedInHook();
		},
	},

	{
		path: '/login',
		name: ExternalNavItems.LOGIN,
		component: () => import('../views/auth/Login.vue'),
		beforeEnter: async () => {
			await guestOnlyHook();
		},
	},

	{
		path: '/signup',
		name: ExternalNavItems.SIGNUP,
		component: () => import('../views/auth/SignUp.vue'),
		beforeEnter: async () => {
			await guestOnlyHook();
		},
	},

	{
		path: '/forgot-password',
		name: ExternalNavItems.FORGOT_PASSWORD,
		component: () => import('../views/auth/ForgotPassword.vue'),
		beforeEnter: async () => {
			await guestOnlyHook();
		},
	},

	{
		path: '/reset-password',
		name: ExternalNavItems.RESET_PASSWORD,
		component: () => import('../views/auth/ResetPassword.vue'),
		beforeEnter: async () => {
			await guestOnlyHook();
		},
	},
];

const ensureSessionLoaded = async () => {
	const authStore = useAuthStore();
	const { isAuthorized } = storeToRefs(authStore);

	// If we don't know yet (no token, no user), try to fetch session once
	if (!isAuthorized.value && !authStore.user) {
		await authStore.getSession();
	}
};

const loggedInHook = async () => {
	await ensureSessionLoaded();

	const { isAuthorized } = storeToRefs(useAuthStore());

	if (!isAuthorized.value) {
		await router.push({ path: '/login' });
	}
};

const guestOnlyHook = async () => {
	await ensureSessionLoaded();

	const { isAuthorized } = storeToRefs(useAuthStore());

	if (window.location.pathname !== '/reset-password' && isAuthorized.value) {
		await router.push({ path: '/' });
	}
};

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
