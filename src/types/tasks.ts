import type { ChecklistItem } from './checklist';

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
}

export interface BoardModel {
	columns: BoardColumn[];
}
