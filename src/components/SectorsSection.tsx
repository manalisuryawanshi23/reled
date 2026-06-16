import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Building2, ShoppingCart, Trophy, HardHat, ShoppingBag, Zap, Cog } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Sector } from '../lib/types';

const defaultSectors: Sector[] = [
  {
    id: '1',
    name: 'Industrial',
    slug: 'industrial',
    short_description: 'High-performance lighting for factories, warehouses, and manufacturing facilities.',
    icon_url: '',
    is_active: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Commercial',
    slug: 'commercial',
    short_description: 'Modern lighting solutions for offices, malls, and commercial spaces.',
    icon_url: '',
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Retail',
    slug: 'retail',
    short_description: 'Eye-catching displays and ambient lighting for retail environments.',
    icon_url: '',
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Sports',
    slug: 'sports',
    short_description: 'Professional-grade lighting for stadiums, arenas, and sports complexes.',
    icon_url: '',
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Infrastructure',
    slug: 'infrastructure',
    short_description: 'Reliable lighting for roads, bridges, and public infrastructure.',
    icon_url: '',
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Hospitality',
    slug: 'hospitality',
    short_description: 'Warm, inviting lighting for hotels, restaurants, and resorts.',
    icon_url: '',
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
];

const iconMap: Record<string, React.ReactNode> = {
  industrial: <Factory className="w-7 h-7" />,
  commercial: <Building2 className="w-7 h-7" />,
  retail: <ShoppingCart className="w-7 h-7" />,
  sports: <Trophy className="w-7 h-7" />,
  infrastructure: <HardHat className="w-7 h-7" />,
  hospitality: <ShoppingBag className="w-7 h-7" />,
};

export function SectorsSection() {
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

  if (loading) {
    return (
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (sectors.length === 0) return null;

  return (
    <section className="section bg-slate-50">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-royal-100 rounded-full mb-6">
            <Cog className="w-4 h-4 text-royal-600" />
            <span className="text-royal-700 text-sm font-semibold tracking-wide uppercase">Industries</span>
          </div>
          <h2 className="font-heading text-heading-1 text-charcoal-900 mb-4">
            Sectors We Serve
          </h2>
          <p className="text-slate-500 text-body-lg max-w-2xl mx-auto">
            Specialized lighting solutions engineered for diverse industries and applications
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector, index) => (
            <Link
              key={sector.id}
              to={`/sectors/${sector.slug}`}
              className="group relative bg-white rounded-2xl border border-slate-100 hover:border-gold-200 p-8 transition-all duration-500 hover:shadow-premium-lg"
            >
              {/* Sector Number */}
              <div className="absolute top-4 right-4 font-heading text-2xl font-bold text-slate-100 group-hover:text-gold-100 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 bg-slate-100 group-hover:bg-gradient-gold rounded-xl flex items-center justify-center mb-6 transition-all duration-300 text-slate-500 group-hover:text-charcoal-900">
                {iconMap[sector.slug] || <Zap className="w-7 h-7" />}
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-semibold text-charcoal-900 group-hover:text-gold-600 transition-colors mb-3">
                {sector.name}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {sector.short_description}
              </p>

              {/* Link */}
              <div className="flex items-center gap-2 text-gold-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
