import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import TaskPage from '../pages/Tasks';
import * as service from '../api/service';

const queryClient = new QueryClient();

jest.mock('../api/service');

describe('TaskPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('deve exibir indicador de carregamento enquanto as tarefas estão sendo buscadas', async () => {
        (service.getTasks as jest.Mock).mockImplementation(() => new Promise(() => { }));

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TaskPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});
