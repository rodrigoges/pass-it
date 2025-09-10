import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateItemForm } from './CreateItemForm';

const CreateItemPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Redirecionar para o catálogo após cadastro bem-sucedido
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Cadastrar Item
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Doe um item e faça a diferença na vida de alguém.
        </p>
      </div>

      <CreateItemForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CreateItemPage;
