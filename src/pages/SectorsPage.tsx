import React, { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ChevronRight, ArrowRight, Factory, Building2, ShoppingCart, Trophy, HardHat, ShoppingBag, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Sector } from '../lib/types';

const iconMap: Record<string, React.ReactNode> = {
  industrial: <Factory className="w-8 h-8" />,
  commercial: <Building2 className="w-8 h-8" />,
  retail: <ShoppingCart className="w-8 h-8" />,
  sports: <Trophy className="w-8 h-8" />,
  infrastructure: <HardHat className="w-8 h-8" />,
  hospitality: <ShoppingBag className="w-8 h-8" />,
};

const defaultSectors: Sector[] = [
  {
    id: '1', name: 'Industrial', slug: 'industrial',
    short_description: 'High-performance lighting for factories, warehouses, and manufacturing facilities.',
    full_description: 'Our industrial LED solutions are designed for demanding environments including factories, warehouses, and manufacturing plants. With high lumen output, excellent heat dissipation, and IP65+ ratings, our industrial lights ensure maximum productivity and safety.',
    image_url: 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true, sort_order: 0, created_at: new Date().toISOString(),
  },
  {
    id: '2', name: 'Commercial', slug: 'commercial',
    short_description: 'Modern lighting solutions for offices, malls, and commercial spaces.',
    full_description: 'Transform your commercial spaces with our energy-efficient LED lighting. Perfect for offices, shopping malls, and corporate buildings, our solutions enhance aesthetics while reducing operational costs.',
    image_url: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true, sort_order: 1, created_at: new Date().toISOString(),
  },
  {
    id: '3', name: 'Retail', slug: 'retail',
    short_description: 'Eye-catching displays and ambient lighting for retail environments.',
    full_description: 'Create compelling shopping experiences with our retail lighting solutions. From accent lighting for product displays to ambient illumination for the entire store, we help you showcase your products in the best light.',
    image_url: 'https://images.pexels.com/photos/264942/pexels-photo-264942.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true, sort_order: 2, created_at: new Date().toISOString(),
  },
  {
    id: '4', name: 'Sports', slug: 'sports',
    short_description: 'Professional-grade lighting for stadiums, arenas, and sports complexes.',
    full_description: 'Illuminate sports venues with broadcast-quality lighting. Our sports lighting solutions meet international standards for television broadcasting while providing optimal visibility for athletes and spectators.',
    image_url: 'https://images.pexels.com/photos/315866/pexels-photo-315866.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true, sort_order: 3, created_at: new Date().toISOString(),
  },
  {
    id: '5', name: 'Infrastructure', slug: 'infrastructure',
    short_description: 'Reliable lighting for roads, bridges, and public infrastructure.',
    full_description: 'Our infrastructure lighting solutions provide safe and efficient illumination for roads, bridges, tunnels, and public spaces. Built for longevity and minimal maintenance in outdoor environments.',
    image_url: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true, sort_order: 4, created_at: new Date().toISOString(),
  },
  {
    id: '6', name: 'Hospitality', slug: 'hospitality',
    short_description: 'Warm, inviting lighting for hotels, restaurants, and resorts.',
    full_description: 'Create memorable experiences with our hospitality lighting solutions. Perfect for hotels, restaurants, and resorts, our lights set the right mood while maintaining energy efficiency.',
    image_url: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true, sort_order: 5, created_at: new Date().toISOString(),
  },
];

export function SectorsPage() {
  const { sectorSlug } = useParams();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchSectors = async () => {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (!error && data && data.length > 0) setSectors(data);
      else setSectors(defaultSectors);
      setLoading(false);
    };
    fetchSectors();
  }, [sectorSlug]);

  const currentSector = sectorSlug ? sectors.find((s) => s.slug === sectorSlug) : null;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="section">
          <div className="container-wide">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (sectorSlug && !currentSector) {
    return <Navigate to="/sectors" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative bg-charcoal-950 text-white py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-900/80 to-transparent" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-3xl" />
        </div>
        <div className="container-wide relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-400 mb-6 text-sm flex-wrap">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            {currentSector ? (
              <>
                <Link to="/sectors" className="hover:text-primary-400 transition-colors">Sectors</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-primary-400">{currentSector.name}</span>
              </>
            ) : (
              <span className="text-primary-400">Sectors</span>
            )}
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-charcoal-900" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                {currentSector ? currentSector.name : 'Industries We Serve'}
              </h1>
              <p className="text-slate-300 text-base md:text-lg max-w-2xl">
                {currentSector
                  ? currentSector.short_description
                  : 'We provide specialized lighting solutions across diverse industries and applications'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section">
        <div className="container-wide">
          {currentSector ? (
            <div>
              <div className="max-w-4xl mx-auto">
                {currentSector.image_url && (
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-premium-lg mb-10">
                    <img
                      src={currentSector.image_url}
                      alt={currentSector.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="bg-white rounded-2xl shadow-card p-8 mb-10">
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {currentSector.full_description || currentSector.short_description}
                  </p>
                  <div className="mt-8">
                    <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                      View Related Products
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Other sectors */}
              <div className="border-t border-slate-200 pt-12">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal-900 mb-8 text-center">
                  Explore Other Sectors
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectors
                    .filter((s) => s.id !== currentSector.id)
                    .map((sector) => (
                      <Link
                        key={sector.id}
                        to={`/sectors/${sector.slug}`}
                        className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary-300 hover:shadow-premium-lg transition-all duration-300"
                      >
                        <div className="w-12 h-12 bg-primary-100 group-hover:bg-gradient-primary rounded-xl flex items-center justify-center mb-4 transition-all text-primary-600 group-hover:text-charcoal-900">
                          {iconMap[sector.slug] || <Factory className="w-6 h-6" />}
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-charcoal-900 group-hover:text-primary-600 mb-2 transition-colors">
                          {sector.name}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {sector.short_description}
                        </p>
                        <div className="flex items-center gap-1 text-primary-500 text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {sectors.map((sector) => (
                  <Link
                    key={sector.id}
                    to={`/sectors/${sector.slug}`}
                    className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-premium-lg transition-all duration-500"
                  >
                    {sector.image_url ? (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={sector.image_url}
                          alt={sector.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-gradient-to-br from-charcoal-900 to-charcoal-950 flex items-center justify-center">
                        <div className="text-white/20">
                          {iconMap[sector.slug] || <Factory className="w-20 h-20" />}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
                      <h3 className="font-heading text-xl md:text-2xl font-bold mb-1.5">{sector.name}</h3>
                      <p className="text-slate-300 text-sm line-clamp-2 mb-3">
                        {sector.short_description}
                      </p>
                      <div className="flex items-center gap-2 text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
