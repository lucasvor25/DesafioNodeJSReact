import { api, getAuthHeaders } from '../api/api';

export const signIn = async (username: string, password: string) => {
    const { data } = await api.post('/auth/signin', { username, password });
    return data;
};

export const signUp = async (username: string, password: string) => {
    try {
        const { data } = await api.post('/auth/signup', { username, password });
        return data;
    } catch (err: any) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 409) {
            throw new Error('Usuário já cadastrado');
        }

        if (status === 400 && Array.isArray(message)) {

            const isSenhaInvalida = message.some((msg: string) =>
                msg.toLowerCase().includes('senha')
            );

            if (isSenhaInvalida) {
                throw new Error(
                    'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um símbolo especial.'
                );
            }
        }

        throw new Error('Erro ao cadastrar. Tente novamente.');
    }
};

export const isLogged = async () => {
    const response = await api.get('/auth/isLogged', {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getTasks = async () => {
    const response = await api.get('/task/getItem', {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const addTask = async (title: string, description: string) => {
    const response = await api.post('/task/createItem', { title, description }, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const updateTask = async (id: string, updates: { title?: string; description?: string; completed?: boolean }) => {
    const response = await api.put(`/task/editItem/${id}`, updates, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const deleteTask = async (id: string) => {
    const response = await api.delete(`/task/deleteItem/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

