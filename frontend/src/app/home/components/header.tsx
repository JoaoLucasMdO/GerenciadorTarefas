import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f5f5f5' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/user-image.png" alt="User" style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '1rem' }} />
        <span>Nome do Usuário</span>
      </div>
      <button>Sair</button>
    </header>
  );
};

export default Header;