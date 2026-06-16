import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, Zap, ArrowRight, Lightbulb, Factory, Cpu, Car, Waves } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';
import type { Category, Subcategory } from '../lib/types';

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  'indoor-lights': Lightbulb,
  'magnetic-lights': Cpu,
  'profile-lights': Lightbulb,
  'outdoor-lights': Lightbulb,
  'industrial': Factory,
  'facade-lights': Lightbulb,
  'under-water-light': Waves,
  'ev-chargers': Car,
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [expandedMobileSubcategory, setExpandedMobileSubcategory] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowProductsMenu(false);
  }, [location]);

  const handleMenuEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setShowProductsMenu(true);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setShowProductsMenu(false);
    }, 150);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products', hasDropdown: true },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Sectors', path: '/sectors' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-lg border-b border-slate-200/50'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between h-[72px] lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-105">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">
                {settings.company_name}
              </span>
              <span className="block text-[10px] text-amber-600 font-semibold tracking-[0.2em] uppercase -mt-0.5">
                LIGHTING SOLUTIONS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={handleMenuEnter}
                    onMouseLeave={handleMenuLeave}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-1 px-5 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg ${
                        location.pathname === link.path || location.pathname.startsWith('/products/')
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {link.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProductsMenu ? 'rotate-180 text-amber-600' : ''}`} />
                    </Link>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`px-5 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg ${
                      location.pathname === link.path
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
            >
              Get a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-amber-600 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Professional Mega Menu - Desktop */}
      <div
        className={`hidden lg:block fixed left-0 right-0 top-[72px] transition-all duration-300 ease-out ${
          showProductsMenu
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuLeave}
      >
        {/* Mega Menu Container */}
        <div className="bg-white shadow-2xl shadow-slate-900/10 border-t border-slate-200">
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            {/* Categories Grid */}
            <div className="grid grid-cols-4 gap-x-8 gap-y-6">
              {categories.map((cat) => {
                const IconComponent = categoryIcons[cat.slug] || Lightbulb;
                return (
                  <div key={cat.id} className="space-y-3">
                    {/* Category Header */}
                    <Link
                      to={`/products/category/${cat.slug}`}
                      className="group flex items-center gap-2.5 pb-2 border-b-2 border-slate-100 hover:border-amber-500 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-200">
                        <IconComponent className="w-4.5 h-4.5 text-white" />
                      </div>
                      <span className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-sm tracking-tight">
                        {cat.name}
                      </span>
                    </Link>

                    {/* Subcategories */}
                    {cat.subcategories.length > 0 && (
                      <ul className="space-y-1.5">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              to={`/products/category/${cat.slug}/${sub.slug}`}
                              className="group/sub flex items-center gap-1.5 text-sm text-slate-600 hover:text-amber-600 transition-colors py-1"
                            >
                              <span className="w-1 h-1 rounded-full bg-slate-300 group-hover/sub:bg-amber-500 transition-colors" />
                              <span className="font-medium">{sub.name}</span>
                            </Link>
                            {/* Nested Subcategories */}
                            {sub.children && sub.children.length > 0 && (
                              <ul className="ml-4 mt-1 space-y-0.5">
                                {sub.children.map((child) => (
                                  <li key={child.id}>
                                    <Link
                                      to={`/products/category/${cat.slug}/${sub.slug}/${child.slug}`}
                                      className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-500 transition-colors py-0.5"
                                    >
                                      <ChevronRight className="w-3 h-3" />
                                      <span>{child.name}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Explore our complete range of <span className="font-semibold text-slate-700">{categories.reduce((acc, cat) => acc + cat.subcategories.length + cat.subcategories.reduce((a, s) => a + (s.children?.length || 0), 0), 0)}</span> product categories
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors text-sm group"
              >
                View All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Backdrop shadow */}
        <div className="h-4 bg-gradient-to-b from-slate-900/5 to-transparent" />
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-white overflow-y-auto animate-fade-in-down">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setExpandedMobileCategory(expandedMobileCategory === 'products' ? null : 'products')}
                      className={`w-full flex items-center justify-between py-3 px-4 rounded-xl font-semibold transition-all ${
                        location.pathname.startsWith('/products')
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span>Products</span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${expandedMobileCategory === 'products' ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Mobile Products Accordion */}
                    <div className={`overflow-hidden transition-all duration-300 ease-out ${
                      expandedMobileCategory === 'products' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="mt-2 ml-2 space-y-2">
                        {categories.map((cat) => (
                          <div key={cat.id} className="bg-slate-50 rounded-xl overflow-hidden">
                            {/* Mobile Category Header */}
                            <Link
                              to={`/products/category/${cat.slug}`}
                              className="flex items-center justify-between py-3 px-4 font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              <span>{cat.name}</span>
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                            </Link>

                            {/* Mobile Subcategories */}
                            {cat.subcategories.length > 0 && (
                              <div className="border-t border-slate-200 px-4 py-2 space-y-1">
                                {cat.subcategories.map((sub) => (
                                  <div key={sub.id}>
                                    {sub.children && sub.children.length > 0 ? (
                                      <div>
                                        <button
                                          onClick={() => setExpandedMobileSubcategory(expandedMobileSubcategory === sub.id ? null : sub.id)}
                                          className="w-full flex items-center justify-between py-2 text-sm font-medium text-slate-700"
                                        >
                                          <span>{sub.name}</span>
                                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedMobileSubcategory === sub.id ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-200 ${
                                          expandedMobileSubcategory === sub.id ? 'max-h-96' : 'max-h-0'
                                        }`}>
                                          <div className="pl-3 pb-2 space-y-0.5">
                                            {sub.children.map((child) => (
                                              <Link
                                                key={child.id}
                                                to={`/products/category/${cat.slug}/${sub.slug}/${child.slug}`}
                                                className="flex items-center gap-2 py-1.5 text-xs text-slate-500 hover:text-amber-600 transition-colors"
                                                onClick={() => setIsOpen(false)}
                                              >
                                                <ChevronRight className="w-3 h-3" />
                                                <span>{child.name}</span>
                                              </Link>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <Link
                                        to={`/products/category/${cat.slug}/${sub.slug}`}
                                        className="flex items-center gap-2 py-2 text-sm text-slate-600 hover:text-amber-600 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                      >
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span>{sub.name}</span>
                                      </Link>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`block py-3 px-4 rounded-xl font-semibold transition-colors ${
                      location.pathname === link.path
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile CTA */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg"
                onClick={() => setIsOpen(false)}
              >
                Get a Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
