import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NoticePage from './pages/NoticePage';
import GraphPage from './pages/GraphPage';
import PopularPage from './pages/PopularPage';
import LibraryPage from './pages/LibraryPage';
import SettingsPage from './pages/SettingsPage';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/notices', element: <NoticePage /> },
          { path: '/graph', element: <GraphPage /> },
          { path: '/popular', element: <PopularPage /> },
          { path: '/library', element: <LibraryPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}