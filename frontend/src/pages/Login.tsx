import React, { useState } from 'react';
import { Button, TextField, Container, CircularProgress, Typography, InputAdornment, IconButton } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../api/service';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: () => signIn(username, password),
        onSuccess: (data) => {
            const token = data.accessToken;
            localStorage.setItem("token", token);
            localStorage.setItem('username', username)
            navigate('/task');
        },
        onError: (error: any) => {
            console.error('Erro ao fazer login:', error.response?.data?.message || error.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    disabled={mutation.isPending}
                    margin="normal"
                />
                <TextField
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    disabled={mutation.isPending}
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button type="submit" variant="contained" disabled={mutation.isPending} fullWidth>
                    {mutation.isPending ? <CircularProgress size={24} /> : 'Entrar'}
                </Button>
            </form>
            {mutation.isError && (
                <Typography color="error" align="center">
                    Erro ao fazer login. Verifique suas credenciais.
                </Typography>
            )}
            <Typography align="center" sx={{ marginTop: 2 }}>
                Não tem uma conta?{' '}
                <Button variant="text" onClick={() => navigate('/register')}>
                    Cadastrar conta nova
                </Button>
            </Typography>
        </Container>
    );
}
