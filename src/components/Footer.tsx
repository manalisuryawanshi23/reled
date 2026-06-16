import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin, ArrowRight, Send } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Sectors', path: '/sectors' },
    { name: 'Contact', path: '/contact' },
  ];

  const productLinks = [
    { name: 'Indoor Lighting', path: '/products/category/indoor' },
    { name: 'Outdoor Lighting', path: '/products/category/outdoor' },
    { name: 'Architectural', path: '/products/category/architectural' },
    { name: 'Industrial', path: '/products/category/industrial' },
  ];

  return (
    <footer className="bg-charcoal-950 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-gold">
        <div className="container-wide py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-heading-3 text-charcoal-900 mb-2">
                Stay Updated with Our Latest Products
              </h3>
              <p className="text-charcoal-700">
                Subscribe to our newsletter for exclusive offers and lighting tips
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-6 py-4 rounded-l-xl bg-white text-charcoal-900 border-0 focus:ring-0 focus:outline-none"
              />
              <button className="px-6 py-4 bg-charcoal-900 text-white rounded-r-xl hover:bg-charcoal-800 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold">
                <Zap className="w-6 h-6 text-charcoal-900" />
              </div>
              <div>
                <span className="font-heading font-bold text-2xl text-white">{settings.company_name}</span>
                <span className="block text-xs text-gold-400 font-semibold tracking-[0.2em] uppercase">LIGHTING SOLUTIONS</span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-md">
              {settings.tagline || 'Leading manufacturer of premium LED lighting solutions for commercial, industrial, and architectural applications.'}
            </p>
            <div className="flex gap-3">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal-800 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-all group"
                >
                  <Facebook className="w-5 h-5 text-slate-400 group-hover:text-charcoal-900" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal-800 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-all group"
                >
                  <Instagram className="w-5 h-5 text-slate-400 group-hover:text-charcoal-900" />
                </a>
              )}
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal-800 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-all group"
                >
                  <Youtube className="w-5 h-5 text-slate-400 group-hover:text-charcoal-900" />
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal-800 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-all group"
                >
                  <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-charcoal-900" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-gold-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-white mb-6">Products</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-gold-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              {settings.address && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-charcoal-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-slate-400">{settings.address}</span>
                </li>
              )}
              {settings.phone_1 && (
                <li>
                  <a
                    href={`tel:${settings.phone_1}`}
                    className="flex items-center gap-3 text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    <div className="w-8 h-8 bg-charcoal-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-gold-400" />
                    </div>
                    {settings.phone_1}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-3 text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    <div className="w-8 h-8 bg-charcoal-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-gold-400" />
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
        <div className="container-wide py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} {settings.company_name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-slate-500 hover:text-gold-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-500 hover:text-gold-400 transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
