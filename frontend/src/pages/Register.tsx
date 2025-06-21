import React, { useState } from 'react';
import {
    Button,
    TextField,
    Container,
    CircularProgress,
    Typography,
    List,
    ListItem,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../api/service';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmedPasswordVisibility = () => {
        setShowConfirmedPassword((prev) => !prev);
    };

    const mutation = useMutation({
        mutationFn: () => signUp(username, password),
        onSuccess: () => {
            alert('Conta criada com sucesso! Faça login.');
            navigate('/login');
        },
        onError: (error: any) => {

            const message = error.message;
            console.log('error122', error)
            if (message) {
                setErrorMessages([message]);
            } else {
                setErrorMessages(['Erro ao criar conta. Tente novamente.']);
            }
        },
    });

    const strongPasswordRegex = new RegExp(
        '^(?=.*[A-Z])' +
        '(?=.*\\d)' +
        '(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'"\\\\|,.<>/?])' +
        '.{8,}$'
    );

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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
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
                <TextField
                    label="Confirme a Senha"
                    type={showConfirmedPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={toggleConfirmedPasswordVisibility} edge="end">
                                    {showConfirmedPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
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

