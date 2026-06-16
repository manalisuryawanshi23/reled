import React, { useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function FloatingButtons() {
  const { settings } = useSettings();
  const [isExpanded, setIsExpanded] = useState(false);

  const whatsappUrl = settings.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent("Hi, I'm interested in your lighting products")}`
    : '#';

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <div
        className={`bg-charcoal-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-premium-lg transition-all duration-300 ${
          isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 invisible'
        }`}
      >
        Need help? Chat with us!
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="group relative w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute right-full mr-4 px-3 py-2 bg-charcoal-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
            Chat on WhatsApp
          </span>
        </a>

        {/* Call Button */}
        {settings.phone_1 && (
          <a
            href={`tel:${settings.phone_1}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className="group relative w-14 h-14 bg-gradient-gold hover:shadow-gold-lg rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110"
          >
            <Phone className="w-6 h-6 text-charcoal-900" />
            <span className="absolute right-full mr-4 px-3 py-2 bg-charcoal-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
              Call Now
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
