"use client"
import React from 'react';
import { TextField, Button, Container, Typography, Link, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('senha', senha);

    try {
      const response = await api.post('http://localhost:3001/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('id', response.data.id); 
        window.alert(response.data.mensagem);
        window.location.href = '/home';
    } catch (error) {
      window.alert(error);
    }
  };



  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" method='post' noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
        <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="senha"
            label="Senha"
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
          <Link href="/register" variant="body2">
            {"Não tem uma conta? Cadastre-se"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
