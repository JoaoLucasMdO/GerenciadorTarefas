const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();
const upload = require('./upload');

app.use(express.json());
//Códigos de status usados
//200 Sucesso!
//201 Sucesso no cadastro!
//400 Erro de requisição!
//404 Página não encontrada!
//500 Erro no servidor!




//////////////////////////Usuários///////////////////////////////
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.status(200).json(usuarios);
    } catch (error) { 
        res.status(500).json({ mensagem: "Falha ao buscar usuários!" });
    }
});

app.get('/usuarios/:email&:senha', async (req, res) => {
    try {
        const usuario = await prisma.usuario.findFirst({
            where: {
                AND: [
                    { email: req.query.email },
                    { senha: req.query.senha }
                ]
            }
        });
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao buscar usuário!" });
    }
});

app.post('/usuarios', upload.single('foto'), async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!req.file) {
            return res.status(400).json({ mensagem: "a Foto é obrigatória!" });
        }
        const foto = req.file.buffer;
        await prisma.usuario.create({
            data: { nome, email, senha, foto },
        });
        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao cadastrar o usuário!" });
    }
});




app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
