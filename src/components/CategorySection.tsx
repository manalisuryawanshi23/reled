import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category } from '../lib/types';

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (!error && data) setCategories(data);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="section bg-slate-50">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full mb-6">
            <Zap className="w-4 h-4 text-gold-600" />
            <span className="text-gold-700 text-sm font-semibold tracking-wide uppercase">Our Products</span>
          </div>
          <h2 className="font-heading text-heading-1 text-charcoal-900 mb-4">
            Explore Our Product Categories
          </h2>
          <p className="text-slate-500 text-body-lg max-w-2xl mx-auto">
            Comprehensive LED lighting solutions designed for every application, from intimate interiors to vast industrial spaces
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products/category/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 hover:border-gold-200 transition-all duration-500 hover:shadow-premium-lg"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Zap className="w-16 h-16 text-slate-300" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Category Number */}
                <div className="absolute top-4 left-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                  <span className="font-heading font-bold text-white text-sm">{String(index + 1).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-xl font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-white/70 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-gold-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span>Explore Category</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link to="/products" className="btn-secondary group">
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
