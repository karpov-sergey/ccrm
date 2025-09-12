import type { ChecklistItem } from '@/types/Checklist.ts';
import type { Contact } from '@/types/Contacts.ts';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
	id: string;
	title: string;
	status: TaskStatus;
	user_id?: string | null;
	column_id: number;
	description?: string | null;
	date?: string | null;
	sort_index?: number | null;
	checklist?: ChecklistItem[] | null;
	associated_contact: Contact | null;
	price: number | null;
	paid: number | null;
	left_to_pay: number | null;
}

export interface BoardColumn {
	id: number;
	title: string;
	tasks: Task[];
	status: TaskStatus;
}

export interface UpdateTaskPayload {
	title?: string;
	status?: TaskStatus;
	user_id?: string | null;
	column_id?: number;
	description?: string | null;
	date?: string | null;
	sort_index?: number | null;
	checklist?: ChecklistItem[] | null;
	id?: string;
	associated_contact?: Contact | null;
	price?: number | null;
	paid?: number | null;
	left_to_pay?: number | null;
}

export interface BoardModel {
	columns: BoardColumn[];
}
