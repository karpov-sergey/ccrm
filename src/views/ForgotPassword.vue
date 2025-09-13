<script setup lang="ts">
import { ref } from 'vue';

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { useAuthStore } from '@/stores/auth.ts';
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
import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher.vue';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { toast } from 'vue-sonner';

import { Mail } from 'lucide-vue-next';

const authStore = useAuthStore();
const { t } = useI18n();

const isLoading = ref(false);
const isEmailSent = ref(false);

const formSchema = toTypedSchema(
	z.object({
		email: z.string().email(),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		email: '',
	},
});

const onSubmit = form.handleSubmit(async (values) => {
	isLoading.value = true;

	try {
		await authStore.resetPassword(values.email);
		toast.success(t('if_email_exists_password_reset_link_sent'));
		isEmailSent.value = true;
	} catch (error: any) {
	} finally {
		isLoading.value = false;
	}
});
</script>

<template>
	<Card
		class="grid grid-rows-[auto_1fr_auto] w-full h-dvh rounded-none border-0 shadow-none md:h-auto md:w-[500px] md:rounded-xl md:border md:shadow-md"
	>
		<CardHeader class="block">
			<CardTitle class="flex items-center justify-between text-2xl mb-4">
				{{ t('reset_password') }}
				<LanguageSwitcher />
			</CardTitle>
			<CardDescription v-if="!isEmailSent">
				{{ t('enter_your_email_to_reset_password') }}
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				v-if="!isEmailSent"
				id="login-form"
				class="grid gap-4 mb-6"
				@submit="onSubmit"
			>
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
			</form>
			<div v-else class="flex flex-col items-center justify-center gap-4">
				<Mail class="w-10 h-10 text-primary" />
				<div class="text-muted-foreground text-center">
					{{ t('if_email_exists_password_reset_link_sent') }}
					{{ t('please_check_your_inbox') }}
				</div>
			</div>
		</CardContent>
		<CardFooter v-if="!isEmailSent" class="flex flex-col">
			<Button
				type="submit"
				form="login-form"
				class="w-full mb-6"
				:loading="isLoading"
				:disabled="isLoading || !form.meta.value.valid"
			>
				{{ t('reset_password') }}
			</Button>
			<div class="w-full text-sm text-right">
				<RouterLink class="underline" to="/login">
					{{ t('go_to_login') }}
				</RouterLink>
			</div>
		</CardFooter>
	</Card>
</template>
