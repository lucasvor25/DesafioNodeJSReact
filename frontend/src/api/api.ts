import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};
