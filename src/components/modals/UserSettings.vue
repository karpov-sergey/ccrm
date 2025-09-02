<script lang="ts" setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

const isOpen = ref(false);
</script>

<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger as-child>
			<Button variant="outline"> Edit Profile </Button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Edit profile</DialogTitle>
				<DialogDescription>
					Make changes to your profile here. Click save when you're done.
				</DialogDescription>
			</DialogHeader>
		</DialogContent>
	</Dialog>
</template>
