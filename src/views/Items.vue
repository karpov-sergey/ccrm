<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';

import { getAllItems } from '@/api/items';

import ImageUploader from '@/components/image-uploader/ImageUploader.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';

const isLoading = ref(true);

onBeforeMount(async () => {
	await fetchItems();
});

const fetchItems = async () => {
	isLoading.value = true;

	try {
		const items = await getAllItems();

		console.log(items);
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
		<template v-else> <ImageUploader /> </template>
	</section>
</template>
