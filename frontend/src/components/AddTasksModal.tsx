import React, { useState, useEffect, ChangeEvent } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    CircularProgress,
} from '@mui/material';
import { Task } from '../interface/taskInterface';

interface TaskModalProps {
    open: boolean;
    handleClose: () => void;
    handleSubmit: (task: Omit<Task, 'id' | 'completed'>) => void;
    isLoading: boolean;
    initialTask?: Omit<Task, 'id' | 'completed'> | null;
}

const TaskModal: React.FC<TaskModalProps> = ({
    open,
    handleClose,
    handleSubmit,
    isLoading,
    initialTask,
}) => {
    const [task, setTask] = useState<Omit<Task, 'id' | 'completed'>>({
        title: '',
        description: '',
    });

    useEffect(() => {
        if (initialTask) {
            setTask(initialTask);
        } else {
            setTask({ title: '', description: '' });
        }
    }, [initialTask]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = () => {
        if (task.title.trim() && task.description.trim()) {
            handleSubmit(task);
        }
    };

    const isFormValid = task.title.trim() !== '' && task.description.trim() !== '';

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialTask ? 'Editar Tarefa' : 'Adicionar Tarefa'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Título"
                    type="text"
                    fullWidth
                    name="title"
                    value={task.title}
                    onChange={onChange}
                />
                <TextField
                    margin="dense"
                    label="Descrição"
                    type="text"
                    fullWidth
                    name="description"
                    value={task.description}
                    onChange={onChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button onClick={onSubmit} disabled={!isFormValid || isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskModal;
