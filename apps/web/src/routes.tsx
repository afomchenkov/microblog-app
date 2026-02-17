import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { HomePage } from './pages/HomePage';
import { UserDetailPage } from './pages/UserDetailPage';
import { UserPage } from './pages/UserPage';

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'users/:username',
        element: <UserPage />,
      },
      {
        path: 'users/:username/details',
        element: <UserDetailPage />,
      },
    ],
  },
]);
