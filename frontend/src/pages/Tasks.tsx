import React, { useState } from 'react';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TaskList from '../components/TaskList';
import AddTasksModal from '../components/AddTasksModal';
import { getTasks, addTask, updateTask, deleteTask } from '../api/service';
import { Task } from '../interface/taskInterface';

const TaskPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);

    // Busca as tarefas
    const { data: tasks, isLoading, isError } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: () => getTasks(),
    });

    // Adiciona uma nova tarefa
    const addMutation = useMutation({
        mutationFn: (newTask: Omit<Task, 'id'>) => addTask(newTask.title, newTask.description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setModalOpen(false);
        },
    });

    // Atualiza uma tarefa existente
    const updateMutation = useMutation({
        mutationFn: (updatedTask: Task) => updateTask(updatedTask.id, {
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

    // Deleta uma tarefa
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const handleAddOrUpdateTask = (task: Omit<Task, "id" | "completed"> | Task) => {
        if ("id" in task) {
            updateMutation.mutate(task);
        } else {
            addMutation.mutate({ ...task, completed: false }); // Define 'completed' como false por padrão
        }
    };

    const handleEditTask = (task: Task) => {
        setCurrentTask(task);
        setModalOpen(true);
    };

    const handleDeleteTask = (id: string) => {
        deleteMutation.mutate(id);
    };

    const handleToggleComplete = (task: Task) => {
        updateMutation.mutate({ ...task, completed: !task.completed });
    };

    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography color="error">Erro ao carregar tarefas.</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Lista de Tarefas
            </Typography>
            <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
                Adicionar Tarefa
            </Button>
            <TaskList
                tasks={tasks || []}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
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
        </Container>
    );
};

export default TaskPage;
