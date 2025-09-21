export interface Currency {
	code: string;
	name: string;
	symbol: string;
}

export interface Option {
	value: string;
	label: string;
}

export type ImagesTypes = 'items' | 'avatars';

export interface ImageUploadPayload {
	type: ImagesTypes;
	filePath: string;
	file: File;
}

export interface FetchImagesPayload {
	userId: string;
	options: {
		limit: number;
		offset: number;
		sortBy: {
			column: string;
			order: string;
		};
	};
}

export interface DeleteImagePayload {
	type: ImagesTypes;
	filePath: string;
}
