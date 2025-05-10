import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import InquiriesPage from './pages/InquiriesPage';
import VendorPage from './pages/VendorPage';
import LoginPage from './pages/LoginPage';
import TeamDashboardPage from './pages/TeamDashboardPage';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="vendors/:vendorName" element={<VendorPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/team-dashboard" element={<TeamDashboardPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  )
}

export default App;
