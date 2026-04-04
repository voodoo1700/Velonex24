import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ChatProvider } from './context/ChatContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ChatWidget from './components/chat/ChatWidget';
import HomePage from './pages/HomePage';
import TrackingPage from './pages/TrackingPage';
import ShippingPage from './pages/ShippingPage';
import LocationsPage from './pages/LocationsPage';
import SupportPage from './pages/SupportPage';
import AuthPage from './pages/AuthPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import DropOffPage from './pages/DropOffPage';
import ProfilePage from './pages/ProfilePage';
import AdminToolsPage from './pages/AdminToolsPage';
import EmailPreferencesPage from './pages/EmailPreferencesPage';
import AddressBookPage from './pages/AddressBookPage';
import BillingPage from './pages/BillingPage';
import ReportingPage from './pages/ReportingPage';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/drop-off" element={<DropOffPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin-tools" element={<AdminToolsPage />} />
        <Route path="/email-preferences" element={<EmailPreferencesPage />} />
        <Route path="/address-book" element={<AddressBookPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/reporting" element={<ReportingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <ChatWidget />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ChatProvider>
            <AppContent />
          </ChatProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
