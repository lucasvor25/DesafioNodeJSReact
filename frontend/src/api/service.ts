import api from '../api/api';

export const signIn = async (username: string, password: string) => {
    const { data } = await api.post('/auth/signin', { username, password });
    return data;
};

export const signUp = async (username: string, password: string) => {
    const { data } = await api.post('/auth/register', { username, password });
    return data;
};

export const getTasks = async () => {
    const response = await api.get(`/tasks/getItem`);
    return response.data;
};

export const addTask = async (title: string, description: string) => {
    const response = await api.post('/tasks', { title, description });
    return response.data;
};

export const updateTask = async (id: string, updates: { title?: string; description?: string; completed?: boolean }) => {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
};

export const deleteTask = async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};

