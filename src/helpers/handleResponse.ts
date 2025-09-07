export function handleResponse<T>({ data, error }: { data: T; error: unknown }): T {
	if (error) throw error as Error;
	return data as T;
}
