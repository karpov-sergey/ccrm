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
import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from '@/components/ui/number-field';

import { Coins } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';

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

		<FormField v-slot="{ value, handleChange }" name="price">
			<FormItem>
				<FormLabel>
					{{ t('price') }}
				</FormLabel>
				<FormControl>
					<NumberField
						class="gap-2"
						:min="0"
						:step="1"
						:step-snapping="false"
						:format-options="{
							style: 'currency',
							currency: user?.user_metadata.currency,
							currencyDisplay: 'code',
							currencySign: 'accounting',
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}"
						:model-value="value"
						@update:model-value="(v) => handleChange(v ?? null)"
					>
						<NumberFieldContent>
							<NumberFieldDecrement />
							<FormControl>
								<NumberFieldInput />
							</FormControl>
							<NumberFieldIncrement />
						</NumberFieldContent>
					</NumberField>
				</FormControl>
				<FormMessage />
			</FormItem>
		</FormField>

		<FormField v-slot="{ value, handleChange }" name="paid">
			<FormItem>
				<FormLabel>
					{{ t('paid') }}
				</FormLabel>
				<FormControl>
					<NumberField
						class="gap-2"
						:min="0"
						:step="1"
						:step-snapping="false"
						:format-options="{
							style: 'currency',
							currency: user?.user_metadata.currency,
							currencyDisplay: 'code',
							currencySign: 'accounting',
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}"
						:model-value="value"
						@update:model-value="(v) => handleChange(v ?? null)"
					>
						<NumberFieldContent>
							<NumberFieldDecrement />
							<FormControl>
								<NumberFieldInput />
							</FormControl>
							<NumberFieldIncrement />
						</NumberFieldContent>
					</NumberField>
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
</template>
