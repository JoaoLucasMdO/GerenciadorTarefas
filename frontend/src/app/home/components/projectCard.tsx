import '../home.css'
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';


const remove = async (id: number) => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.delete(`http://localhost:3001/projetos/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'access-token': token,
      },
    });
    window.alert(response.data.mensagem);
    window.location.reload();
  } catch (error) {
    window.alert(error); 
  }
};

const editProject = async (id: number, updatedProject: Project) => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.put(`http://localhost:3001/projetos/${id}`, updatedProject, {
      headers: {
        'Content-Type': 'application/json',
        'access-token': token,
      },
    });
    window.alert(response.data.mensagem);
    window.location.reload();
  } catch (error) {
    window.alert(error); 
  }
};

const fetchTasks = async (projectId: number) => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get(`http://localhost:3001/tarefas/projeto/${projectId}`, {
      headers: {
        'Content-Type': 'application/json',
        'access-token': token,
      },
    });
    return response.data;
  } catch (error) {
    window.alert("Nenhuma tarefa encontrada, adicione uma!");
    return [];
  }
};

const fetchUsers = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get('http://localhost:3001/usuarios', {
      headers: {
        'Content-Type': 'application/json',
        'access-token': token,
      },
    });
    return response.data;
  } catch (error) {
    window.alert(error);
    return [];
  }
};


interface Project {
  id: number;
  nome: string;
  descricao: string;
}

interface Task {
  id: number;
  descricao: string;
  nome: string;
  responsavel:  number;
  status: string;
  dataEntrega:  string;
  projetoPertencente: number
}

interface User {
  id: number;
  nome: string;
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingTasks, setIsViewingTasks] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newTask, setNewTask] = useState({
    nome: '',
    descricao: '',
    responsavel: '',
    status: 'incompleto',
    dataEntrega: '',
    projetoPertencente: ''
  });
  const [editedProject, setEditedProject] = useState<Project>(project);

  useEffect(() => {
    if (isViewingTasks) {
      fetchTasks(project.id).then(setTasks);
      fetchUsers().then(setUsers);
    }
  }, [isViewingTasks, project.id]);


  const excluirTarefa = async (id:number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.delete(`http://localhost:3001/tarefas/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'access-token': token
        },
      });
      window.alert(response.data.mensagem);
      window.location.reload()
    } catch (error) {
      window.alert(error);
    }
  };


  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    editProject(project.id, editedProject);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedProject(project); // Reverter as alterações
  };

  const handleViewTasksClick = () => {
    setIsViewingTasks(!isViewingTasks);
  };

  const handleAddTaskClick = () => {
    setIsAddingTask(true);
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleTaskSave = async (idProject:number) => {
    const token = localStorage.getItem('token');
    try {
      newTask.projetoPertencente = `${idProject}`
      console.log(newTask)
      const response = await api.post('http://localhost:3001/tarefas', { newTask },{
        headers: {
          'Content-Type': 'application/json',
          'access-token': token
        },
      });
      window.alert(response.data.mensagem);
    setIsAddingTask(false);
  }catch(error){
    window.alert(error);
  }};

  const handleTaskCancel = () => {
    setIsAddingTask(false);
  };

  return (
    <div className='card' style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      {isEditing? (
        <div>
          <input
            type="text"
            name="nome"
            value={editedProject.nome}
            onChange={handleTaskChange}
          />
          <input
            type="text"
            name="descricao"
            value={editedProject.descricao}
            onChange={handleTaskChange}
          />
          <button onClick={handleSaveClick}>Salvar</button>
          <button className='remover' onClick={handleCancelClick}>Cancelar</button>
        </div>
      ) : (
        <div>
          <h3>Projeto: {project.nome}</h3>
          <p>Descrição: {project.descricao}</p>
          <button onClick={handleEditClick}>Editar</button>
          <button className='remover' onClick={() => remove(project.id)}>Remover</button>
          <button onClick={handleViewTasksClick}>
            {isViewingTasks ? 'Ocultar Tarefas' : 'Visualizar Tarefas'}
          </button>
          {isViewingTasks && (
            <div className='card'>
              <ul className='card-content'>
                {tasks.map((task) => (
                  <li key={task.id}>
                    Nome:{task.nome}<br />
                    Descrição:{task.descricao}<br />
                    Responsável:{task.responsavel}<br />
                    Status:{task.status}<br />
                    Data de Entrega: {task.dataEntrega} <br />
                    <button onClick={() => editarTarefa(task.id)}>Editar</button>
                    <button className='remover' onClick={() => excluirTarefa(task.id)}>Excluir</button>
                  </li>
                  
                ))}
              </ul>
              <div style={{flex:1, alignContent:'space-around'}}>
                
                <button onClick={handleAddTaskClick}>Adicionar Tarefas</button>
              </div>
              {isAddingTask && (
                <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    value={newTask.nome}
                    onChange={handleTaskChange}
                  />
                  <input
                    type="text"
                    name="descricao"
                    placeholder="Descrição"
                    value={newTask.descricao}
                    onChange={handleTaskChange}
                  />
                  <select
                    name="responsavel"
                    value={Number(newTask.responsavel)}
                    onChange={handleTaskChange}
                  >
                    <option value="">Selecione o responsável</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>{user.nome}</option>
                    ))}
                  </select>
                  <select
                    name="status"
                    value={newTask.status}
                    onChange={handleTaskChange}
                  >
                    <option value="incompleto">Incompleto</option>
                    <option value="completo">Completo</option>
                  </select>
                  <input
                    type="date"
                    name="dataEntrega"
                    value={newTask.dataEntrega}
                    onChange={handleTaskChange}
                  />
                  <button onClick={() => handleTaskSave(project.id)}>Salvar</button>
                  <button className='remover' onClick={handleTaskCancel}>Cancelar</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
