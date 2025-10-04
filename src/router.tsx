import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ArticleDetailPage from '@/pages/ArticleDetailPage';
import AuthCallback from '@/pages/AuthCallback';
import AuditReport from '@/pages/AuditReport';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

const LoadingFallback = () => (
  <div className="flex flex-1 items-center justify-center p-8">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'audit',
        element: <AuditReport />,
      },
      {
        path: 'articles/:id',
        element: <ArticleDetailPage />,
      },
      {
        path: 'category/:slug',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CategoryPage />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: 'auth/callback',
        element: <AuthCallback />,
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
