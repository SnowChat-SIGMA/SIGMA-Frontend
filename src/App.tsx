import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import NoticePage from './pages/NoticePage';
import GraphPage from './pages/GraphPage';
import PopularPage from './pages/PopularPage';
import LibraryPage from './pages/LibraryPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/notices" replace />} />
          <Route path="/notices" element={<NoticePage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}