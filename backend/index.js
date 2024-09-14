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
                    { email: req.params.email },
                    { senha: req.params.senha }
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

//////////////////////////Projetos///////////////////////////////
app.get('/projetos', async (req, res) => {
    try {
        const projetos = await prisma.projeto.findMany();
        res.status(200).json(projetos);
    } catch (error) { 
        res.status(500).json({ mensagem: "Falha ao buscar os Projetos!" });
    }
});

app.get('/projetos/:id', async (req, res) => {
    try {
        const projeto = await prisma.projeto.findFirst({
            where: { id: req.query.id }
        });
        if (projeto) {
            res.status(200).json(projeto);
        } else {
            res.status(404).json({ mensagem: "Projeto não encontrado!" });
        }
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao buscar o Projeto!" });
    }
});

app.post('/projetos', async (req, res) => {
    try {
        const { nome, descricao } = req.body;
        await prisma.projeto.create({
            data: { nome, descricao },
        });
        res.status(201).json({
            mensagem: "Projeto cadastrado com sucesso!",
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao cadastrar o Projeto!" });
    }
});

app.delete('/projetos/:id', async (req, res) => {
    try {
        const projeto = await prisma.projeto.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(200).json({
            mensagem: "Projeto deletado com sucesso!",
            projeto: projeto
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao deletar o Projeto." });
    }
});

app.put('/projetos/:id', async (req, res) => {
    try {
        const projeto = await prisma.projeto.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.status(200).json({
            mensagem: "Projeto atualizado com sucesso!",
            projeto: projeto
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao atualizar o Projeto." });
    }
});


app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
