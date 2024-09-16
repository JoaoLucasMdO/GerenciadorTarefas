import React, { useState } from 'react';
import api from '../../../services/api';

interface AddProjectCardProps {
  onClose: () => void;
}

const AddProjectCard: React.FC<AddProjectCardProps> = ({ onClose }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.post('http://localhost:3001/projetos', { nome, descricao },{
        headers: {
          'Content-Type': 'application/json',
          'access-token': token
        },
      });
      window.alert(response.data.mensagem);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h2>Adicionar Projeto</h2>
      <input
        type="text"
        placeholder="Título"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />
      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />
      <button onClick={handleSave}>Salvar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

export default AddProjectCard;
