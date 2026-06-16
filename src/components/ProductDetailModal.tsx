import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle, Check, Zap } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import type { Product } from '../lib/types';
import { EnquiryModal } from './EnquiryModal';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { settings } = useSettings();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(false);

  const images = product.images.length > 0 ? product.images : [product.cover_image_url].filter(Boolean);

  const whatsappUrl = settings.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hi, I'm interested in ${product.name}. Please share more details.`
      )}`
    : '#';

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-charcoal-950/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-premium-xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-charcoal-900" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-charcoal-900">{product.name}</h2>
                {product.category && (
                  <span className="badge-gold text-xs">{product.category.name}</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Gallery */}
              <div className="relative bg-slate-50">
                {images.length > 0 ? (
                  <>
                    <div className="aspect-square">
                      <img
                        src={images[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-premium hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-charcoal-900" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-premium hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-charcoal-900" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`h-2 rounded-full transition-all ${
                                index === currentImageIndex ? 'w-6 bg-gold-500' : 'w-2 bg-white/70'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="aspect-square flex items-center justify-center">
                    <Zap className="w-20 h-20 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-8">
                {product.short_description && (
                  <p className="text-slate-600 text-body-lg mb-6">{product.short_description}</p>
                )}

                {product.full_description && (
                  <div className="mb-6">
                    <h4 className="font-heading font-semibold text-charcoal-900 mb-3">Description</h4>
                    <p className="text-slate-600 leading-relaxed">{product.full_description}</p>
                  </div>
                )}

                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-heading font-semibold text-charcoal-900 mb-4">Specifications</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl"
                        >
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-emerald-600" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">{key}</div>
                            <div className="font-medium text-charcoal-900 text-sm">{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setShowEnquiry(true)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Send Enquiry
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.866 9.866 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.432-9.884 9.885-9.884 2.629.001 5.101 1.024 6.963 2.885a9.827 9.827 0 012.883 6.965c-.003 5.45-4.433 9.884-9.885 9.884m8.113-18.033A13.91 13.91 0 0012.051 0C5.405 0 .027 5.378.025 12.024a12.01 12.01 0 001.607 6.006L0 24l6.09-1.602a11.984 11.984 0 005.96 1.52h.005c6.646 0 12.023-5.378 12.025-12.024a11.93 11.93 0 00-3.517-8.507" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEnquiry && (
        <EnquiryModal
          productName={product.name}
          onClose={() => setShowEnquiry(false)}
        />
      )}
    </>
  );
}
