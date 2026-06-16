import React, { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ChevronRight, ArrowRight, Factory, Building2, ShoppingCart, Trophy, HardHat, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Sector } from '../lib/types';

const iconMap: Record<string, React.ReactNode> = {
  industrial: <Factory className="w-10 h-10" />,
  commercial: <Building2 className="w-10 h-10" />,
  retail: <ShoppingCart className="w-10 h-10" />,
  sports: <Trophy className="w-10 h-10" />,
  infrastructure: <HardHat className="w-10 h-10" />,
  hospitality: <ShoppingBag className="w-10 h-10" />,
};

const defaultSectors: Sector[] = [
  {
    id: '1',
    name: 'Industrial',
    slug: 'industrial',
    short_description: 'High-performance lighting for factories, warehouses, and manufacturing facilities.',
    full_description: 'Our industrial LED solutions are designed for demanding environments including factories, warehouses, and manufacturing plants. With high lumen output, excellent heat dissipation, and IP65+ ratings, our industrial lights ensure maximum productivity and safety.',
    image_url: 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Commercial',
    slug: 'commercial',
    short_description: 'Modern lighting solutions for offices, malls, and commercial spaces.',
    full_description: 'Transform your commercial spaces with our energy-efficient LED lighting. Perfect for offices, shopping malls, and corporate buildings, our solutions enhance aesthetics while reducing operational costs.',
    image_url: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Retail',
    slug: 'retail',
    short_description: 'Eye-catching displays and ambient lighting for retail environments.',
    full_description: 'Create compelling shopping experiences with our retail lighting solutions. From accent lighting for product displays to ambient illumination for the entire store, we help you showcase your products in the best light.',
    image_url: 'https://images.pexels.com/photos/264942/pexels-photo-264942.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Sports',
    slug: 'sports',
    short_description: 'Professional-grade lighting for stadiums, arenas, and sports complexes.',
    full_description: 'Illuminate sports venues with broadcast-quality lighting. Our sports lighting solutions meet international standards for television broadcasting while providing optimal visibility for athletes and spectators.',
    image_url: 'https://images.pexels.com/photos/315866/pexels-photo-315866.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Infrastructure',
    slug: 'infrastructure',
    short_description: 'Reliable lighting for roads, bridges, and public infrastructure.',
    full_description: 'Our infrastructure lighting solutions provide safe and efficient illumination for roads, bridges, tunnels, and public spaces. Built for longevity and minimal maintenance in outdoor environments.',
    image_url: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Hospitality',
    slug: 'hospitality',
    short_description: 'Warm, inviting lighting for hotels, restaurants, and resorts.',
    full_description: 'Create memorable experiences with our hospitality lighting solutions. Perfect for hotels, restaurants, and resorts, our lights set the right mood while maintaining energy efficiency.',
    image_url: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
];

export function SectorsPage() {
  const { sectorSlug } = useParams();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const currentSector = sectorSlug
    ? sectors.find((s) => s.slug === sectorSlug)
    : null;

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-dark-100 rounded-xl animate-pulse" />
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
    <main className="min-h-screen bg-white">
      <section className="bg-dark-950 text-white py-16">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-dark-400 mb-4">
            <Link to="/" className="hover:text-accent-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            {currentSector ? (
              <>
                <Link to="/sectors" className="hover:text-accent-400 transition-colors">Sectors</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-accent-400">{currentSector.name}</span>
              </>
            ) : (
              <span className="text-accent-400">Sectors</span>
            )}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            {currentSector ? currentSector.name : 'Industries We Serve'}
          </h1>
          <p className="text-dark-300 text-lg mt-4 max-w-2xl">
            {currentSector
              ? currentSector.short_description
              : 'We provide specialized lighting solutions across diverse industries and applications'}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {currentSector ? (
            <div>
              <div className="max-w-4xl mx-auto">
                {currentSector.image_url && (
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-lg mb-8">
                    <img
                      src={currentSector.image_url}
                      alt={currentSector.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="prose prose-lg max-w-none">
                  <p className="text-dark-600 text-lg leading-relaxed">
                    {currentSector.full_description || currentSector.short_description}
                  </p>
                </div>
                <div className="mt-8">
                  <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                    View Related Products
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="mt-16 border-t border-dark-200 pt-16">
                <h2 className="font-heading text-3xl font-bold text-dark-900 mb-8 text-center">
                  Other Sectors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectors
                    .filter((s) => s.id !== currentSector.id)
                    .map((sector) => (
                      <Link
                        key={sector.id}
                        to={`/sectors/${sector.slug}`}
                        className="group p-6 bg-dark-50 rounded-xl hover:bg-dark-900 transition-all duration-300"
                      >
                        <div className="w-14 h-14 bg-accent-500/10 group-hover:bg-accent-500 rounded-xl flex items-center justify-center mb-4 transition-colors text-accent-500 group-hover:text-white">
                          {iconMap[sector.slug] || <Factory className="w-10 h-10" />}
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-dark-900 group-hover:text-white mb-2 transition-colors">
                          {sector.name}
                        </h3>
                        <p className="text-dark-500 group-hover:text-dark-300 transition-colors text-sm">
                          {sector.short_description}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sectors.map((sector) => (
                  <Link
                    key={sector.id}
                    to={`/sectors/${sector.slug}`}
                    className="group relative overflow-hidden rounded-2xl card-hover"
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
                      <div className="aspect-[4/3] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <div className="text-white/30">
                          {iconMap[sector.slug] || <Factory className="w-20 h-20" />}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="font-heading text-2xl font-bold mb-2">{sector.name}</h3>
                      <p className="text-dark-300 text-sm line-clamp-2 mb-3">
                        {sector.short_description}
                      </p>
                      <div className="flex items-center gap-2 text-accent-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
