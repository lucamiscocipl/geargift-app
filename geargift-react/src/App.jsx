import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import InquiriesPage from './pages/InquiriesPage';
import VendorPage from './pages/VendorPage';
import LoginPage from './pages/LoginPage';
import TeamDashboardPage from './pages/TeamDashboardPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="vendors/:vendorName" element={<VendorPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/team-dashboard" element={<TeamDashboardPage />} />
    </Routes>
  )
}

export default App
