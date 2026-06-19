import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin, ArrowRight, Send, Lock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';
import type { Category } from '../lib/types';

export function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Catalogues', path: '/catalogues' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Sectors', path: '/sectors' },
    { name: 'Contact', path: '/contact' },
  ];

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-charcoal-950 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-primary">
        <div className="container-wide py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-xl md:text-2xl font-bold text-charcoal-900 mb-1">
                Stay Updated with Our Latest Products
              </h3>
              <p className="text-charcoal-700 text-sm md:text-base">
                Subscribe to our newsletter for exclusive offers and lighting tips
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-5 py-3.5 rounded-l-xl bg-white text-charcoal-900 border-0 focus:ring-0 focus:outline-none text-sm"
              />
              <button className="px-5 py-3.5 bg-charcoal-900 text-white rounded-r-xl hover:bg-charcoal-800 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" onClick={scrollTop} className="inline-flex items-center gap-3 mb-5 group">
              <img 
                src="/logo.png" 
                alt="Re LED" 
                className="h-14 w-auto object-contain bg-white rounded-lg p-1"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden flex items-center gap-3">
                <div className="w-11 h-11 bg-[#E31837] rounded-xl flex items-center justify-center shadow-primary flex-shrink-0 group-hover:scale-105 transition-all">
                  <span className="text-white font-serif font-bold text-2xl tracking-tight">Re</span>
                </div>
                <div>
                  <span className="font-black text-3xl text-white tracking-tighter block leading-none mt-1 uppercase">LED</span>
                  <span className="block text-[10px] text-slate-400 font-semibold tracking-wide capitalize mt-0.5">Roshni Jo Saath Rahe</span>
                </div>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-7 max-w-xs text-sm">
              {settings.tagline || 'Leading manufacturer of premium LED lighting solutions for commercial, industrial, and architectural applications.'}
            </p>
            <div className="flex gap-2.5">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-charcoal-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all group">
                  <Facebook className="w-4 h-4 text-slate-400 group-hover:text-charcoal-900" />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-charcoal-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all group">
                  <Instagram className="w-4 h-4 text-slate-400 group-hover:text-charcoal-900" />
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-charcoal-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all group">
                  <Youtube className="w-4 h-4 text-slate-400 group-hover:text-charcoal-900" />
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-charcoal-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all group">
                  <Linkedin className="w-4 h-4 text-slate-400 group-hover:text-charcoal-900" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-base text-white mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollTop}
                    className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories — dynamically loaded */}
          <div>
            <h4 className="font-heading font-semibold text-base text-white mb-5">Products</h4>
            <ul className="space-y-2.5">
              {categories.length === 0
                ? // skeleton placeholders while loading
                  Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="h-4 w-32 bg-charcoal-800 rounded animate-pulse" />
                  ))
                : categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/products/category/${cat.slug}`}
                        onClick={scrollTop}
                        className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group text-sm"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {cat.name}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-base text-white mb-5">Contact Us</h4>
            <ul className="space-y-4">
              {settings.address && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-charcoal-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-primary-400" />
                  </div>
                  <span className="text-slate-400 text-sm leading-relaxed">{settings.address}</span>
                </li>
              )}
              {settings.phone_1 && (
                <li>
                  <a href={`tel:${settings.phone_1}`}
                    className="flex items-center gap-3 text-slate-400 hover:text-primary-400 transition-colors text-sm">
                    <div className="w-8 h-8 bg-charcoal-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3.5 h-3.5 text-primary-400" />
                    </div>
                    {settings.phone_1}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`}
                    className="flex items-center gap-3 text-slate-400 hover:text-primary-400 transition-colors text-sm">
                    <div className="w-8 h-8 bg-charcoal-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3.5 h-3.5 text-primary-400" />
                    </div>
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-charcoal-800">
        <div className="container-wide py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-slate-500 text-xs text-center sm:text-left">
              © {currentYear} {settings.company_name}. All rights reserved. | Developed By <a href="https://www.manalitheboss.com/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">Manali The Boss</a>
            </p>
            <div className="flex gap-5 text-xs items-center">
              <Link to="/privacy" className="text-slate-500 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-500 hover:text-primary-400 transition-colors">
                Terms &amp; Conditions
              </Link>
              <span className="text-charcoal-800">|</span>
              <Link to="/admin/login" className="text-slate-500 hover:text-primary-400 transition-colors flex items-center gap-1 opacity-50 hover:opacity-100" title="Admin Access">
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
