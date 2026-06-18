import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, X, ZoomIn, Image as ImageIcon, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { GalleryItem } from '../lib/types';

export function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setGallery(data);
        const cats = [...new Set(data.map((item) => item.category).filter(Boolean))] as string[];
        setCategories(cats);
      }
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const filteredGallery = selectedCategory
    ? gallery.filter((item) => item.category === selectedCategory)
    : gallery;

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
  };

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative bg-charcoal-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-900/80 to-transparent" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container-wide relative z-10">
          <div className="flex items-center gap-2 text-slate-400 mb-6 text-sm">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary-400">Gallery</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-6 h-6 text-charcoal-900" />
            </div>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">Project Gallery</h1>
              <p className="text-slate-300 text-lg max-w-2xl">
                Explore our portfolio of completed lighting projects across various industries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section">
        <div className="container-wide">
          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-all ${
                  !selectedCategory
                    ? 'bg-gradient-primary text-charcoal-900 shadow-primary'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                All Projects
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-full font-medium text-sm transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-primary text-charcoal-900 shadow-primary'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Gallery Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-charcoal-900 mb-2">No gallery items found</h3>
              <p className="text-slate-500">Check back soon for project updates</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGallery.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl"
                >
                  <img
                    src={item.image_url}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-charcoal-900" />
                    </div>
                  </div>
                  {(item.title || item.project_name) && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-medium truncate">{item.title || item.project_name}</p>
                      {item.category && <p className="text-primary-300 text-sm">{item.category}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-charcoal-950/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white rotate-180" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-5xl max-h-[85vh] px-20" onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredGallery[lightboxIndex].image_url}
              alt={filteredGallery[lightboxIndex].title || 'Gallery image'}
              className="max-w-full max-h-[85vh] object-contain mx-auto rounded-lg"
            />
            {filteredGallery[lightboxIndex].title && (
              <p className="text-white text-center mt-4 text-lg font-medium">
                {filteredGallery[lightboxIndex].title}
              </p>
            )}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {filteredGallery.length}
          </div>
        </div>
      )}
    </main>
  );
}
