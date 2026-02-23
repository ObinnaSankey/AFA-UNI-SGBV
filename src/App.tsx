import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import Confirmation from './pages/Confirmation';
import EduDeck from './pages/EduDeck';
import Admin from './pages/Admin';
import QRPage from './pages/QRPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/edudeck" element={<EduDeck />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/qr" element={<QRPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
