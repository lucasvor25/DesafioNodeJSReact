import React, { useState } from 'react';
import {
    Button,
    TextField,
    Container,
    CircularProgress,
    Typography,
    List,
    ListItem,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../api/service';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: () => signUp(username, password),
        onSuccess: () => {
            alert('Conta criada com sucesso! Faça login.');
            navigate('/login');
        },
        onError: (error: any) => {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 400 && Array.isArray(message)) {
                setErrorMessages(message);
            } else if (status === 409) {
                setErrorMessages(['Usuário já cadastrado']);
            } else {
                setErrorMessages(['Erro ao criar conta. Tente novamente.']);
            }
        },
    });

    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessages([]);

        if (password !== confirmPassword) {
            setErrorMessages(['As senhas não coincidem.']);
            return;
        }

        if (!strongPasswordRegex.test(password)) {
            setErrorMessages([
                'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um símbolo especial.'
            ]);
            return;
        }

        mutation.mutate();
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Cadastro
            </Typography>
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
                <Button type="submit" variant="contained" disabled={mutation.isPending} fullWidth>
                    {mutation.isPending ? <CircularProgress size={24} /> : 'Criar Conta'}
                </Button>
            </form>

            {errorMessages.length > 0 && (
                <List sx={{ mt: 2 }}>
                    {errorMessages.map((msg, idx) => (
                        <ListItem key={idx}>
                            <Typography color="error" variant="body2">
                                • {msg}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            )}

            <Typography align="center" sx={{ marginTop: 2 }}>
                Já tem uma conta?{' '}
                <Button variant="text" onClick={() => navigate('/login')}>
                    Fazer login
                </Button>
            </Typography>
        </Container>
    );
}

