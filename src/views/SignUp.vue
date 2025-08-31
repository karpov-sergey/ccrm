<script setup lang="ts">
import { ref, computed } from 'vue';
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
import { useAuthStore } from '@/stores/auth.ts';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const isLoading = ref(false);

const isSignUpValid = computed(() => {
	return true;
	// return email.value.length > 3 && password.value.length >= 6;
});

const onCreateAccountClick = async () => {
	isLoading.value = true;

	try {
		await authStore.signUp(email.value, password.value);
		await router.push('/');
	} catch (error) {
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<Card class="w-[350px]">
		<CardHeader>
			<CardTitle class="text-xl"> Sign Up </CardTitle>
			<CardDescription>
				Enter your information to create an account
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="grid gap-4">
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
					<Label for="password">Password</Label>
					<Input v-model="password" id="password" type="password" />
				</div>
				<Button
					type="submit"
					class="w-full"
					:loading="isLoading"
					:disabled="!isSignUpValid"
					@click="onCreateAccountClick"
				>
					Create an account
				</Button>
				<!--				<Button variant="outline" class="w-full"> Sign up with GitHub </Button>-->
			</div>
			<div class="mt-4 text-center text-sm">
				Already have an account?
				<RouterLink class="underline" to="/login"> Sign in </RouterLink>
			</div>
		</CardContent>
	</Card>
</template>
