<script setup lang="ts">
import { ref, onBeforeMount, nextTick } from 'vue';

import { getAllItems } from '@/api/items';

import { Button } from '@/components/ui/button';
import EditItem from '@/components/modals/edit-item/EditItem.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import type { Item as ItemType } from '@/types/Items.ts';

const isLoading = ref(true);
const isCreation = ref(false);

const editingItem = ref<ItemType | undefined>(undefined);
const editModalRef = ref<any>(null);

const items = ref<ItemType[]>([]);

onBeforeMount(async () => {
	await fetchItems();
});

const onCreateClick = async () => {
	isCreation.value = true;
	editingItem.value = undefined;

	await nextTick();

	editModalRef.value?.open?.();
};

const fetchItems = async () => {
	isLoading.value = true;

	try {
		items.value = await getAllItems();
	} catch (error) {
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<section
		class="p-4"
		:class="{ 'flex justify-center items-center h-full': isLoading }"
	>
		<Spinner v-if="isLoading" />
		<template v-else>
			<Button @click="onCreateClick">+</Button>

			<EditItem
				ref="editModalRef"
				:contact="editingItem"
				:is-creation="isCreation"
				@item-updated="fetchItems"
				@item-removed="fetchItems"
			/>

			<div v-for="item in items" :key="item.id">
				{{ item.title }}
			</div>
		</template>
	</section>
</template>
