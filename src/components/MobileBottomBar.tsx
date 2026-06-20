import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Building2, BookOpen } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface MobileBottomBarProps {
  onMenuClick?: () => void;
}

export function MobileBottomBar({ onMenuClick }: MobileBottomBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Always show at the top of the page
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling DOWN — hide
        setIsVisible(false);
      } else {
        // Scrolling UP — show
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/products') {
      return location.pathname === path || location.pathname.startsWith('/products/');
    }
    return location.pathname === path;
  };

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-50 md:hidden
        transition-transform duration-500 ease-in-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <div className="mx-4 mb-4">
        <div className="bg-charcoal-900/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 rounded-2xl p-2 flex justify-between items-center relative overflow-hidden">
          
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${isActive('/') ? 'text-primary-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link 
            to="/products" 
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${isActive('/products') ? 'text-primary-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Package className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Products</span>
          </Link>

          <Link 
            to="/sectors" 
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${isActive('/sectors') ? 'text-primary-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Building2 className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Sectors</span>
          </Link>

          <Link 
            to="/catalogues" 
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${isActive('/catalogues') ? 'text-primary-400' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Catalogues</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
