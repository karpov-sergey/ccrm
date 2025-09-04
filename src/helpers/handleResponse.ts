export const handleResponse = ({ data, error }: any) => {
	if (error) throw error;

	return data;
};
