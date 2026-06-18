import React, { useEffect, useState } from 'react';
import { Download, FileText, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Catalogue } from '../lib/types';

export function CataloguesPage() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogues = async () => {
      const { data } = await supabase
        .from('catalogues')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) {
        setCatalogues(data);
      }
      setLoading(false);
    };

    fetchCatalogues();
  }, []);

  useEffect(() => {
    document.title = "Product Catalogues - Download PDF | RELED";
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      {/* Page Header */}
      <section className="bg-charcoal-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/20 mix-blend-multiply" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">Product Catalogues</h1>
            <p className="text-lg text-slate-300">
              Download our comprehensive product catalogues to explore our full range of innovative LED lighting solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
          ) : catalogues.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-slate-900 mb-2">No Catalogues Available</h3>
              <p className="text-slate-500">Check back later for our latest product catalogues.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {catalogues.map((catalogue) => (
                <div 
                  key={catalogue.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 group flex flex-col h-full"
                >
                  <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden flex-shrink-0">
                    {catalogue.thumbnail_url ? (
                      <img 
                        src={catalogue.thumbnail_url} 
                        alt={catalogue.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                        <FileText className="w-16 h-16 mb-2 opacity-50" />
                        <span className="text-sm font-medium">PDF Document</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-charcoal-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a 
                        href={catalogue.pdf_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
                      >
                        <Download className="w-4 h-4" /> View PDF
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    {catalogue.category && (
                      <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2">
                        {catalogue.category}
                      </span>
                    )}
                    <h3 className="font-heading font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                      {catalogue.title}
                    </h3>
                    {catalogue.description && (
                      <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-grow">
                        {catalogue.description}
                      </p>
                    )}
                    
                    <a 
                      href={catalogue.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-primary-600 font-semibold text-sm flex items-center gap-1.5 hover:text-primary-700 transition-colors"
                      download
                    >
                      <Download className="w-4 h-4" /> Download Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
