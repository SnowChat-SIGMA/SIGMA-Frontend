import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import NoticePage from './pages/NoticePage';
import GraphPage from './pages/GraphPage';
import PopularPage from './pages/PopularPage';
import LibraryPage from './pages/LibraryPage';
import SettingsPage from './pages/SettingsPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Navigate to="/notices" replace /> },
      { path: '/notices', element: <NoticePage /> },
      { path: '/graph', element: <GraphPage /> },
      { path: '/popular', element: <PopularPage /> },
      { path: '/library', element: <LibraryPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}