'use client';
import './home.css'
import React, { useState, useEffect } from 'react';
import Header from './components/header';
import AddProjectCard from './components/addProjectCard';
import ProjectCard from './components/projectCard';
import api from '../../services/api';


const Home: React.FC = () => {
  const [showAddProjectCard, setShowAddProjectCard] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {

    const fetchProjects = async () => {
      try {
        const response = await api.get('http://localhost:3001/projetos', {}); 
        setProjects(response.data);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        <button onClick={() => setShowAddProjectCard(true)}>Adicionar Projetos</button>
        {showAddProjectCard && <AddProjectCard onClose={() => setShowAddProjectCard(false)} />}
        <div id='projetos'>
          {projects.map((project) => (
            <ProjectCard key={project.id}  project={project} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;