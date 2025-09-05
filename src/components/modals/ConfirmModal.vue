<script setup lang="ts">
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogTrigger,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogFooter,
} from '@/components/ui/alert-dialog';

const props = defineProps<{
	title?: string;
	text?: string;
}>();

const emit = defineEmits(['confirm', 'cancel']);

const { t } = useI18n();

const isOpened = ref(false);

const onConfirm = () => {
	emit('confirm');
};
</script>

<template>
	<AlertDialog v-model:open="isOpened">
		<AlertDialogTrigger as-child>
			<slot />
		</AlertDialogTrigger>
		<AlertDialogContent class="gap-2">
			<AlertDialogTitle>
				{{ props.title || t('are_you_absolutely_sure') }}
			</AlertDialogTitle>
			<AlertDialogDescription class="mb-6">
				{{ props.text || t('this_action_cannot_be_undone') }}
			</AlertDialogDescription>
			<AlertDialogFooter>
				<AlertDialogCancel @click="onCancel">
					{{ t('no') }}
				</AlertDialogCancel>
				<AlertDialogAction @click="onConfirm">
					{{ t('yes') }}
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>
