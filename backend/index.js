const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

//////////////////////////Usuários///////////////////////////////
app.get('/usuarios', async (req, res) => {
    try{
        const usuarios = await prisma.usuario.findMany();
        res.json(usuarios);
    }catch{
        res.json({mensagem:"Falha ao buscar usuários!"})
    }
});

app.post('/usuarios', async (req, res) => {
    try{
        const { nome, email, senha } = req.body;
        const user = await prisma.usuario.create({
            data: { nome, email, senha },
        });
        res.json({mensagem: "Usuário cadastrado com sucesso!",
                  usuario: user
        });
    }catch{
        res.json({mensagem: "Falha ao cadastrar o usuário!"})
    }
});




app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
