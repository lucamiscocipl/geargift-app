import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import InquiriesPage from './pages/InquiriesPage';
import VendorPage from './pages/VendorPage';
import './App.css'; // Keep if you have global App-specific styles, or remove if not used

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          {/* Example route for a vendor, you'll make this dynamic */}
          <Route path="vendors/:vendorName" element={<VendorPage />} />
        </Route>
      </Routes>
  )
}

export default App
