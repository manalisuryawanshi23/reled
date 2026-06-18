import React from 'react';
import { Phone, Mail, Facebook, Instagram, Youtube, Linkedin, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function TopBar() {
  const { settings } = useSettings();

  return (
    <div className="hidden md:block bg-charcoal-950 border-b border-charcoal-800">
      <div className="container-wide">
        <div className="flex justify-between items-center h-11">
          <div className="flex items-center gap-8">
            {settings.phone_1 && (
              <a
                href={`tel:${settings.phone_1}`}
                className="flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors text-sm font-medium"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{settings.phone_1}</span>
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors text-sm font-medium"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{settings.email}</span>
              </a>
            )}
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-charcoal-800 rounded transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-charcoal-800 rounded transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings.youtube_url && (
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-charcoal-800 rounded transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {settings.linkedin_url && (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-charcoal-800 rounded transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
