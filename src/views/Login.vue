<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.ts';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const onLoginClick = async () => {
	isLoading.value = true;

	try {
		await authStore.login(email.value, password.value);

		await router.push('/');
	} catch (error) {}
};
</script>

<template>
	<Card class="w-[350px]">
		<CardHeader>
			<CardTitle class="text-2xl"> Login </CardTitle>
			<CardDescription>
				Enter your email below to login to your account
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form class="grid gap-4" @submit.prevent="onLoginClick">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						v-model="email"
						id="email"
						type="email"
						placeholder="m@example.com"
						required
					/>
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
						<a href="#" class="ml-auto inline-block text-sm underline">
							Forgot your password?
						</a>
					</div>
					<Input v-model="password" id="password" type="password" required />
				</div>
				<Button type="submit" class="w-full" @click="onLoginClick">
					Login
				</Button>
				<Button variant="outline" class="w-full"> Login with Google </Button>
			</form>
			<div class="mt-4 text-center text-sm">
				Don't have an account?
				<RouterLink class="underline" to="/signup"> Sign up </RouterLink>
			</div>
		</CardContent>
	</Card>
</template>
