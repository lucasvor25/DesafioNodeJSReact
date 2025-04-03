import React, { useState } from 'react';
import { Button, TextField, Container, CircularProgress, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../api/service';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: () => signUp(username, password),
        onSuccess: () => {
            alert('Conta criada com sucesso! Faça login.');
            navigate('/login');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
        mutate();
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>Cadastro</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Confirme a Senha"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" disabled={isPending} fullWidth>
                    {isPending ? <CircularProgress size={24} /> : 'Criar Conta'}
                </Button>
            </form>
            {isError && <Typography color="error" align="center">{(error as any)?.message || 'Erro ao criar conta'}</Typography>}

            {/* Botão para voltar para a tela de login */}
            <Typography align="center" sx={{ marginTop: 2 }}>
                Já tem uma conta?{' '}
                <Button variant="text" onClick={() => navigate('/login')}>
                    Fazer login
                </Button>
            </Typography>
        </Container>
    );
}
