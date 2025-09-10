
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { UserType } from '../../api/types';

export const Header: React.FC = () => {
  const { user, token, logout } = useAuthStore();

  const navLinkClasses = "text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-md text-sm font-medium";
  const activeNavLinkClasses = "text-primary-600 bg-primary-50";

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              PassIt
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={({isActive}) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses} end>
                Catálogo
              </NavLink>
              {(token || user) && (
                <>
                  <NavLink to="/create-item" className={({isActive}) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>
                    Cadastrar Item
                  </NavLink>
                  <NavLink to="/dashboard" className={({isActive}) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>
                    Dashboard
                  </NavLink>
                </>
              )}
               {user?.userType === UserType.ADMIN && (
                 <NavLink to="/admin/users" className={({isActive}) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>
                  Usuários
                </NavLink>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {(token || user) ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden sm:block">Olá, {user?.name?.split(' ')[0] || 'Usuário'}</span>
                <Button onClick={logout} variant="secondary" size="sm">
                  Sair
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Cadastrar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
