import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, Zap, ArrowRight, Phone, Mail, MapPin, Clock, Lightbulb, Factory, Cpu, Car, Waves, Sun, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';
import type { Category, Subcategory } from '../lib/types';

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

const categoryIcons: Record<string, React.ElementType> = {
  'indoor-lights': Sun,
  'magnetic-lights': Cpu,
  'profile-lights': Sparkles,
  'outdoor-lights': Lightbulb,
  'industrial': Factory,
  'facade-lights': Lightbulb,
  'under-water-light': Waves,
  'ev-chargers': Car,
};

const categoryColors: Record<string, { bg: string; gradient: string }> = {
  'indoor-lights': { bg: 'bg-amber-500', gradient: 'from-amber-500 to-orange-500' },
  'magnetic-lights': { bg: 'bg-violet-500', gradient: 'from-violet-500 to-purple-600' },
  'profile-lights': { bg: 'bg-sky-500', gradient: 'from-sky-500 to-blue-600' },
  'outdoor-lights': { bg: 'bg-emerald-500', gradient: 'from-emerald-500 to-teal-600' },
  'industrial': { bg: 'bg-slate-700', gradient: 'from-slate-700 to-slate-900' },
  'facade-lights': { bg: 'bg-rose-500', gradient: 'from-rose-500 to-pink-600' },
  'under-water-light': { bg: 'bg-cyan-500', gradient: 'from-cyan-500 to-blue-600' },
  'ev-chargers': { bg: 'bg-lime-500', gradient: 'from-lime-500 to-green-600' },
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [expandedMobileSubcategory, setExpandedMobileSubcategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (cats) {
        const { data: allSubcats } = await supabase
          .from('subcategories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        const getChildSubcats = (parentId: string): Subcategory[] => {
          return (allSubcats || [])
            .filter(s => s.parent_id === parentId)
            .map(s => ({
              ...s,
              children: getChildSubcats(s.id)
            }));
        };

        const categoriesWithSubs = cats.map(cat => ({
          ...cat,
          subcategories: (allSubcats || [])
            .filter(s => s.category_id === cat.id && !s.parent_id)
            .map(s => ({
              ...s,
              children: getChildSubcats(s.id)
            }))
        }));
        setCategories(categoriesWithSubs);
        if (categoriesWithSubs.length > 0) {
          setHoveredCategory(categoriesWithSubs[0].id);
        }
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowProductsMenu(false);
    setExpandedMobileCategory(null);
    setExpandedMobileSubcategory(null);
  }, [location]);

  const handleMenuEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setShowProductsMenu(true);
    if (categories.length > 0 && !hoveredCategory) {
      setHoveredCategory(categories[0].id);
    }
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setShowProductsMenu(false);
    }, 200);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products', hasDropdown: true },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Sectors', path: '/sectors' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/products') {
      return location.pathname === path || location.pathname.startsWith('/products/');
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Top Bar - Hidden on mobile, shown on tablet+ */}
      <div className="hidden md:block bg-slate-900 text-white">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-10 text-xs">
            <div className="flex items-center gap-6">
              {settings.phone_1 && (
                <a href={`tel:${settings.phone_1}`} className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{settings.phone_1}</span>
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{settings.email}</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-6 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Mon - Sat: 9:00 AM - 6:00 PM
              </span>
              <span className="hidden lg:flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {settings.address}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/99 backdrop-blur-xl shadow-lg shadow-slate-900/5'
            : 'md:top-10 bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 md:gap-3 group flex-shrink-0">
              <div className="relative w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 group-hover:scale-105 transition-all duration-300">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg md:text-xl text-slate-900 tracking-tight block leading-tight">
                  {settings.company_name}
                </span>
                <span className="text-[9px] md:text-[10px] text-amber-600 font-semibold tracking-[0.15em] md:tracking-[0.2em] uppercase block leading-tight">
                  LIGHTING SOLUTIONS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {link.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={handleMenuEnter}
                      onMouseLeave={handleMenuLeave}
                    >
                      <button
                        className={`flex items-center gap-1 px-4 xl:px-5 py-2 text-[13px] font-semibold tracking-wide transition-all duration-200 rounded-lg ${
                          isActive(link.path)
                            ? 'text-amber-600'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {link.name}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProductsMenu ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`block px-4 xl:px-5 py-2 text-[13px] font-semibold tracking-wide transition-colors duration-200 ${
                        isActive(link.path) ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[13px] font-semibold tracking-wide rounded-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
              >
                Get Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 -mr-2 text-slate-700 hover:text-amber-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Professional Mega Menu - Desktop */}
      <div
        className={`hidden lg:block fixed left-0 right-0 z-40 transition-all duration-300 ease-out ${
          showProductsMenu
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
        style={{ top: isScrolled ? '64px' : '120px' }}
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuLeave}
      >
        <div className="bg-white shadow-2xl shadow-slate-900/10 border-t border-slate-100">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-8 min-h-[320px]">
              {/* Categories Column */}
              <div className="col-span-2 bg-slate-50 p-6 border-r border-slate-100">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Categories</h3>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const Icon = categoryIcons[cat.slug] || Lightbulb;
                    const colors = categoryColors[cat.slug] || categoryColors['indoor-lights'];
                    const isHovered = hoveredCategory === cat.id;

                    return (
                      <Link
                        key={cat.id}
                        to={`/products/category/${cat.slug}`}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isHovered
                            ? 'bg-white shadow-sm text-slate-900 font-bold border-l-4 border-amber-500 pl-3'
                            : 'text-slate-600 hover:bg-white/50 font-medium'
                        }`}
                        onMouseEnter={() => setHoveredCategory(cat.id)}
                      >
                        <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-sm block truncate">{cat.name}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${isHovered ? 'translate-x-1 text-slate-500' : ''}`} />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Subcategories Panel */}
              <div className="col-span-6 p-6">
                {hoveredCategory ? (
                  (() => {
                    const cat = categories.find(c => c.id === hoveredCategory);
                    if (!cat) return null;
                    const colors = categoryColors[cat.slug] || categoryColors['indoor-lights'];
                    const Icon = categoryIcons[cat.slug] || Lightbulb;

                    return (
                      <div className="animate-fade-in-down">
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`} style={{ boxShadow: `0 4px 14px -3px ${colors.bg.includes('amber') ? 'rgba(245, 158, 11, 0.4)' : 'rgba(100, 116, 139, 0.3)'}` }}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">{cat.name}</h3>
                            <p className="text-xs text-slate-500">{cat.subcategories.length} subcategories</p>
                          </div>
                          <Link
                            to={`/products/category/${cat.slug}`}
                            className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                          >
                            View All
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* Subcategories Grid */}
                        {cat.subcategories.length > 0 ? (
                          <div className="grid grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-6">
                            {cat.subcategories.map((sub) => (
                              <div key={sub.id} className="space-y-3">
                                <Link
                                  to={`/products/category/${cat.slug}/${sub.slug}`}
                                  className="group flex items-center justify-between text-sm font-bold text-slate-800 hover:text-amber-600 transition-colors border-b border-slate-100 pb-1.5"
                                >
                                  <span>{sub.name}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                                {sub.children && sub.children.length > 0 && (
                                  <ul className="space-y-1">
                                    {sub.children.map((child) => (
                                      <li key={child.id}>
                                        <Link
                                          to={`/products/category/${cat.slug}/${sub.slug}/${child.slug}`}
                                          className="text-xs text-slate-500 hover:text-amber-600 transition-colors py-1.5 px-2 hover:bg-slate-50 rounded block font-medium"
                                        >
                                          {child.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400">No subcategories available</p>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div className="max-w-md">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lightbulb className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="font-semibold text-slate-700 mb-2">Explore Our Products</h3>
                      <p className="text-sm text-slate-400">
                        Hover over a category to view its subcategories
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer CTA Bar */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">
                  <strong className="text-slate-700">{categories.length}</strong> Categories
                </span>
                <span className="w-px h-4 bg-slate-200" />
                <span className="text-xs text-slate-500">
                  <strong className="text-slate-700">{categories.reduce((acc, c) => acc + c.subcategories.length, 0)}</strong> Subcategories
                </span>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
              >
                Browse All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Shadow Overlay */}
        <div className="h-8 bg-gradient-to-b from-slate-900/5 to-transparent" />
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-white transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 z-10">
          <div className="flex items-center justify-between p-4">
            <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-base text-slate-900 block">{settings.company_name}</span>
                <span className="text-[8px] text-amber-600 font-semibold tracking-widest uppercase">LIGHTING</span>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-slate-500 hover:text-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="h-full overflow-y-auto pb-24">
          {/* Mobile Nav Links */}
          <div className="p-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.hasDropdown ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => setExpandedMobileCategory(expandedMobileCategory === 'products' ? null : 'products')}
                      className={`w-full flex items-center justify-between p-4 rounded-xl font-semibold transition-colors ${
                        isActive('/products') || expandedMobileCategory === 'products'
                          ? 'bg-amber-50 text-amber-600'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>Products</span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${expandedMobileCategory === 'products' ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Mobile Categories Accordion */}
                    <div className={`overflow-hidden transition-all duration-300 ease-out ${
                      expandedMobileCategory === 'products' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="mt-2 ml-2 space-y-2">
                        <Link
                          to="/products"
                          className="block p-3 px-4 text-sm font-medium text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          All Products
                        </Link>

                        {categories.map((cat) => {
                          const colors = categoryColors[cat.slug] || categoryColors['indoor-lights'];
                          const Icon = categoryIcons[cat.slug] || Lightbulb;

                          return (
                            <div key={cat.id} className="bg-slate-50 rounded-xl overflow-hidden">
                              <div className="flex items-center border-b border-slate-100">
                                <Link
                                  to={`/products/category/${cat.slug}`}
                                  className="flex-1 flex items-center gap-2.5 p-3.5"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className="w-4 h-4 text-white" />
                                  </div>
                                  <span className="font-semibold text-slate-800 text-sm">{cat.name}</span>
                                </Link>
                                {cat.subcategories.length > 0 && (
                                  <button
                                    onClick={() => setExpandedMobileSubcategory(expandedMobileSubcategory === cat.id ? null : cat.id)}
                                    className="p-3 transition-transform"
                                  >
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                      expandedMobileSubcategory === cat.id ? 'rotate-180' : ''
                                    }`} />
                                  </button>
                                )}
                              </div>

                              {/* Mobile Subcategories */}
                              <div className={`overflow-hidden transition-all duration-300 ${
                                expandedMobileSubcategory === cat.id ? 'max-h-[500px]' : 'max-h-0'
                              }`}>
                                <div className="p-3 space-y-1 bg-white">
                                  {cat.subcategories.map((sub) => (
                                    <div key={sub.id}>
                                      <Link
                                        to={`/products/category/${cat.slug}/${sub.slug}`}
                                        className="flex items-center gap-2 py-2 px-2 text-sm text-slate-600 hover:text-amber-600 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        {sub.name}
                                      </Link>
                                      {sub.children && sub.children.length > 0 && (
                                        <div className="ml-5 space-y-0.5">
                                          {sub.children.map((child) => (
                                            <Link
                                              key={child.id}
                                              to={`/products/category/${cat.slug}/${sub.slug}/${child.slug}`}
                                              className="flex items-center gap-1 py-1.5 px-2 text-xs text-slate-400 hover:text-amber-600 transition-colors"
                                              onClick={() => setIsOpen(false)}
                                            >
                                              <ChevronRight className="w-3 h-3" />
                                              {child.name}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`block p-4 rounded-xl font-semibold transition-colors ${
                      isActive(link.path)
                        ? 'bg-amber-50 text-amber-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Contact CTA */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 mt-4">
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              Get a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            {settings.phone_1 && (
              <a
                href={`tel:${settings.phone_1}`}
                className="flex items-center justify-center gap-2 w-full py-3 mt-2 text-amber-600 font-semibold"
              >
                <Phone className="w-4 h-4" />
                {settings.phone_1}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when mega menu is open on desktop */}
      {showProductsMenu && (
        <div
          className="hidden lg:block fixed inset-0 bg-slate-900/5 backdrop-blur-[2px] z-30"
          onMouseEnter={handleMenuLeave}
        />
      )}
    </>
  );
}
