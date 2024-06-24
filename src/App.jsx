import { Routes, Route, Navigate } from 'react-router-dom';
import Empresas from './components/Empresas';
import Detalle from './components/Detalle';

const App = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Navigate to="/empresas" />} />
            <Route path="/empresas" exact element={<Empresas />} />
            <Route path="/empresas/:id" element={<Detalle />} />
    </Routes>
  );
}

export default App;
