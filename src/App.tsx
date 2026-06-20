import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingButtons } from './components/FloatingButtons';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { GalleryPage } from './pages/GalleryPage';
import { CataloguesPage } from './pages/CataloguesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SectorsPage } from './pages/SectorsPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts, AdminProductForm } from './pages/admin/AdminProducts';
import { AdminCategories, AdminSubcategories } from './pages/admin/AdminCategories';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminCatalogues } from './pages/admin/AdminCatalogues';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminFAQs } from './pages/admin/AdminFAQs';
import { AdminSectors } from './pages/admin/AdminSectors';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminUsers } from './pages/admin/AdminUsers';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <FloatingButtons />
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <span className="loader" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
      <Route path="/products/category/:categorySlug" element={<PublicLayout><ProductsPage /></PublicLayout>} />
      <Route path="/products/category/:categorySlug/:subcategorySlug" element={<PublicLayout><ProductsPage /></PublicLayout>} />
      <Route path="/products/category/:categorySlug/:subcategorySlug/:childSlug" element={<PublicLayout><ProductsPage /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
      <Route path="/catalogues" element={<PublicLayout><CataloguesPage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/sectors" element={<PublicLayout><SectorsPage /></PublicLayout>} />
      <Route path="/sectors/:sectorSlug" element={<PublicLayout><SectorsPage /></PublicLayout>} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/edit/:id" element={<AdminProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="subcategories" element={<AdminSubcategories />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="catalogues" element={<AdminCatalogues />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="faqs" element={<AdminFAQs />} />
        <Route path="sectors" element={<AdminSectors />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <AppRoutes />
          <PWAInstallBanner />
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
