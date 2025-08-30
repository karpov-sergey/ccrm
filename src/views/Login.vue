<script lang="ts">
export const description =
	"A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account.";
export const iframeHeight = '600px';
export const containerClass =
	'w-full h-screen flex items-center justify-center px-4';
</script>

<script setup lang="ts">
import { useRouter } from 'vue-router';

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

const onLoginClick = () => {
	router.push('/');
};

const onRegisterClick = () => {
	router.push('/signup');
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
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
						<a href="#" class="ml-auto inline-block text-sm underline">
							Forgot your password?
						</a>
					</div>
					<Input id="password" type="password" required />
				</div>
				<Button type="submit" class="w-full" @click="onLoginClick">
					Login
				</Button>
				<Button variant="outline" class="w-full"> Login with Google </Button>
			</div>
			<div class="mt-4 text-center text-sm">
				Don't have an account?
				<a href="#" class="underline" @click="onRegisterClick"> Sign up </a>
			</div>
		</CardContent>
	</Card>
</template>
