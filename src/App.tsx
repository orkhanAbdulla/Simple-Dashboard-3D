import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DesignersPage from './pages/DesignersPage';
import EditorPage from './pages/EditorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/designers" replace />} />
          <Route path="designers" element={<DesignersPage />} />
          <Route path="editor" element={<EditorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
