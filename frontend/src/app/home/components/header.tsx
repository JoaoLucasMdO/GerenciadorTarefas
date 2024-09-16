import api from '@/services/api';
import '../home.css'
import React, { useEffect, useState } from 'react';


const Header: React.FC = () => {
  


  const sair = () =>{
    localStorage.clear()
    window.location.href = '/'
  }
  
  const [nome, setNome] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem('id');
    const getNome = async() =>{
    const response = await api.get(`http://localhost:3001/usuarios/${id}`);
    console.log(response.data)
    setNome(response.data.nome);
  }
  getNome();
  }, []);


  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f5f5f5' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/user-image.png" alt="User" style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '1rem' }} />
        <span>{nome}</span>
      </div>
      <button className='remover' onClick={() => {sair()}}>Sair</button>
    </header>
  );
};

export default Header;