import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronRight, Zap, LayoutGrid, List, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Category, Subcategory } from '../lib/types';
import { ProductDetailModal } from '../components/ProductDetailModal';

export function ProductsPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentCategory = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find((c) => c.slug === categorySlug);
  }, [categorySlug, categories]);

  const filteredSubcategories = useMemo(() => {
    if (!currentCategory) return subcategories;
    return subcategories.filter((s) => s.category_id === currentCategory.id);
  }, [currentCategory, subcategories]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (currentCategory) {
      filtered = filtered.filter((p) => p.category_id === currentCategory.id);
    }

    if (selectedSubcategory) {
      filtered = filtered.filter((p) => p.subcategory_id === selectedSubcategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.short_description?.toLowerCase().includes(query)
      );
    }

    return filtered.filter((p) => p.status === 'active');
  }, [products, currentCategory, selectedSubcategory, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [productsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        supabase.from('products').select('*, category:categories(id, name, slug), subcategory:subcategories(id, name, slug)'),
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('subcategories').select('*').eq('is_active', true).order('sort_order'),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative bg-charcoal-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-900/80 to-transparent" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container-wide relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-400 mb-6 text-sm">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            {currentCategory ? (
              <>
                <Link to="/products" className="hover:text-gold-400 transition-colors">Products</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gold-400">{currentCategory.name}</span>
              </>
            ) : (
              <span className="text-gold-400">Products</span>
            )}
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-charcoal-900" />
            </div>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">
                {currentCategory ? currentCategory.name : 'All Products'}
              </h1>
              {currentCategory?.description && (
                <p className="text-slate-300 text-lg max-w-2xl">{currentCategory.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className={`${showFilters ? 'block' : 'hidden lg:block'} lg:w-72 flex-shrink-0`}>
              <div className="sticky top-28 bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="font-heading font-semibold text-lg">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-8">
                  <label className="input-label mb-2">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field pl-10 text-sm"
                    />
                  </div>
                </form>

                {/* Categories */}
                <div className="mb-8">
                  <h4 className="font-semibold text-charcoal-900 mb-4 text-sm uppercase tracking-wider">Categories</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/products"
                        className={`block py-2.5 px-4 rounded-xl transition-all text-sm font-medium ${
                          !currentCategory
                            ? 'bg-gradient-gold text-charcoal-900'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        All Products
                      </Link>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          to={`/products/category/${cat.slug}`}
                          className={`block py-2.5 px-4 rounded-xl transition-all text-sm font-medium ${
                            currentCategory?.id === cat.id
                              ? 'bg-gradient-gold text-charcoal-900'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subcategories */}
                {filteredSubcategories.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-4 text-sm uppercase tracking-wider">Subcategories</h4>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => setSelectedSubcategory(null)}
                          className={`w-full text-left py-2.5 px-4 rounded-xl transition-all text-sm font-medium ${
                            !selectedSubcategory
                              ? 'bg-gradient-gold text-charcoal-900'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          All
                        </button>
                      </li>
                      {filteredSubcategories.map((sub) => (
                        <li key={sub.id}>
                          <button
                            onClick={() => setSelectedSubcategory(sub.id)}
                            className={`w-full text-left py-2.5 px-4 rounded-xl transition-all text-sm font-medium ${
                              selectedSubcategory === sub.id
                                ? 'bg-gradient-gold text-charcoal-900'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {sub.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden btn-ghost flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  <p className="text-slate-500 text-sm">
                    Showing <span className="font-semibold text-charcoal-900">{filteredProducts.length}</span> products
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-charcoal-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-charcoal-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Products */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-[4/3] bg-slate-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-charcoal-900 mb-2">No products found</h3>
                  <p className="text-slate-500 mb-6">Try adjusting your filters or search query</p>
                  <button onClick={() => { setSearchQuery(''); setSelectedSubcategory(null); }} className="btn-primary">
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
                }>
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`group cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-white rounded-2xl border border-slate-100 hover:border-gold-200 overflow-hidden transition-all duration-300 hover:shadow-premium-lg'
                          : 'bg-white rounded-xl border border-slate-100 hover:border-gold-200 p-4 flex gap-6 transition-all duration-300 hover:shadow-premium-lg'
                      }`}
                    >
                      {/* Image */}
                      <div className={viewMode === 'grid'
                        ? 'relative aspect-square overflow-hidden bg-slate-100'
                        : 'w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100'
                      }>
                        {product.cover_image_url || product.images[0] ? (
                          <img
                            src={product.cover_image_url || product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                            <Zap className="w-12 h-12 text-slate-300" />
                          </div>
                        )}
                        {product.category && viewMode === 'grid' && (
                          <div className="absolute top-3 left-3">
                            <span className="badge-gold text-xs">{product.category.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className={viewMode === 'grid' ? 'p-5' : 'flex-1 py-1'}>
                        {product.category && viewMode === 'list' && (
                          <span className="badge-gold text-xs mb-2">{product.category.name}</span>
                        )}
                        <h3 className={`font-heading font-semibold text-charcoal-900 mb-2 group-hover:text-gold-600 transition-colors ${
                          viewMode === 'grid' ? 'text-lg' : 'text-base'
                        }`}>
                          {product.name}
                        </h3>
                        {product.short_description && (
                          <p className={`text-slate-500 mb-4 ${viewMode === 'grid' ? 'text-sm line-clamp-2' : 'text-sm line-clamp-1'}`}>
                            {product.short_description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-gold-600 font-medium text-sm group-hover:gap-3 transition-all">
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}
