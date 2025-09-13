
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { RequireAuth } from './components/layout/RequireAuth';
import { Spinner } from './components/ui/Spinner';
import { UserType } from './api/types';

const ItemsCatalogPage = lazy(() => import('./features/items/ItemsCatalogPage.tsx'));
const ItemDetailPage = lazy(() => import('./features/items/ItemDetailPage.tsx'));
const CreateItemPage = lazy(() => import('./features/items/CreateItemPage.tsx'));
const LoginPage = lazy(() => import('./features/auth/LoginPage.tsx'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage.tsx'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage.tsx'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage.tsx'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><Spinner /></div>}>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route index element={<ItemsCatalogPage />} />
                <Route path="items/:itemId" element={<ItemDetailPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="profile" element={<ProfilePage />} />
                
                {/* Protected Routes */}
                <Route
                  path="create-item"
                  element={
                    <RequireAuth>
                      <CreateItemPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <RequireAuth>
                      <DashboardPage />
                    </RequireAuth>
                  }
                />
                
                {/* Admin Routes (Example) */}
                {/*
                <Route
                  path="admin/users"
                  element={
                    <RequireAuth allowedRoles={[UserType.ADMIN]}>
                      <ManageUsersPage />
                    </RequireAuth>
                  }
                />
                */}

                {/* Catch-all for 404 */}
                <Route path="*" element={<div className="text-center py-10"><h2>404: Página não encontrada</h2></div>} />
                 <Route path="/unauthorized" element={<div className="text-center py-10"><h2>403: Acesso não autorizado</h2></div>} />
              </Route>
            </Routes>
          </Suspense>
        </HashRouter>
    </QueryClientProvider>
  );
}

export default App;