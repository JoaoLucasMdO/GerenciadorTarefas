const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('./middleware/auth');
const app = express();
const prisma = new PrismaClient();
const upload = require('./upload');
const { criptografarSenha, compararSenha, gerarToken } = require('../utils/auth');

app.use(express.json());
//Códigos de status usados
//200 Sucesso!
//201 Sucesso no cadastro!
//400 Erro de requisição!
//404 Página não encontrada!
//500 Erro no servidor!




//////////////////////////Usuários///////////////////////////////
app.get('/usuarios', auth, async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.status(200).json(usuarios);
    } catch (error) { 
        res.status(500).json({ mensagem: "Falha ao buscar usuários!" });
    }
});

app.post('/cadastro', upload.single('foto'), async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!req.file) {
            return res.status(400).json({ mensagem: "A Foto é obrigatória!" });
        }
        const foto = req.file.buffer;
        const senhaCriptografada = await criptografarSenha(senha);
        await prisma.usuario.create({
            data: { nome, email, senha: senhaCriptografada, foto },
        });
        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao cadastrar o usuário!" });
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
  
    try {
      const usuario = await prisma.usuario.findUnique({ where: { email } });
  
      if (!usuario || !(await compararSenha(senha, usuario.senha))) {
        return res.status(400).json({ mensagem: 'Email ou senha inválidos.' });
      }

      const token = gerarToken(usuario.id);
      res.status(200).json({ token, id: usuario.id });
    } catch (error) {
      res.status(500).json({ mensagem: 'Erro ao fazer login.' });
    }
  });

//////////////////////////Projetos///////////////////////////////
app.get('/projetos',  async (req, res) => {
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

app.post('/projetos', auth, async (req, res) => {
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

app.delete('/projetos/:id', auth, async (req, res) => {
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

app.put('/projetos/:id', auth, async (req, res) => {
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

//////////////////////////Tarefas///////////////////////////////
app.get('/tarefas', async (req, res) => {
    try {
        const tarefas = await prisma.tarefas.findMany();
        res.status(200).json(tarefas);
    } catch (error) { 
        res.status(500).json({ mensagem: "Falha ao buscar as tarefas!" });
    }
});

app.get('/tarefas/project/:id', async (req, res) => {
    try{
        const tarefas = await prisma.tarefas.findMany({
             where: {projetoPertencente: req.params.id}
        });
        if(tarefas){
            res.status(200).json(tarefas);
        }else{
            res.status(404).json({ mensagem: "Tarefa(s) não encontrada(s)!"});
        }
    } catch(error){
        res.status(500).json({mensagem: "Falha ao buscar a Tarefa!"});
    }
});

app.get('/tarefas/:id', async (req, res) => {
    try {
        const tarefa = await prisma.tarefas.findFirst({
            where: { id: req.query.id }
        });
        if (tarefa) {
            res.status(200).json(tarefa);
        } else {
            res.status(404).json({ mensagem: "Tarefa não encontrado!" });
        }
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao buscar a Tarefa!" });
    }
});

app.post('/tarefas', auth, async (req, res) => {
    try {
        const { nome, descricao, responsavel, status, dataEntrega, projetoPertencente } = req.body;
        await prisma.tarefas.create({
            data: { nome, descricao, responsavel, status, dataEntrega, projetoPertencente },
        });
        res.status(201).json({
            mensagem: "Tarefa cadastrada com sucesso!",
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao cadastrar a Tarefa!" });
    }
});

app.delete('/tarefas/:id', auth, async (req, res) => {
    try {
        const tarefa = await prisma.tarefas.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(200).json({
            mensagem: "Tarefa deletada com sucesso!",
            tarefa: tarefa
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao deletar a Tarefa." });
    }
});

app.put('/tarefas/:id', auth, async (req, res) => {
    try {
        const tarefa = await prisma.tarefas.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.status(200).json({
            mensagem: "Tarefa atualizada com sucesso!",
            projeto: projeto
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao atualizar a Tarefa." });
    }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
