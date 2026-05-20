import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './dashboard/component/Dashboard'
import AdminDashboard from './dashboard/component/AdminDashboard'
import ProductPage from './pages/ProductPage'
import ChatWidget from './components/ChatWidget'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={localStorage.getItem('isAdmin') === 'true' ? <AdminDashboard /> : <Navigate to="/" replace />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <ChatWidget />
    </Router>
  );
}

export default App
