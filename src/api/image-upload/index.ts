import { supabase } from '@/api/supabase';
import { handleResponse } from '@/helpers/handleResponse.ts';

import type {
	DeleteImagePayload,
	FetchImagesPayload,
	ImageUploadPayload,
} from '@/types/common.ts';

export const uploadImage = async (data: ImageUploadPayload) => {
	const response = await supabase.storage
		.from(data.type)
		.upload(data.filePath, data.file, { cacheControl: '3600', upsert: false });

	return handleResponse<typeof response.data>(response);
};

export const fetchUserImages = async (data: FetchImagesPayload) => {
	const response = await supabase.storage.from('items').list(data.userId, {
		limit: data.options?.limit,
		offset: data.options?.offset ?? 0,
		sortBy: {
			column: data.options?.sortBy.column,
			order: data.options?.sortBy.order,
		},
	});

	return handleResponse<typeof response.data>(response);
};

export const deleteImage = async (data: DeleteImagePayload) => {
	const response = await supabase.storage
		.from(data.type)
		.remove([data.filePath]);

	return handleResponse<typeof response.data>(response);
};
