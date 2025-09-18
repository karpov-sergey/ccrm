<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/api/supabase';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const file = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const publicUrl = ref<string | null>(null);
const isUploading = ref(false);
const userFiles = ref<Array<{ name: string; url: string; path: string }>>([]);

// Проверяем аутентификацию
const isAuthenticated = computed(() => authStore.isAuthorized);
const currentUserId = computed(() => authStore.currentUser?.id);

// Инициализация при загрузке
onMounted(async () => {
	await authStore.getSession();
	if (isAuthenticated.value) {
		await loadUserFiles();
	}
});

const handleFileChange = (e: Event) => {
	const target = e.target as HTMLInputElement;
	if (target.files?.length) {
		file.value = target.files[0];
		previewUrl.value = URL.createObjectURL(file.value);
	}
};

const uploadImage = async () => {
	if (!file.value || !currentUserId.value) return;

	if (!isAuthenticated.value) {
		console.error('Пользователь не авторизован');
		return;
	}

	isUploading.value = true;

	// Создаем путь в персональной папке пользователя
	const filePath = `${currentUserId.value}/${Date.now()}-${file.value.name}`;

	const { error } = await supabase.storage
		.from('items')
		.upload(filePath, file.value, { cacheControl: '3600', upsert: false });

	if (error) {
		console.error('Ошибка загрузки:', error);
		isUploading.value = false;
		return;
	}

	const { data } = supabase.storage.from('items').getPublicUrl(filePath);
	publicUrl.value = data.publicUrl;
	isUploading.value = false;

	// Обновляем список файлов пользователя
	await loadUserFiles();

	// Сбрасываем форму
	file.value = null;
	previewUrl.value = null;
};

// Загружаем файлы текущего пользователя
const loadUserFiles = async () => {
	if (!currentUserId.value) return;

	const { data, error } = await supabase.storage
		.from('items')
		.list(currentUserId.value, {
			limit: 100,
			offset: 0,
			sortBy: { column: 'created_at', order: 'desc' },
		});

	if (error) {
		console.error('Ошибка загрузки файлов:', error);
		return;
	}

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
	const { error } = await supabase.storage.from('items').remove([filePath]);

	if (error) {
		console.error('Ошибка удаления:', error);
		return;
	}

	// Обновляем список файлов
	await loadUserFiles();
};
</script>

<template>
	<section class="py-4">
		<div
			v-if="!isAuthenticated"
			class="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded"
		>
			Для загрузки изображений необходимо войти в систему.
		</div>

		<div class="space-y-6">
			<!-- Форма загрузки -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold">Загрузка изображения</h3>

				<input
					type="file"
					accept="image/*"
					@change="handleFileChange"
					:disabled="!isAuthenticated"
				/>

				<div v-if="previewUrl" class="space-y-2">
					<p class="text-sm text-gray-500">Предпросмотр:</p>
					<img
						:src="previewUrl"
						class="w-40 h-40 object-cover rounded-lg border"
					/>
				</div>

				<button
					@click="uploadImage"
					:disabled="!file || isUploading || !isAuthenticated"
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
			<div v-if="isAuthenticated && userFiles.length > 0" class="space-y-4">
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

			<div
				v-else-if="isAuthenticated && userFiles.length === 0"
				class="text-gray-500"
			>
				У вас пока нет загруженных изображений.
			</div>
		</div>
	</section>
</template>
