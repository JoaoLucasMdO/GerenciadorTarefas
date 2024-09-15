const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const criptografarSenha = async (senha) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(senha, salt);
};

const compararSenha = async (senha, senhaCriptografada) => {
  return await bcrypt.compare(senha, senhaCriptografada);
};

const gerarToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

module.exports = { criptografarSenha, compararSenha, gerarToken };
