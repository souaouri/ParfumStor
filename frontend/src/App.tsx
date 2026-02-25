import './App.css'
import Dashboard from './dashboard/component/Dashboard'
import AdminDashboard from './dashboard/component/AdminDashboard'

function App() {
  // Check if admin route (you can improve this with proper routing library)
  const isAdmin = window.location.pathname === '/admin';
  
  return isAdmin ? <AdminDashboard /> : <Dashboard />;
}

export default App
