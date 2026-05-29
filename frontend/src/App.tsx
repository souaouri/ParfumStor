import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./dashboard/component/Dashboard";
import AdminDashboard from "./dashboard/component/AdminDashboard";
import CollectionPage from "./dashboard/component/CollectionPage"; // ← Import from dashboard folder
import ProductPage from "./pages/ProductPage";
import ChatWidget from "./components/ChatWidget";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Dashboard />} />

        {/* Collection page - dynamic route for men/women/unisex */}
        <Route path="/collection/:sex" element={<CollectionPage />} />

        {/* Product detail page */}
        <Route path="/product/:id" element={<ProductPage />} />

        {/* Admin dashboard - protected route */}
        <Route
          path="/admin"
          element={
            localStorage.getItem("isAdmin") === "true" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Optional redirects for cleaner URLs */}
        <Route
          path="/men"
          element={<Navigate to="/collection/men" replace />}
        />
        <Route
          path="/women"
          element={<Navigate to="/collection/women" replace />}
        />
        <Route
          path="/unisex"
          element={<Navigate to="/collection/unisex" replace />}
        />

        {/* 404 redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatWidget />
    </Router>
  );
}

export default App;
