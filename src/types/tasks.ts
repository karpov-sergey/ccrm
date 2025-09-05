// Centralized types for tasks and board

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
}

export interface BoardColumn {
	id: number;
	title: string;
	tasks: Task[];
}

export interface updateTaskPayload {
	title?: string;
	status?: TaskStatus;
	user_id?: string | null;
	column_id?: number;
	description?: string | null;
	sort_index?: number | null;
	id?: string;
}

export interface BoardModel {
	columns: BoardColumn[];
}
