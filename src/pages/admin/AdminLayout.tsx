import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Zap,
  LayoutDashboard,
  Package,
  FolderTree,
  Mail,
  Image,
  FileText,
  MessageSquare,
  HelpCircle,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: FolderTree },
  { name: 'Enquiries', path: '/admin/enquiries', icon: Mail },
  { name: 'Gallery', path: '/admin/gallery', icon: Image },
  { name: 'Catalogues', path: '/admin/catalogues', icon: FileText },
  { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
  { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
  { name: 'Sectors', path: '/admin/sectors', icon: Building2 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-dark-100">
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-dark-900 text-white transition-transform duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-dark-800">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && <span className="font-heading font-bold text-lg">{settings?.company_name || 'LedPrisha'}</span>}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-1.5 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <ChevronRight
                className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-accent-500 text-white'
                          : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-3 border-t border-dark-800">
            <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
              {sidebarOpen && user && (
                <div className="px-3">
                  <p className="text-sm text-white truncate">{user.email}</p>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-dark-200">
          <div className="h-full px-4 flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-dark-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                target="_blank"
                className="text-sm text-dark-500 hover:text-accent-500 transition-colors"
              >
                View Website
              </Link>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-dark-950/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
