<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.ts';

import { Badge } from '@/components/ui/badge';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Coins } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { Input } from '@/components/ui/input';

const { t } = useI18n();
const { user } = storeToRefs(useAuthStore());

const props = defineProps<{
	amountToBePaid: number;
	formattedToBePaid: string;
}>();
</script>

<template>
	<div class="w-full flex gap-2 items-center">
		<Coins class="h-4 w-4" />

		<div class="w-full grid md:grid-cols-3 gap-4">
			<FormField v-slot="{ componentField }" name="price">
				<FormItem>
					<FormLabel>
						{{ t('price') }}
					</FormLabel>
					<FormControl>
						<div class="relative">
							<Input
								class="pl-12 pt-1.5"
								type="number"
								step="any"
								v-bind="componentField"
							/>
							<span
								class="absolute start-1 inset-y-0 flex items-center justify-center px-2 text-sm"
							>
								{{ user?.user_metadata.currency }}
							</span>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>

			<FormField v-slot="{ componentField }" name="paid">
				<FormItem>
					<FormLabel>
						{{ t('paid') }}
					</FormLabel>
					<FormControl>
						<div class="relative">
							<Input
								class="pl-12 pt-1.5"
								type="number"
								step="any"
								v-bind="componentField"
							/>
							<span
								class="absolute start-1 inset-y-0 flex items-center justify-center px-2 text-sm"
							>
								{{ user?.user_metadata.currency }}
							</span>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
			<div class="flex flex-col gap-2">
				<div class="text-sm font-medium leading-none">
					{{ t('to_be_paid') }}
				</div>
				<Badge
					class="text-sm py-1.5"
					:variant="props.amountToBePaid > 0 ? 'warning' : 'success'"
				>
					{{ props.formattedToBePaid }}
				</Badge>
			</div>
		</div>
	</div>
</template>
