import React from 'react';
import api from '../../../services/api';

const remove = async (id:number) => {
  const token = localStorage.getItem('token')
  try {
    const response = await api.delete(`http://localhost:3001/projetos/${id}`,  {
      headers: {
        'Content-Type': 'application/json',
        'access-token': token
      },
    });
    window.alert(response.data.mensagem);
    window.location.reload();
  } catch (error) {
    window.alert(error);
  }
};


interface Project {
  id: number;
  nome: string;
  descricao: string;
}

const ProjectCard: React.FC <{project: Project}> = ({ project }) => (
  <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
    <h3>{project.nome}</h3>
    <p>{project.descricao}</p>
    <button >Editar</button>
    <button onClick={() => remove(project.id)}>Remover</button>
  </div>
);

export default ProjectCard;