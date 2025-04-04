import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '../pages/Login';
import { signIn } from '../api/service';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../api/service', () => ({
    signIn: jest.fn(),
}));

const mockedSignIn = signIn as jest.Mock;

const renderWithProviders = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>{ui}</BrowserRouter>
        </QueryClientProvider>
    );
};

describe('Login Page', () => {
    beforeEach(() => {
        localStorage.clear();
        mockedSignIn.mockReset();
    });

    it('deve logar com sucesso e redirecionar', async () => {
        mockedSignIn.mockResolvedValueOnce({
            accessToken: 'fake-token',
        });

        const mockNavigate = jest.fn();
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => mockNavigate,
        }));

        renderWithProviders(<Login />);

        fireEvent.change(screen.getByLabelText(/usuário/i), {
            target: { value: 'admin' },
        });
        fireEvent.change(screen.getByLabelText(/senha/i), {
            target: { value: '123456' },
        });

        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        await waitFor(() => {
            expect(mockedSignIn).toHaveBeenCalledWith('admin', '123456');

            expect(localStorage.getItem('token')).toBe('fake-token');
            expect(localStorage.getItem('username')).toBe('admin');
        });
    });

    it('deve mostrar mensagem de erro em login inválido', async () => {
        mockedSignIn.mockRejectedValueOnce({
            response: { data: { message: 'Credenciais inválidas' } },
        });

        renderWithProviders(<Login />);

        fireEvent.change(screen.getByLabelText(/usuário/i), {
            target: { value: 'user' },
        });
        fireEvent.change(screen.getByLabelText(/senha/i), {
            target: { value: 'wrongpassword' },
        });

        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/erro ao fazer login/i)).toBeInTheDocument();
        });
    });
});