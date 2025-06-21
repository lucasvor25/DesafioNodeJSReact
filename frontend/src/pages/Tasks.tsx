import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TaskList from '../components/TaskList';
import AddTasksModal from '../components/AddTasksModal';
import { getTasks, addTask, updateTask, deleteTask, isLogged, logout } from '../api/service';
import { Task } from '../interface/taskInterface';
import AvatarLogout from '../components/AvatarLogout';

const TaskPage: React.FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [isModalOpen, setModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; task: Task | null }>({ open: false, task: null });

    const userName = localStorage.getItem('username') || 'Usuário';
    const token = localStorage.getItem('token');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await isLogged();
                if (!res.isAuthenticated) {
                    navigate('/login');
                }
            } catch {
                navigate('/login');
            }
        };
        checkAuth();
    }, [navigate]);

    const handleLogout = () => {
        logout();
        localStorage.removeItem('username');
        navigate('/login');
    };

    const { data: tasks, isLoading, isError } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: getTasks,
        enabled: !!token
    });

    const addMutation = useMutation({
        mutationFn: (newTask: Omit<Task, 'id'>) => addTask(newTask.title, newTask.description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (updatedTask: Task) =>
            updateTask(updatedTask.id, {
                title: updatedTask.title,
                description: updatedTask.description,
                completed: updatedTask.completed,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setModalOpen(false);
            setCurrentTask(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const handleAddOrUpdateTask = (task: Omit<Task, 'id' | 'completed'> | Task) => {
        if ('id' in task) {
            setConfirmDialog({ open: true, task });
        } else {
            addMutation.mutate({ ...task, completed: false });
        }
    };

    const confirmUpdateTask = () => {
        if (confirmDialog.task) {
            updateMutation.mutate(confirmDialog.task);
        }
        setConfirmDialog({ open: false, task: null });
    };

    const handleEditTask = (task: Task) => {
        setCurrentTask(task);
        setModalOpen(true);
    };

    const handleDeleteTask = (id: string) => {
        deleteMutation.mutate(id);
    };

    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography color="error">Erro ao carregar tarefas.</Typography>;

    return (
        <>
            <AvatarLogout userName={userName} onLogout={handleLogout} />

            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <Typography variant="h4" gutterBottom>Lista de Tarefas</Typography>
                <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
                    Adicionar Tarefa
                </Button>

                <TaskList
                    tasks={tasks || []}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggleComplete={(task) => updateMutation.mutate({ ...task, completed: !task.completed })}
                />

                <AddTasksModal
                    open={isModalOpen}
                    handleClose={() => {
                        setModalOpen(false);
                        setCurrentTask(null);
                    }}
                    handleSubmit={handleAddOrUpdateTask}
                    isLoading={addMutation.isPending || updateMutation.isPending}
                    initialTask={currentTask}
                />

                <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, task: null })}>
                    <DialogTitle>Confirmar Edição</DialogTitle>
                    <DialogContent>Tem certeza de que deseja editar esta tarefa?</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialog({ open: false, task: null })}>Cancelar</Button>
                        <Button onClick={confirmUpdateTask} color="primary">Confirmar</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default TaskPage;
