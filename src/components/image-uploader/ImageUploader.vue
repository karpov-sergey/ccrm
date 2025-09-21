<script setup lang="ts">
import { ref, computed } from 'vue';
import { supabase } from '@/api/supabase';
import { useAuthStore } from '@/stores/auth';

import { deleteImage, fetchUserImages, uploadImage } from '@/api/image-upload';

const authStore = useAuthStore();

const file = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const publicUrl = ref<string | null>(null);
const isUploading = ref(false);
const userFiles = ref<Array<{ name: string; url: string; path: string }>>([]);

// Проверяем аутентификацию
const currentUserId = computed(() => authStore.currentUser?.id);

const handleFileChange = (e: Event) => {
	const target = e.target as HTMLInputElement;

	if (target.files?.length) {
		file.value = target.files[0];
		previewUrl.value = URL.createObjectURL(file.value);
	}
};

const upload = async () => {
	if (!file.value || !currentUserId.value) return;

	isUploading.value = true;

	await uploadImage({
		type: 'items',
		filePath: `${currentUserId.value}/${Date.now()}-${file.value.name}`,
		file: file.value,
	});

	// const { error } = await supabase.storage
	// 	.from('items')
	// 	.upload(filePath, file.value, { cacheControl: '3600', upsert: false });

	// const { data } = supabase.storage.from('items').getPublicUrl(filePath);
	// publicUrl.value = data.publicUrl;
	// isUploading.value = false;
	//
	// Обновляем список файлов пользователя
	await loadUserFiles();

	// // Сбрасываем форму
	// file.value = null;
	// previewUrl.value = null;
};

// Загружаем файлы текущего пользователя
const loadUserFiles = async () => {
	if (!currentUserId.value) {
		return;
	}

	const data = await fetchUserImages({
		userId: currentUserId.value,
		options: {
			limit: 100,
			offset: 0,
			sortBy: {
				column: 'created_at',
				order: 'desc',
			},
		},
	});

	//?????!!! do we need it?

	userFiles.value =
		data?.map((file) => ({
			name: file.name,
			url: supabase.storage
				.from('items')
				.getPublicUrl(`${currentUserId.value}/${file.name}`).data.publicUrl,
			path: `${currentUserId.value}/${file.name}`,
		})) || [];
};

// Удаление файла
const deleteFile = async (filePath: string) => {
	await deleteImage({
		type: 'items',
		filePath,
	});

	// Обновляем список файлов
	await loadUserFiles();
};
</script>

<template>
	<div class="space-y-6">
		<!-- Форма загрузки -->
		<div class="space-y-4">
			<h3 class="text-lg font-semibold">Загрузка изображения</h3>

			<input type="file" accept="image/*" @change="handleFileChange" />

			<div v-if="previewUrl" class="space-y-2">
				<p class="text-sm text-gray-500">Предпросмотр:</p>
				<img
					:src="previewUrl"
					class="w-40 h-40 object-cover rounded-lg border"
				/>
			</div>

			<button
				@click="upload"
				:disabled="!file || isUploading"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
			>
				{{ isUploading ? 'Загрузка...' : 'Загрузить' }}
			</button>

			<div v-if="publicUrl" class="mt-2">
				<p class="text-sm text-gray-500">Файл успешно загружен!</p>
				<a :href="publicUrl" target="_blank" class="text-blue-600 underline">
					Открыть изображение
				</a>
			</div>
		</div>

		<!-- Список файлов пользователя -->
		<div v-if="userFiles.length > 0" class="space-y-4">
			<h3 class="text-lg font-semibold">Ваши изображения</h3>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div
					v-for="userFile in userFiles"
					:key="userFile.path"
					class="border rounded-lg p-4 space-y-2"
				>
					<img
						:src="userFile.url"
						:alt="userFile.name"
						class="w-full h-40 object-cover rounded"
						loading="lazy"
					/>
					<p class="text-sm text-gray-600 truncate">{{ userFile.name }}</p>
					<div class="flex gap-2">
						<a
							:href="userFile.url"
							target="_blank"
							class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
						>
							Открыть
						</a>
						<button
							@click="deleteFile(userFile.path)"
							class="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
						>
							Удалить
						</button>
					</div>
				</div>
			</div>
		</div>

		<div v-else-if="userFiles.length === 0" class="text-gray-500">
			У вас пока нет загруженных изображений.
		</div>
	</div>
</template>
