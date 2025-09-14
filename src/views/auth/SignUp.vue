<script setup lang="ts">
import { ref } from 'vue';

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth.ts';
import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher.vue';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Eye, EyeClosed } from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();

const isLoading = ref(false);
const isPasswordVisible = ref(false);

const formSchema = toTypedSchema(
	z.object({
		firstName: z.string().min(2).max(50),
		lastName: z.string().min(2).max(50),
		email: z.string().email(),
		password: z.string().min(6).max(50),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
	},
});

const onSetPasswordVisibilityClick = () => {
	isPasswordVisible.value = !isPasswordVisible.value;
};

const onSubmit = form.handleSubmit(async (values) => {
	isLoading.value = true;

	try {
		await authStore.signUp({
			email: values.email,
			password: values.password,
			options: {
				data: {
					firstName: values.firstName,
					lastName: values.lastName,
					currency: 'USD',
					timeFormat: '12h',
				},
			},
		});

		await router.push('/');
	} catch (error) {
	} finally {
		isLoading.value = false;
	}
});
</script>

<template>
	<Card
		class="grid grid-rows-[auto_1fr_auto] w-full h-dvh rounded-none border-0 shadow-none md:h-auto md:w-[500px] md:rounded-xl md:border md:shadow-md"
	>
		<CardHeader class="gap-2">
			<CardTitle class="flex items-center justify-between text-2xl">
				{{ t('signup') }}
				<LanguageSwitcher />
			</CardTitle>
			<CardDescription>
				{{ t('enter_your_information_to_create_account') }}
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form id="signup-form" class="grid gap-4" @submit="onSubmit">
				<div class="grid gap-4 items-start lg:grid-cols-2">
					<FormField v-slot="{ componentField }" name="firstName">
						<FormItem>
							<FormLabel>{{ t('first_name') }}</FormLabel>
							<FormControl>
								<Input type="text" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>

					<FormField v-slot="{ componentField }" name="lastName">
						<FormItem>
							<FormLabel>{{ t('last_name') }}</FormLabel>
							<FormControl>
								<Input type="text" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
				</div>

				<FormField v-slot="{ componentField }" name="email">
					<FormItem>
						<FormLabel>{{ t('email') }}</FormLabel>
						<FormControl>
							<Input
								type="text"
								v-bind="componentField"
								placeholder="m@example.com"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="password">
					<FormItem class="relative mb-6">
						<FormLabel>{{ t('password') }}</FormLabel>
						<FormControl>
							<Input
								class="pr-10"
								:type="isPasswordVisible ? 'text' : 'password'"
								v-bind="componentField"
							/>
							<Button
								class="absolute end-0 inset-y-5.5 hover:bg-transparent"
								size="icon"
								variant="ghost"
								type="button"
								:aria-label="
									isPasswordVisible ? t('hide_password') : t('show_password')
								"
								@click="onSetPasswordVisibilityClick"
							>
								<Eye v-if="!isPasswordVisible" />
								<EyeClosed v-if="isPasswordVisible" />
							</Button>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
			</form>
		</CardContent>

		<CardFooter class="flex flex-col">
			<Button
				type="submit"
				form="signup-form"
				class="w-full mb-6"
				:loading="isLoading"
				:disabled="isLoading || !form.meta.value.valid"
			>
				{{ t('create_an_account') }}
			</Button>
			<div class="w-full text-sm text-right">
				{{ t('already_have_an_account') }}
				<RouterLink class="underline" to="/Login">
					{{ t('login') }}
				</RouterLink>
			</div>
		</CardFooter>
	</Card>
</template>
