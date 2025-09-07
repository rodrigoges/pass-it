
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} PassIt. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};
